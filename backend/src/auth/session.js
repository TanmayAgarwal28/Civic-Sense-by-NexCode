import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { getAllUsers } from '../db/database.js';
import { CONFIG } from '../config.js';

const SESSION_TTL_SECONDS = 8 * 60 * 60;
const SESSION_SECRET = CONFIG.AUTH_TOKEN_SECRET || randomBytes(32).toString('hex');

if (!CONFIG.AUTH_TOKEN_SECRET) {
  console.warn('[CivicSense Auth] AUTH_TOKEN_SECRET is unset; sessions will be revoked when the server restarts.');
}

export function createSessionToken(user) {
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  })).toString('base64url');
  const signature = createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');

  return `${payload}.${signature}`;
}

function verifySessionToken(token) {
  if (typeof token !== 'string') return null;

  const [payload, signature, ...extraParts] = token.split('.');
  if (!payload || !signature || extraParts.length > 0) return null;

  const expectedSignature = createHmac('sha256', SESSION_SECRET).update(payload).digest();
  const receivedSignature = Buffer.from(signature, 'base64url');
  if (
    receivedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(receivedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      typeof claims.sub !== 'string' ||
      typeof claims.role !== 'string' ||
      !Number.isInteger(claims.exp) ||
      claims.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return claims;
  } catch {
    return null;
  }
}

export function requireAdminRole(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer (.+)$/i);
  const claims = match ? verifySessionToken(match[1]) : null;

  if (!claims) {
    return res.status(401).json({
      success: false,
      message: 'A valid login session is required to access this resource.'
    });
  }

  if (claims.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only Campus Administrators are authorized to access or modify the database.'
    });
  }

  const user = getAllUsers().find((candidate) => candidate.id === claims.sub);
  if (!user || user.role !== 'admin' || user.isActive === false) {
    return res.status(403).json({
      success: false,
      message: 'This administrator account is no longer authorized.'
    });
  }

  next();
}
