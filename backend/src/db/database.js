import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config.js';
import { 
  INITIAL_ISSUES, 
  INITIAL_USERS, 
  INITIAL_STUDENT_ROSTER, 
  INITIAL_CATEGORIES, 
  INITIAL_LOCATIONS, 
  INITIAL_SETTINGS 
} from './seedData.js';
import { v4 as uuidv4 } from 'uuid';

const DB_FILE = path.join(CONFIG.DATA_DIR, 'issues.json');

function ensureDir() {
  if (!fs.existsSync(CONFIG.DATA_DIR)) {
    fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONFIG.UPLOADS_DIR)) {
    fs.mkdirSync(CONFIG.UPLOADS_DIR, { recursive: true });
  }
}

export function getDefaultStore() {
  return {
    issues: INITIAL_ISSUES,
    users: INITIAL_USERS,
    studentRoster: INITIAL_STUDENT_ROSTER,
    categories: INITIAL_CATEGORIES,
    locations: INITIAL_LOCATIONS,
    settings: INITIAL_SETTINGS
  };
}

export function readDatabase() {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = getDefaultStore();
    saveDatabase(defaultData);
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    
    // Migration: If old format was just an array of issues
    if (Array.isArray(data)) {
      const migrated = {
        ...getDefaultStore(),
        issues: data
      };
      saveDatabase(migrated);
      return migrated;
    }

    return {
      issues: data.issues || INITIAL_ISSUES,
      users: data.users || INITIAL_USERS,
      studentRoster: data.studentRoster || INITIAL_STUDENT_ROSTER,
      categories: data.categories || INITIAL_CATEGORIES,
      locations: data.locations || INITIAL_LOCATIONS,
      settings: data.settings || INITIAL_SETTINGS
    };
  } catch (err) {
    console.error('Error reading database, restoring defaults:', err);
    const defaultData = getDefaultStore();
    saveDatabase(defaultData);
    return defaultData;
  }
}

export function saveDatabase(data) {
  ensureDir();
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// ----------------- ISSUES -----------------
export function getAllIssues() {
  return readDatabase().issues;
}

export function getIssueById(id) {
  const { issues } = readDatabase();
  return issues.find(i => i.id === id || i.ticketId === id);
}

export function createIssue(issueData) {
  const store = readDatabase();
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `CS-${year}-${randomNum}`;

  const newIssue = {
    id: `iss_${Date.now()}_${uuidv4().slice(0, 6)}`,
    ticketId,
    upvotes: 0,
    status: 'reported',
    createdAt: new Date().toISOString(),
    timeline: [
      {
        id: `t_${Date.now()}`,
        status: 'reported',
        timestamp: new Date().toISOString(),
        noteEn: 'Grievance officially filed in the CivicSense portal.',
        noteAs: 'চিভিকচেন্স পৰ্টেলত আনুষ্ঠানিকভাৱে অভিযোগ নথিভুক্ত কৰা হৈছে।'
      }
    ],
    ...issueData
  };

  store.issues.unshift(newIssue);
  saveDatabase(store);
  return newIssue;
}

export function updateIssue(id, updates) {
  const store = readDatabase();
  const index = store.issues.findIndex(i => i.id === id || i.ticketId === id);
  if (index === -1) return null;

  const existing = store.issues[index];

  if (updates.status && updates.status !== existing.status) {
    const statusNoteEn = getStatusNoteEn(updates.status, updates.resolutionNotes);
    const statusNoteAs = getStatusNoteAs(updates.status, updates.resolutionNotes);
    
    const timelineEntry = {
      id: `t_${Date.now()}`,
      status: updates.status,
      timestamp: new Date().toISOString(),
      noteEn: statusNoteEn,
      noteAs: statusNoteAs
    };
    existing.timeline = existing.timeline || [];
    existing.timeline.push(timelineEntry);

    if (updates.status === 'resolved') {
      existing.resolvedAt = new Date().toISOString();
    }
  }

  const updated = {
    ...existing,
    ...updates,
    timeline: existing.timeline
  };

  store.issues[index] = updated;
  saveDatabase(store);
  return updated;
}

export function deleteIssue(id) {
  const store = readDatabase();
  const initialLen = store.issues.length;
  store.issues = store.issues.filter(i => i.id !== id && i.ticketId !== id);
  saveDatabase(store);
  return store.issues.length < initialLen;
}

export function upvoteIssue(id) {
  const store = readDatabase();
  const item = store.issues.find(i => i.id === id || i.ticketId === id);
  if (!item) return null;

  item.upvotes = (item.upvotes || 0) + 1;
  saveDatabase(store);
  return item;
}

// ----------------- USERS -----------------
export function getAllUsers() {
  return readDatabase().users;
}

export function findUserByCredentials(username, password) {
  const { users } = readDatabase();
  return users.find(u => 
    (u.username?.toLowerCase() === username.toLowerCase() || u.rollNo?.toLowerCase() === username.toLowerCase()) && 
    u.password === password
  );
}

export function toggleUserActive(userId) {
  const store = readDatabase();
  const user = store.users.find(u => u.id === userId);
  if (!user) return null;
  user.isActive = !user.isActive;
  saveDatabase(store);
  return user;
}

export function createWorkerUser(workerData) {
  const store = readDatabase();
  const newWorker = {
    id: `usr_wrk_${Date.now()}`,
    role: 'worker',
    isActive: true,
    createdAt: new Date().toISOString(),
    ...workerData
  };
  store.users.push(newWorker);
  saveDatabase(store);
  return newWorker;
}

export function createStudentUser(studentData) {
  const store = readDatabase();
  const newStudent = {
    id: `usr_stu_${Date.now()}`,
    role: 'student',
    isActive: true,
    createdAt: new Date().toISOString(),
    ...studentData
  };
  store.users.push(newStudent);

  // Mark roll as claimed in student roster
  const rosterEntry = store.studentRoster.find(r => r.rollNo.toLowerCase() === studentData.rollNo?.toLowerCase());
  if (rosterEntry) {
    rosterEntry.isClaimed = true;
  }

  saveDatabase(store);
  return newStudent;
}

export function updateUserPassword(userId, newPassword) {
  const store = readDatabase();
  const user = store.users.find(u => u.id === userId);
  if (!user) return false;
  user.password = newPassword;
  saveDatabase(store);
  return true;
}

export function updateUser(userId, updates) {
  const store = readDatabase();
  const index = store.users.findIndex(u => u.id === userId);
  if (index === -1) return null;

  const existing = store.users[index];
  const updated = {
    ...existing,
    ...updates,
    id: existing.id
  };
  if (updated.role === 'student' && updates.rollNo) {
    updated.username = updates.rollNo;
  }
  // If password was empty or not provided, preserve existing
  if (!updates.password) {
    updated.password = existing.password;
  }
  store.users[index] = updated;
  saveDatabase(store);
  return updated;
}

export function deleteUser(userId) {
  const store = readDatabase();
  const user = store.users.find(u => u.id === userId);
  if (!user) return false;
  // If user is a student, set their corresponding roster entry back to unclaimed
  if (user.role === 'student' && (user.rollNo || user.username)) {
    const roll = (user.rollNo || user.username).toLowerCase();
    const roster = store.studentRoster.find(r => r.rollNo.toLowerCase() === roll);
    if (roster) {
      roster.isClaimed = false;
    }
  }
  store.users = store.users.filter(u => u.id !== userId);
  saveDatabase(store);
  return true;
}

// ----------------- ROSTER -----------------
export function getStudentRoster() {
  return readDatabase().studentRoster;
}

export function addRosterEntry(entry) {
  const store = readDatabase();
  const exists = store.studentRoster.some(r => r.rollNo.toLowerCase() === entry.rollNo.toLowerCase());
  if (exists) return false;
  store.studentRoster.push({
    ...entry,
    isClaimed: false
  });
  saveDatabase(store);
  return true;
}

export function updateRosterEntry(rollNo, updates) {
  const store = readDatabase();
  const cleanRoll = rollNo.trim().toLowerCase();
  const index = store.studentRoster.findIndex(r => r.rollNo.trim().toLowerCase() === cleanRoll);
  if (index === -1) return null;
  store.studentRoster[index] = {
    ...store.studentRoster[index],
    ...updates
  };
  saveDatabase(store);
  return store.studentRoster[index];
}

export function deleteRosterEntry(rollNo) {
  const store = readDatabase();
  const cleanRoll = rollNo.trim().toLowerCase();
  const initialLen = store.studentRoster.length;
  store.studentRoster = store.studentRoster.filter(r => r.rollNo.trim().toLowerCase() !== cleanRoll);
  saveDatabase(store);
  return store.studentRoster.length < initialLen;
}

// ----------------- CATEGORIES -----------------
export function getCategories() {
  return readDatabase().categories;
}

export function addCategory(cat) {
  const store = readDatabase();
  const id = cat.id || cat.en.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const newCat = { id, ...cat };
  store.categories.push(newCat);
  saveDatabase(store);
  return newCat;
}

export function deleteCategory(id) {
  const store = readDatabase();
  store.categories = store.categories.filter(c => c.id !== id);
  saveDatabase(store);
  return true;
}

// ----------------- LOCATIONS -----------------
export function getLocations() {
  return readDatabase().locations;
}

export function addLocation(loc) {
  const store = readDatabase();
  const id = loc.id || loc.en.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const newLoc = { id, ...loc };
  store.locations.push(newLoc);
  saveDatabase(store);
  return newLoc;
}

export function deleteLocation(id) {
  const store = readDatabase();
  store.locations = store.locations.filter(l => l.id !== id);
  saveDatabase(store);
  return true;
}

// ----------------- SETTINGS -----------------
export function getSettings() {
  return readDatabase().settings;
}

export function updateSettings(updates) {
  const store = readDatabase();
  store.settings = { ...store.settings, ...updates };
  saveDatabase(store);
  return store.settings;
}

// ----------------- RAW DATABASE -----------------
export function getRawDatabase() {
  return readDatabase();
}

export function resetDatabase() {
  const defaultData = getDefaultStore();
  saveDatabase(defaultData);
  return defaultData;
}

export function deleteDatabaseEntry(collection, id) {
  if (collection === 'issues') {
    return deleteIssue(id);
  } else if (collection === 'users') {
    return deleteUser(id);
  } else if (collection === 'studentRoster') {
    return deleteRosterEntry(id);
  } else if (collection === 'categories') {
    return deleteCategory(id);
  } else if (collection === 'locations') {
    return deleteLocation(id);
  }
  return false;
}

function getStatusNoteEn(status, notes) {
  switch (status) {
    case 'investigating': return 'Technical crew assigned for field verification and diagnosis.';
    case 'in_progress': return 'Active engineering or maintenance repair underway.';
    case 'resolved': return notes ? `Issue resolved: ${notes}` : 'Issue resolved and on-site operation confirmed.';
    case 'closed': return 'Issue officially closed following verification.';
    case 'escalated': return 'Escalated to University Executive Engineer due to critical requirements.';
    default: return `Status updated to ${status}.`;
  }
}

function getStatusNoteAs(status, notes) {
  switch (status) {
    case 'investigating': return 'ঘটনাস্থলী পৰিদৰ্শন আৰু পৰীক্ষণৰ বাবে কাৰিকৰী দল নিযুক্ত কৰা হৈছে।';
    case 'in_progress': return 'কাৰিকৰী মেৰামতি আৰু সমাধান কাৰ্য সক্ৰিয়ভাৱে চলি আছে।';
    case 'resolved': return notes ? `সমস্যা সমাধান হৈছে: ${notes}` : 'সমস্যা সমাধান সম্পন্ন আৰু কাৰ্যক্ষম অৱস্থা নিশ্চিত কৰা হৈছে।';
    case 'closed': return 'পৰীক্ষণ আৰু অনুমোদনৰ পিছত আনুষ্ঠানিকভাৱে বন্ধ কৰা হৈছে।';
    case 'escalated': return 'জৰুৰী প্ৰয়োজনীয়তাৰ ভিত্তিত কাৰ্য্যবাহী অভিযন্তালৈ অগ্ৰেৰণ কৰা হৈছে।';
    default: return `স্থিতি ${status} লৈ সলনি কৰা হৈছে।`;
  }
}
