import express from 'express';
import { 
  getAllUsers, 
  findUserByCredentials, 
  createStudentUser, 
  updateUserPassword, 
  getStudentRoster, 
  getSettings 
} from '../db/database.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username/ID and password are required.' });
    }

    const user = findUserByCredentials(username, password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your ID and password.' });
    }

    // Role check
    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: `Access denied. This account does not possess the ${role} profile.` });
    }

    // Check if account was suspended by admin
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account suspended: Your access has been turned OFF by the campus administrator.'
      });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/student-register
router.post('/student-register', (req, res) => {
  try {
    const { rollNo, name, password, email, phone } = req.body;
    if (!rollNo || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Admission Roll No., Full Name, and Password are required.'
      });
    }

    const roster = getStudentRoster();
    const cleanRoll = rollNo.trim().toLowerCase();
    const cleanName = name.trim().toLowerCase();

    // Verify against university pre-admission roster
    const rosterMatch = roster.find(r => 
      r.rollNo.trim().toLowerCase() === cleanRoll &&
      r.name.trim().toLowerCase() === cleanName
    );

    if (!rosterMatch) {
      return res.status(400).json({
        success: false,
        message: 'Campus Admission Verification Failed: Roll No. and Name do not match the official university pre-admission roster.'
      });
    }

    if (rosterMatch.isClaimed) {
      return res.status(400).json({
        success: false,
        message: 'Account already created: This Admission Roll No. has already been registered.'
      });
    }

    // Check if username/roll already exists in users
    const allUsers = getAllUsers();
    if (allUsers.some(u => u.username?.toLowerCase() === cleanRoll || u.rollNo?.toLowerCase() === cleanRoll)) {
      return res.status(400).json({
        success: false,
        message: 'An active user account is already linked with this Roll No.'
      });
    }

    const newStudent = createStudentUser({
      username: rosterMatch.rollNo,
      rollNo: rosterMatch.rollNo,
      name: rosterMatch.name,
      department: rosterMatch.department || 'General Academic',
      password,
      email: email || `${rosterMatch.rollNo.toLowerCase()}@student.campus.edu.in`,
      phone: phone || rosterMatch.phone || ''
    });

    const { password: _, ...safeUser } = newStudent;
    res.status(201).json({
      success: true,
      message: 'Student account successfully verified and created!',
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  try {
    const { role, email, workerId, rollNo, phone, newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'Please provide a valid new password (min 4 characters).' });
    }

    const allUsers = getAllUsers();
    const settings = getSettings();

    // 1. Admin Forgot Password (requires official campus email)
    if (role === 'admin') {
      if (!email) {
        return res.status(400).json({ success: false, message: 'Official campus administrative email is required.' });
      }
      const adminUser = allUsers.find(u => u.role === 'admin' && (u.email?.toLowerCase() === email.trim().toLowerCase() || email.trim().toLowerCase() === settings.adminEmail?.toLowerCase()));
      if (!adminUser) {
        return res.status(404).json({ success: false, message: 'No administrative account found for this school/campus email.' });
      }
      updateUserPassword(adminUser.id, newPassword);
      return res.json({ success: true, message: 'Admin password successfully reset. You may now log in with your administrative credentials.' });
    }

    // 2. Worker Forgot Password (requires Worker ID + registered Phone Number)
    if (role === 'worker') {
      if (!workerId || !phone) {
        return res.status(400).json({ success: false, message: 'Worker ID and registered phone number are required.' });
      }
      const workerUser = allUsers.find(u => 
        u.role === 'worker' && 
        u.username?.toLowerCase() === workerId.trim().toLowerCase() && 
        u.phone?.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, '')
      );
      if (!workerUser) {
        return res.status(404).json({ success: false, message: 'Worker verification failed. Invalid Worker ID or phone number.' });
      }
      updateUserPassword(workerUser.id, newPassword);
      return res.json({ success: true, message: 'Worker password successfully reset.' });
    }

    // 3. Student Forgot Password (requires Unique Roll No + registered Phone Number)
    if (role === 'student') {
      if (!rollNo || !phone) {
        return res.status(400).json({ success: false, message: 'Student Admission Roll No. and phone number are required.' });
      }
      const studentUser = allUsers.find(u => 
        u.role === 'student' && 
        (u.rollNo?.toLowerCase() === rollNo.trim().toLowerCase() || u.username?.toLowerCase() === rollNo.trim().toLowerCase()) && 
        u.phone?.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, '')
      );
      if (!studentUser) {
        return res.status(404).json({ success: false, message: 'Student verification failed. Invalid Roll No. or phone number.' });
      }
      updateUserPassword(studentUser.id, newPassword);
      return res.json({ success: true, message: 'Student password successfully reset.' });
    }

    res.status(400).json({ success: false, message: 'Invalid role specified.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
