import express from 'express';
import multer from 'multer';
import { CONFIG } from '../config.js';
import { getAllIssues, getIssueById, createIssue, updateIssue, upvoteIssue, getSettings, getAllUsers } from '../db/database.js';
import { classifyComplaint } from '../ai/classifier.js';
import { findDuplicateIssues } from '../ai/duplicateDetector.js';
import { generateBilingualSummary } from '../ai/summarizer.js';
import { analyzeCampusImage } from '../ai/visionAnalyzer.js';
import { isAssamese } from '../ai/assameseNlp.js';

const router = express.Router();
const upload = multer({ dest: CONFIG.UPLOADS_DIR });

// GET all issues with filtering & search
router.get('/', (req, res) => {
  try {
    let issues = getAllIssues();
    const { status, category, priority, zoneId, language, search, reporterId } = req.query;

    if (status && status !== 'all') {
      issues = issues.filter(i => i.status === status);
    }
    if (category && category !== 'all') {
      issues = issues.filter(i => i.category === category);
    }
    if (priority && priority !== 'all') {
      issues = issues.filter(i => i.priority === priority);
    }
    if (zoneId && zoneId !== 'all') {
      issues = issues.filter(i => i.zoneId === zoneId);
    }
    if (language && language !== 'all') {
      issues = issues.filter(i => i.language === language);
    }
    if (reporterId) {
      issues = issues.filter(i => i.reporterId === reporterId);
    }
    if (search) {
      const q = search.toLowerCase();
      issues = issues.filter(i => 
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.ticketId && i.ticketId.toLowerCase().includes(q)) ||
        (i.location && i.location.toLowerCase().includes(q)) ||
        (i.address && i.address.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: issues.length, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single issue by ID or Ticket ID
router.get('/:id', (req, res) => {
  try {
    const issue = getIssueById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    res.json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST submit new issue (Multimodal + AI classification + Duplicate Check + Address)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      address = '',
      zoneId,
      category,
      reporterId = null,
      reporterName = 'Student Member',
      reporterRole = 'student',
      anonymous = false,
      ignoreDuplicate = false
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const file = req.file;
    const textComb = `${title} ${description} ${address}`;
    const detectedLang = isAssamese(textComb) ? 'as' : 'en';

    // 1. Multimodal image analysis
    const imageAnalysis = file ? analyzeCampusImage(file, textComb) : null;

    // 2. AI Classification & Priority
    const classification = classifyComplaint(textComb, imageAnalysis, category);

    // 3. Semantic Duplicate Check
    const existingIssues = getAllIssues();
    const duplicateResults = findDuplicateIssues({
      id: 'new',
      title,
      description,
      location: location || '',
      category: classification.category
    }, existingIssues);

    // If strong duplicate found and user hasn't explicitly clicked "Submit Anyway"
    if (duplicateResults.hasDuplicates && !ignoreDuplicate && duplicateResults.topDuplicate?.similarity >= 85) {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        message: 'A highly similar issue has already been reported.',
        duplicate: duplicateResults.topDuplicate,
        candidates: duplicateResults.candidates
      });
    }

    // 4. Bilingual Summary
    const summary = generateBilingualSummary({
      title,
      description,
      location: location || 'Campus Premises',
      category: classification.category,
      priority: classification.priority,
      department: classification.department,
      isCompoundHazard: classification.isCompoundHazard
    });

    // 5. Check AI Dispatch Setting
    const settings = getSettings();
    const isDirectAutoDispatch = settings.aiAutoDispatch !== false;

    // Auto-match an active worker if direct auto-dispatch is enabled
    const allUsers = getAllUsers();
    const candidateWorkers = allUsers.filter(u => u.role === 'worker' && u.isActive);
    let matchedWorker = candidateWorkers.find(w => w.department === classification.department.en);
    if (!matchedWorker && candidateWorkers.length > 0) {
      matchedWorker = candidateWorkers[0];
    }

    const assignedWorkerId = isDirectAutoDispatch && matchedWorker ? matchedWorker.id : null;
    const assignedOfficer = isDirectAutoDispatch && matchedWorker ? `${matchedWorker.name} (${matchedWorker.username})` : 'Awaiting Administrative Approval';
    const status = isDirectAutoDispatch ? 'assigned' : 'reported';
    const adminApprovalStatus = isDirectAutoDispatch ? 'approved_dispatched' : 'pending_approval';

    // 6. Store in persistent database
    const created = createIssue({
      title,
      description,
      address,
      language: detectedLang,
      location: location || 'Campus',
      zoneId: zoneId || 'campus_pathways',
      category: classification.category,
      categoryName: classification.categoryName,
      department: classification.department,
      priority: classification.priority,
      urgencyScore: classification.urgencyScore,
      isCompoundHazard: classification.isCompoundHazard,
      slaHours: classification.slaHours,
      slaDeadline: classification.slaDeadline,
      status,
      adminApprovalStatus,
      assignedWorkerId,
      assignedOfficer,
      reporterId: anonymous ? null : reporterId,
      reporterName: anonymous ? 'Anonymous Student' : reporterName,
      reporterRole,
      anonymous: Boolean(anonymous),
      imageUrl: file ? `/uploads/${file.filename}` : null,
      visionAnalysis: imageAnalysis,
      summary,
      actionPlan: summary.actionPlan,
      duplicateInfo: duplicateResults.topDuplicate ? {
        linkedTicketId: duplicateResults.topDuplicate.ticketId,
        similarity: duplicateResults.topDuplicate.similarity
      } : null
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted and AI-triaged successfully.',
      data: created
    });
  } catch (err) {
    console.error('Error creating issue:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST upvote issue
router.post('/:id/upvote', (req, res) => {
  try {
    const updated = upvoteIssue(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update status & resolution details
router.patch('/:id/status', upload.single('resolutionProof'), (req, res) => {
  try {
    const { status, resolutionNotes, assignedOfficer } = req.body;
    const file = req.file;

    const updates = {};
    if (status) updates.status = status;
    if (resolutionNotes) updates.resolutionNotes = resolutionNotes;
    if (assignedOfficer) updates.assignedOfficer = assignedOfficer;
    if (file) updates.resolutionProofUrl = `/uploads/${file.filename}`;

    const updated = updateIssue(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
