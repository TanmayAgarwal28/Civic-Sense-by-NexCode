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
import { logActivity } from './db/activityLogger.js';

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
    const isActivityLogEndpoint = req.path === '/api/admin/activity/log';
    
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

export { app, server };
export default app;
