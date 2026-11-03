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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads directory
app.use('/uploads', express.static(CONFIG.UPLOADS_DIR));

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
