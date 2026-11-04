import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config.js';

const LOG_FILE = path.join(CONFIG.DATA_DIR, 'activity_log.json');
let inMemoryLogs = [];

function ensureFile() {
  if (!fs.existsSync(CONFIG.DATA_DIR)) {
    fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOG_FILE)) {
    const initial = [
      {
        id: `act_${Date.now()}_init`,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        action: 'SERVER_BOOT',
        type: 'SYSTEM',
        title: 'Backend Server & Persistent Database Initialized',
        description: 'Server listening on Port 5001. Issues, Users, Roster, Categories & Locations loaded from disk.',
        diskFile: 'backend/data/issues.json',
        status: 200
      }
    ];
    try {
      fs.writeFileSync(LOG_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Initial activity log file creation notice:', e.message);
    }
    inMemoryLogs = initial;
  } else {
    try {
      const raw = fs.readFileSync(LOG_FILE, 'utf-8');
      inMemoryLogs = JSON.parse(raw);
    } catch (e) {
      inMemoryLogs = [];
    }
  }
}

// Initialize on import
ensureFile();

export function logActivity({ action, type = 'TRANSACTION', title, description = '', diskFile = 'backend/data/issues.json', data = null, status = 200 }) {
  ensureFile();
  const now = new Date();
  const entry = {
    id: `act_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now.toISOString(),
    timeFormatted: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    action,
    type,
    title,
    description,
    diskFile,
    status,
    data
  };

  inMemoryLogs.unshift(entry);
  if (inMemoryLogs.length > 250) {
    inMemoryLogs = inMemoryLogs.slice(0, 250);
  }

  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(inMemoryLogs, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist activity log to disk:', err.message);
  }

  return entry;
}

export function getActivityLogs(limit = 200) {
  ensureFile();
  return inMemoryLogs.slice(0, limit);
}

export function clearActivityLogs() {
  inMemoryLogs = [];
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2), 'utf-8');
  } catch (err) {}
  return true;
}
