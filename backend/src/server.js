import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';
import issuesRouter from './routes/issues.js';
import triageRouter from './routes/triage.js';
import scenariosRouter from './routes/scenarios.js';
import analyticsRouter from './routes/analytics.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import workerRouter from './routes/worker.js';
import { readDatabase } from './db/database.js';
import { logActivity, getActivityLogs } from './db/activityLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads directory
app.use('/uploads', express.static(CONFIG.UPLOADS_DIR));

// Automated Server Telemetry Logger (captures all mutating API requests & authentication)
app.use((req, res, next) => {
  if (
    req.path.startsWith('/uploads') || 
    req.path.startsWith('/favicon') ||
    (req.method === 'GET' && (req.path === '/api/admin/activity' || req.path === '/api/health'))
  ) {
    return next();
  }

  const start = Date.now();
  res.on('finish', () => {
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const isActivityLogEndpoint = req.path?.includes('/activity/log') || req.originalUrl?.includes('/activity/log');
    
    if (isActivityLogEndpoint) return;

    if (isMutation || req.path.includes('/auth/')) {
      let action = `${req.method}_${req.path.replace(/\//g, '_').toUpperCase()}`;
      let title = `Backend API: ${req.method} ${req.path}`;
      let type = 'API_TRANSACTION';

      if (req.path.includes('/auth/login')) {
        action = 'USER_LOGIN';
        title = `User Authenticated (${req.body?.role || 'user'})`;
        type = 'AUTH';
      } else if (req.path.includes('/student-register')) {
        action = 'STUDENT_ACCOUNT_CREATED';
        title = `Student Registered: ${req.body?.name || ''} (${req.body?.rollNo || ''})`;
        type = 'IDENTITY';
      } else if (req.path === '/api/issues' && req.method === 'POST') {
        action = 'NEW_COMPLAINT_REGISTERED';
        title = `New Grievance Submitted to Campus Redressal`;
        type = 'GRIEVANCE';
      } else if (req.path.includes('/upvote')) {
        action = 'STUDENT_UPVOTE';
        title = `Student Endorsement / Upvote Recorded`;
        type = 'ENGAGEMENT';
      } else if (req.path.includes('/worker/tasks')) {
        action = 'WORKER_FIELD_UPDATE';
        title = `Technician Updated Task Work Order`;
        type = 'WORKER';
      } else if (req.method === 'DELETE') {
        action = 'DATABASE_RECORD_DELETED';
        title = `Database Permanent Delete Executed: ${req.path}`;
        type = 'DATABASE';
      }

      logActivity({
        action,
        type,
        title,
        description: `HTTP ${req.method} ${req.path} • Status: ${res.statusCode} (${Date.now() - start}ms) • IP: ${req.ip || '127.0.0.1'}`,
        diskFile: 'backend/data/issues.json',
        status: res.statusCode,
        data: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          durationMs: Date.now() - start
        }
      });
    }
  });

  next();
});

// Initialize database on boot
readDatabase();

// Root index endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'CivicSense Backend API',
    message: 'Backend server is running successfully! Access the web app at http://localhost:5173',
    healthCheck: '/api/health',
    logs: '/logs'
  });
});

// Live Backend Logs Endpoint (Interactive HTML view in browser & JSON API)
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);

const sendLogsResponse = (req, res) => {
  const format = req.query.format || (req.headers.accept?.includes('text/html') ? 'html' : 'json');
  const logs = getActivityLogs(150);

  if (format === 'html') {
    const rows = logs.map(l => {
      const statusColor = (l.status >= 500) ? '#f43f5e' : (l.status >= 400) ? '#fbbf24' : '#34d399';
      return `
        <tr style="border-bottom: 1px solid #1e293b; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 12px;">
          <td style="padding: 10px 14px; color: #94a3b8; white-space: nowrap;">${escapeHtml(l.timeFormatted || l.timestamp)}</td>
          <td style="padding: 10px 14px;"><span style="background: #1e293b; color: #38bdf8; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; border: 1px solid #334155;">${escapeHtml(l.action || 'LOG')}</span></td>
          <td style="padding: 10px 14px; color: #f1f5f9; font-weight: 600;">${escapeHtml(l.title || '-')}</td>
          <td style="padding: 10px 14px; color: #cbd5e1; max-width: 450px; word-break: break-word;">${escapeHtml(l.description || '-')}</td>
          <td style="padding: 10px 14px; text-align: right;"><span style="color: ${statusColor}; font-weight: 700;">${escapeHtml(l.status || 200)}</span></td>
        </tr>
      `;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CivicSense Backend Logs</title>
  <meta http-equiv="refresh" content="3">
  <style>
    body { background: #0b0f17; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #1e293b; }
    .title-group { display: flex; align-items: center; gap: 12px; }
    .badge { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; font-family: monospace; }
    .btn { background: #1e293b; color: #38bdf8; text-decoration: none; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid #334155; transition: 0.2s; }
    .btn:hover { background: #334155; }
    table { width: 100%; border-collapse: collapse; background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; }
    th { background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; text-align: left; padding: 12px 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title-group">
        <h2 style="margin: 0; font-size: 20px;">⚡ CivicSense Backend Live Logs</h2>
        <span class="badge">● Auto-Refreshing (3s)</span>
      </div>
      <div>
        <a href="/logs?format=json" class="btn" target="_blank">{ } Raw JSON</a>
        <a href="http://localhost:5173" class="btn" style="margin-left: 8px; color: #a7f3d0;">🌐 Open App</a>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Action</th>
          <th>Title</th>
          <th>Details</th>
          <th style="text-align: right;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #64748b;">No logs recorded yet.</td></tr>'}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    return res.send(html);
  }

  res.json({
    success: true,
    count: logs.length,
    timestamp: new Date().toISOString(),
    data: logs,
    logs
  });
};

app.get('/logs', sendLogsResponse);
app.get('/api/logs', sendLogsResponse);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CivicSense - Bilingual AI Smart Campus Issue Management System',
    languages: ['Assamese (অসমীয়া)', 'English'],
    profiles: ['Campus Administration', 'Maintenance Workers', 'Students (Verified Admission)'],
    geminiEnabled: Boolean(CONFIG.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/worker', workerRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/triage', triageRouter);
app.use('/api/scenarios', scenariosRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[CivicSense API Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const server = app.listen(CONFIG.PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                   CivicSense / নাগৰিক দৃষ্টি                       ║
║       Bilingual AI Smart Campus Issue Management System            ║
╠════════════════════════════════════════════════════════════════════╣
║  • Server listening on port: http://localhost:${CONFIG.PORT}                 ║
║  • Profiles Active: Administration | Maintenance Crews | Verified Students  ║
║  • Dynamic Categories & Locations: ACTIVE                          ║
║  • Assamese NLP Engine: ACTIVATED (Unicode NFC & Grammar)          ║
║  • Multimodal Vision & Duplicate Detection: READY                  ║
║  • API Health Check: http://localhost:${CONFIG.PORT}/api/health              ║
╚════════════════════════════════════════════════════════════════════╝
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [CivicSense Error]: Port ${CONFIG.PORT} is already in use by another running process.`);
    console.error(`   To resolve: Stop the other process or set PORT=<port> in backend/.env\n`);
  } else {
    console.error('[CivicSense Server Error]:', err);
  }
});

export { app, server };
export default app;
