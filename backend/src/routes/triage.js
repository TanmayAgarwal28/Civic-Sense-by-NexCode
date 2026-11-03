import express from 'express';
import multer from 'multer';
import { CONFIG } from '../config.js';
import { classifyComplaint } from '../ai/classifier.js';
import { findDuplicateIssues } from '../ai/duplicateDetector.js';
import { generateBilingualSummary } from '../ai/summarizer.js';
import { analyzeCampusImage } from '../ai/visionAnalyzer.js';
import { getAllIssues } from '../db/database.js';

const router = express.Router();
const upload = multer({ dest: CONFIG.UPLOADS_DIR });

/**
 * Real-time AI Pre-Check & Triage endpoint
 * Called as user drafts an issue or clicks "AI Quick Analyze"
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const { title = '', description = '', location = '', category = null } = req.body;
    const file = req.file;

    // 1. Multimodal Vision Inspection
    const imageAnalysis = file ? analyzeCampusImage(file, `${title} ${description}`) : null;

    // 2. Bilingual Classification & Urgency Assessment
    const classification = classifyComplaint(`${title} ${description}`, imageAnalysis, category);

    // 3. Bilingual Summary & Action Protocol
    const summary = generateBilingualSummary({
      title,
      description,
      location: location || 'Campus Area',
      category: classification.category,
      priority: classification.priority,
      department: classification.department,
      isCompoundHazard: classification.isCompoundHazard
    });

    // 4. Semantic Duplicate Detection against active complaints
    const existingIssues = getAllIssues();
    const duplicateResults = findDuplicateIssues({
      id: 'draft',
      title,
      description,
      location,
      category: classification.category
    }, existingIssues);

    res.json({
      success: true,
      data: {
        classification,
        summary,
        duplicates: duplicateResults,
        vision: imageAnalysis
      }
    });
  } catch (err) {
    console.error('Triage analysis error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
