import express from 'express';
import multer from 'multer';
import { CONFIG } from '../config.js';
import { getAllIssues, updateIssue, getAllUsers } from '../db/database.js';
import { logActivity } from '../db/activityLogger.js';

const router = express.Router();
const upload = multer({ dest: CONFIG.UPLOADS_DIR });

// GET /api/worker/tasks?workerId=...
router.get('/tasks', (req, res) => {
  try {
    const { workerId, department } = req.query;
    let issues = getAllIssues();

    if (workerId) {
      issues = issues.filter(i => 
        i.assignedWorkerId === workerId || 
        (i.assignedOfficer && i.assignedOfficer.includes(workerId)) ||
        (department && i.department?.en === department)
      );
    } else if (department) {
      issues = issues.filter(i => i.department?.en === department);
    }

    res.json({ success: true, count: issues.length, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/worker/tasks/:id - worker updates task status & attaches resolution proof
router.patch('/tasks/:id', upload.single('resolutionProof'), (req, res) => {
  try {
    const { status, resolutionNotes, workerName } = req.body;
    const file = req.file;

    const updates = {};
    if (status) updates.status = status;
    if (resolutionNotes) updates.resolutionNotes = resolutionNotes;
    if (workerName) updates.assignedOfficer = workerName;
    if (file) updates.resolutionProofUrl = `/uploads/${file.filename}`;

    const updated = updateIssue(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    logActivity({
      action: 'WORKER_FIELD_UPDATE',
      type: 'FIELD_WORKER',
      title: `Maintenance Worker Updated Task: ${updated.ticketId}`,
      description: `Task status changed to "${updated.status}" by ${workerName || 'Assigned Technician'}${resolutionNotes ? ' • Note: ' + resolutionNotes : ''}${file ? ' • 📸 Resolution Proof Uploaded' : ''}`,
      diskFile: 'backend/data/issues.json',
      status: 200,
      data: {
        ticketId: updated.ticketId,
        status: updated.status,
        workerName: workerName || 'Worker'
      }
    });

    res.json({
      success: true,
      message: 'Maintenance task successfully updated by worker.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
