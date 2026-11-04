import express from 'express';
import { 
  getAllUsers, 
  findUserByCredentials, 
  createStudentUser, 
  updateUserPassword, 
  getStudentRoster, 
  getSettings 
} from '../db/database.js';
import { logActivity } from '../db/activityLogger.js';
import { createSessionToken } from '../auth/session.js';

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

    logActivity({
      action: 'USER_LOGIN',
      type: 'AUTH_SESSION',
      title: `${user.role.toUpperCase()} Portal Login: ${user.name} (${user.username})`,
      description: `Authenticated session granted for ${user.role} console.`,
      diskFile: 'backend/data/issues.json',
      status: 200,
      data: { role: user.role, username: user.username, name: user.name }
    });

    res.json({
      success: true,
      user: safeUser,
      sessionToken: createSessionToken(user)
    });
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

    // Verify against university pre-admission roster or auto-enroll new student ID
    let finalRoll = rollNo.trim();
    let finalName = name.trim();
    let finalDept = 'Undergraduate Studies';
    let finalPhone = phone ? phone.trim() : '9876543210';

    const rosterMatch = roster.find(r => 
      r.rollNo.trim().toLowerCase() === cleanRoll ||
      r.name.trim().toLowerCase() === cleanName
    );

    if (!rosterMatch) {
      return res.status(400).json({
        success: false,
        message: 'Admission verification failed: Roll No. or Student Name not found in official campus admission roster. Please contact campus administration.'
      });
    }

    finalRoll = rosterMatch.rollNo;
    finalName = rosterMatch.name;
    finalDept = rosterMatch.department || 'Undergraduate Studies';
    if (rosterMatch.phone) finalPhone = rosterMatch.phone;
    rosterMatch.isClaimed = true;

    // Check if username/roll already exists in users
    const allUsers = getAllUsers();
    const existing = allUsers.find(u => u.username?.toLowerCase() === cleanRoll || u.rollNo?.toLowerCase() === cleanRoll);
    if (existing) {
      // If already registered, update their password so they can log in immediately
      existing.password = password;
      existing.name = finalName;
      if (email) existing.email = email;
      if (phone) existing.phone = phone;
      const { password: _, ...safeExisting } = existing;
      logActivity({
        action: 'STUDENT_ACCOUNT_CREATED',
        type: 'IDENTITY_ROSTER',
        title: `Student ID Re-Verified & Updated: ${finalName} (${finalRoll})`,
        description: `Student account confirmed and activated. Department: ${finalDept}. Added to campus users record.`,
        diskFile: 'backend/data/issues.json',
        status: 200,
        data: { rollNo: finalRoll, name: finalName, department: finalDept }
      });
      return res.status(200).json({
        success: true,
        message: 'Student account updated and verified!',
        user: safeExisting
      });
    }

    const newStudent = createStudentUser({
      username: finalRoll,
      rollNo: finalRoll,
      name: finalName,
      department: finalDept,
      password,
      email: email || `${finalRoll.toLowerCase()}@student.campus.edu.in`,
      phone: finalPhone
    });

    const { password: _, ...safeUser } = newStudent;

    logActivity({
      action: 'STUDENT_ACCOUNT_CREATED',
      type: 'IDENTITY_ROSTER',
      title: `Student ID Created & Activated: ${finalName} (${finalRoll})`,
      description: `Student account created & verified. Department: ${finalDept}. Added to users database.`,
      diskFile: 'backend/data/issues.json',
      status: 201,
      data: { rollNo: finalRoll, name: finalName, department: finalDept }
    });

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
