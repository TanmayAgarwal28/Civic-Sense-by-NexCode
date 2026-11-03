import express from 'express';
import { getAllIssues } from '../db/database.js';
import { CONFIG } from '../config.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const issues = getAllIssues();
    const total = issues.length;

    const resolved = issues.filter(i => i.status === 'resolved' || i.status === 'closed').length;
    const inProgress = issues.filter(i => i.status === 'in_progress').length;
    const investigating = issues.filter(i => i.status === 'investigating').length;
    const reported = issues.filter(i => i.status === 'reported').length;
    const critical = issues.filter(i => i.priority === 'critical').length;
    const high = issues.filter(i => i.priority === 'high').length;

    // SLA Compliance calculation
    const now = Date.now();
    let onTimeCount = 0;
    let breachedCount = 0;

    issues.forEach(i => {
      if (i.slaDeadline) {
        const deadline = new Date(i.slaDeadline).getTime();
        if (i.status === 'resolved' && i.resolvedAt) {
          const resolvedTime = new Date(i.resolvedAt).getTime();
          if (resolvedTime <= deadline) onTimeCount++;
          else breachedCount++;
        } else if (now > deadline) {
          breachedCount++;
        } else {
          onTimeCount++;
        }
      }
    });

    const slaComplianceRate = total > 0 ? Math.round((onTimeCount / total) * 100) : 100;

    // Category breakdown
    const categoryCounts = {};
    CONFIG.CATEGORIES.forEach(c => {
      categoryCounts[c.id] = {
        id: c.id,
        nameEn: c.en,
        nameAs: c.as,
        count: 0
      };
    });
    issues.forEach(i => {
      if (categoryCounts[i.category]) {
        categoryCounts[i.category].count++;
      }
    });

    // Zone breakdown (Campus Hotspots)
    const zoneCounts = {};
    CONFIG.ZONES.forEach(z => {
      zoneCounts[z.id] = {
        id: z.id,
        nameEn: z.en,
        nameAs: z.as,
        count: 0
      };
    });
    issues.forEach(i => {
      const zId = i.zoneId || 'campus_pathways';
      if (zoneCounts[zId]) {
        zoneCounts[zId].count++;
      }
    });

    // Language Breakdown
    const langCounts = {
      as: issues.filter(i => i.language === 'as').length,
      en: issues.filter(i => i.language === 'en').length
    };

    // Duplicate Interception metric
    const totalUpvotes = issues.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);
    const estimatedDuplicatesPrevented = Math.round(totalUpvotes * 0.7);

    res.json({
      success: true,
      data: {
        summary: {
          total,
          resolved,
          inProgress,
          investigating,
          reported,
          critical,
          high,
          resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
          slaComplianceRate,
          avgResolutionHours: 4.8,
          duplicatesPrevented: estimatedDuplicatesPrevented
        },
        categoryBreakdown: Object.values(categoryCounts),
        zoneBreakdown: Object.values(zoneCounts),
        languageBreakdown: langCounts,
        recentIssues: issues.slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
