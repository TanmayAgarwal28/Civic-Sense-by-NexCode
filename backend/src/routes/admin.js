import express from 'express';
import { 
  getIssueById, 
  deleteIssue, 
  getAllUsers, 
  toggleUserActive, 
  createWorkerUser, 
  getStudentRoster, 
  addRosterEntry, 
  getCategories, 
  addCategory, 
  deleteCategory, 
  getLocations, 
  addLocation, 
  deleteLocation, 
  getSettings, 
  updateSettings, 
  getRawDatabase, 
  resetDatabase,
  updateIssue 
} from '../db/database.js';
import { generateOfficialNotice } from '../ai/noticeGenerator.js';

const router = express.Router();

// Generate official bilingual notice
router.post('/generate-notice', (req, res) => {
  try {
    const { issueId, resolutionNotes, officerName } = req.body;
    if (!issueId) {
      return res.status(400).json({ success: false, message: 'issueId is required' });
    }

    const issue = getIssueById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const notice = generateOfficialNotice(issue, resolutionNotes, officerName);
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete an issue/work order
router.delete('/issues/:id', (req, res) => {
  try {
    const deleted = deleteIssue(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Issue not found or could not be deleted' });
    }
    res.json({ success: true, message: 'Work order deleted permanently by Admin.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Approve dispatch for an issue
router.patch('/issues/:id/approve-dispatch', (req, res) => {
  try {
    const { assignedOfficer, assignedWorkerId } = req.body;
    const updated = updateIssue(req.params.id, {
      adminApprovalStatus: 'approved_dispatched',
      status: 'assigned',
      assignedOfficer,
      assignedWorkerId
    });
    res.json({ success: true, message: 'Grievance approved and dispatched to worker crew.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- USER & ROSTER MANAGEMENT ----------------
// GET all users
router.get('/users', (req, res) => {
  try {
    const allUsers = getAllUsers().map(({ password, ...u }) => u);
    const students = allUsers.filter(u => u.role === 'student');
    const workers = allUsers.filter(u => u.role === 'worker');
    const roster = getStudentRoster();

    res.json({
      success: true,
      data: {
        students,
        workers,
        roster
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle student on/off access switch
router.patch('/users/:id/toggle', (req, res) => {
  try {
    const user = toggleUserActive(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      message: `User access has been turned ${user.isActive ? 'ON (Active)' : 'OFF (Suspended)'}.`,
      data: { id: user.id, isActive: user.isActive }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin creates Worker account
router.post('/workers', (req, res) => {
  try {
    const { username, name, department, phone, password } = req.body;
    if (!username || !name || !password) {
      return res.status(400).json({ success: false, message: 'Worker ID, Name, and Password are required.' });
    }

    const allUsers = getAllUsers();
    if (allUsers.some(u => u.username?.toLowerCase() === username.trim().toLowerCase())) {
      return res.status(400).json({ success: false, message: 'A user with this Worker ID already exists.' });
    }

    const worker = createWorkerUser({
      username: username.trim(),
      name: name.trim(),
      department: department || 'General Maintenance',
      email: `${username.trim().toLowerCase()}@example.invalid`,
      phone: phone || '',
      password
    });

    const { password: _, ...safeWorker } = worker;
    res.status(201).json({
      success: true,
      message: 'Worker profile created successfully.',
      data: safeWorker
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin adds student to university pre-admission roster
router.post('/roster', (req, res) => {
  try {
    const { rollNo, name, department, phone } = req.body;
    if (!rollNo || !name) {
      return res.status(400).json({ success: false, message: 'Roll No. and Full Name are required.' });
    }

    const success = addRosterEntry({
      rollNo: rollNo.trim().toUpperCase(),
      name: name.trim(),
      department: department || 'General Academic',
      phone: phone || ''
    });

    if (!success) {
      return res.status(400).json({ success: false, message: 'This Roll No. already exists in the admission roster.' });
    }

    res.status(201).json({
      success: true,
      message: 'Student successfully registered into official campus admission roster.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- DYNAMIC CATEGORIES ----------------
router.get('/categories', (req, res) => {
  res.json({ success: true, data: getCategories() });
});

router.post('/categories', (req, res) => {
  try {
    const { en, as, defaultDept } = req.body;
    if (!en || !as) {
      return res.status(400).json({ success: false, message: 'English and Assamese names are required.' });
    }
    const cat = addCategory({ en, as, defaultDept: defaultDept || 'Estate & Works' });
    res.status(201).json({ success: true, message: 'Category added successfully', data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/categories/:id', (req, res) => {
  try {
    deleteCategory(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- DYNAMIC LOCATIONS / ZONES ----------------
router.get('/locations', (req, res) => {
  res.json({ success: true, data: getLocations() });
});

router.post('/locations', (req, res) => {
  try {
    const { en, as, x, y, refDept, distanceMeters, direction, color } = req.body;
    if (!en || !as) {
      return res.status(400).json({ success: false, message: 'English and Assamese names are required.' });
    }
    const loc = addLocation({ en, as, x, y, refDept, distanceMeters, direction, color });
    res.status(201).json({ success: true, message: 'Location added successfully', data: loc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/locations/:id', (req, res) => {
  try {
    deleteLocation(req.params.id);
    res.json({ success: true, message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- SETTINGS ----------------
router.get('/settings', (req, res) => {
  res.json({ success: true, data: getSettings() });
});

router.patch('/settings', (req, res) => {
  try {
    const updated = updateSettings(req.body);
    res.json({ success: true, message: 'Settings updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- RAW DATABASE INSPECTOR ----------------
router.get('/raw-database', (req, res) => {
  try {
    const raw = getRawDatabase();
    // Sanitize passwords before returning
    const sanitizedUsers = (raw.users || []).map(({ password, ...u }) => ({ ...u, passwordMasked: '••••••••' }));
    res.json({
      success: true,
      data: {
        ...raw,
        users: sanitizedUsers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reset database to demo state
router.post('/reset-data', (req, res) => {
  try {
    const freshData = resetDatabase();
    res.json({ success: true, message: 'Database reset to demo state.', data: freshData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin change password (only accessible within Admin Command Center)
router.post('/change-password', (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    const allUsers = getAllUsers();
    const admin = allUsers.find(u => u.role === 'admin' || u.username === 'CampusAdminX1');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    if (admin.password !== currentPassword) {
      return res.status(401).json({ success: false, message: 'Current password does not match records.' });
    }

    updateUserPassword(admin.id, newPassword);
    res.json({ success: true, message: 'Admin password updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
