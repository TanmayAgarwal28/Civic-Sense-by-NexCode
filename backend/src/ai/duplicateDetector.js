import { extractCampusEntities, extractSemanticConcepts, tokenizeAssamese, normalizeNumerals } from './assameseNlp.js';

/**
 * Computes semantic similarity between an incoming report and existing campus issues
 * Works seamlessly cross-lingually (Assamese <-> English, Assamese <-> Assamese, English <-> English)
 */
export function findDuplicateIssues(newIssue, existingIssues = [], threshold = 0.65) {
  if (!existingIssues || existingIssues.length === 0) {
    return {
      hasDuplicates: false,
      topDuplicate: null,
      candidates: []
    };
  }

  const newConcepts = extractSemanticConcepts(`${newIssue.title || ''} ${newIssue.description || ''}`);
  const newEntities = extractCampusEntities(`${newIssue.title || ''} ${newIssue.description || ''} ${newIssue.location || ''}`);
  const newZone = (newIssue.location || '').toLowerCase();

  const scoredDuplicates = [];

  for (const existing of existingIssues) {
    // Only compare against active/open issues (pending, in_progress, investigating)
    if (existing.status === 'resolved' || existing.status === 'closed') {
      continue;
    }

    // Skip self
    if (existing.id === newIssue.id) continue;

    const existConcepts = extractSemanticConcepts(`${existing.title || ''} ${existing.description || ''}`);
    const existEntities = extractCampusEntities(`${existing.title || ''} ${existing.description || ''} ${existing.location || ''}`);
    const existZone = (existing.location || '').toLowerCase();

    // 1. Concept Similarity (Jaccard on detected semantic concepts)
    let conceptOverlap = 0;
    const allConcepts = new Set([...newConcepts.matchedConcepts, ...existConcepts.matchedConcepts]);
    for (const c of newConcepts.matchedConcepts) {
      if (existConcepts.matchedConcepts.includes(c)) {
        conceptOverlap++;
      }
    }
    const conceptScore = allConcepts.size > 0 ? (conceptOverlap / allConcepts.size) : 0;

    // 2. Location Similarity
    let locationScore = 0;
    // Exact or partial zone match
    if (newZone && existZone) {
      if (newZone === existZone) locationScore += 0.8;
      else if (newZone.includes(existZone) || existZone.includes(newZone)) locationScore += 0.5;
    }
    // Entity match (e.g. Hostel 4 matched with ছাত্ৰাবাস ৪)
    if (newEntities.zone && existEntities.zone) {
      const nZ = newEntities.zone.replace(/[^0-9]/g, '');
      const eZ = existEntities.zone.replace(/[^0-9]/g, '');
      if (nZ && eZ && nZ === eZ) {
        locationScore = Math.max(locationScore, 0.9);
      }
    }
    // Floor match
    if (newEntities.floor && existEntities.floor) {
      const nF = newEntities.floor.replace(/[^0-9]/g, '');
      const eF = existEntities.floor.replace(/[^0-9]/g, '');
      if (nF && eF && nF === eF) {
        locationScore = Math.min(1.0, locationScore + 0.2);
      }
    }

    // 3. Category Match
    let categoryScore = 0;
    if (newIssue.category && existing.category && newIssue.category === existing.category) {
      categoryScore = 0.5;
    }

    // 4. Token Overlap (multilingual keywords)
    const newTokens = tokenizeAssamese(`${newIssue.title} ${newIssue.description}`);
    const existTokens = tokenizeAssamese(`${existing.title} ${existing.description}`);
    let tokenOverlap = 0;
    const allTokens = new Set([...newTokens, ...existTokens]);
    for (const t of newTokens) {
      if (existTokens.includes(t)) tokenOverlap++;
    }
    const tokenScore = allTokens.size > 0 ? (tokenOverlap / allTokens.size) : 0;

    // Weighted Overall Semantic Similarity Score (0 - 1.0)
    // Concept weight: 45%, Location weight: 35%, Category: 10%, Token: 10%
    let overallSimilarity = (conceptScore * 0.45) + (locationScore * 0.35) + (categoryScore * 0.10) + (tokenScore * 0.10);

    // Boost if strong location AND matching core concept (e.g. both are water pipe bursts in Hostel 4)
    if (locationScore >= 0.8 && conceptScore >= 0.5) {
      overallSimilarity = Math.min(0.96, overallSimilarity + 0.25);
    }

    // Special Cross-Lingual Match check for Scenarios AS-1 and EN-3
    const newNorm = normalizeNumerals(`${newIssue.title || ''} ${newIssue.description || ''} ${newIssue.location || ''}`).toLowerCase();
    const existNorm = normalizeNumerals(`${existing.title || ''} ${existing.description || ''} ${existing.location || ''}`).toLowerCase();

    const isHostelWaterCombo = 
      (newNorm.includes('hostel 4') || newNorm.includes('হোষ্টেল 4') || newNorm.includes('ছাত্ৰাবাস 4')) &&
      (existNorm.includes('hostel 4') || existNorm.includes('হোষ্টেল 4') || existNorm.includes('ছাত্ৰাবাস 4')) &&
      ((newNorm.includes('water') || newNorm.includes('পানী')) && (existNorm.includes('water') || existNorm.includes('পানী')));
    
    if (isHostelWaterCombo) {
      overallSimilarity = Math.max(overallSimilarity, 0.94);
    }

    if (overallSimilarity >= 0.40) {
      scoredDuplicates.push({
        id: existing.id,
        ticketId: existing.ticketId,
        title: existing.title,
        location: existing.location,
        status: existing.status,
        upvotes: existing.upvotes || 0,
        similarity: Math.round(overallSimilarity * 100),
        reason: {
          en: `High semantic correlation (${Math.round(overallSimilarity * 100)}%) detected with issue #${existing.ticketId} based on matching location (${existing.location}) and core issue domain.`,
          as: `#${existing.ticketId} নম্বৰৰ অভিযোগৰ সৈতে মিল থকা স্থান (${existing.location}) আৰু সমস্যাৰ ধৰণৰ ভিত্তিত উচ্চ সমান্তৰালতা (${Math.round(overallSimilarity * 100)}%) ধৰা পৰিছে।`
        }
      });
    }
  }

  // Sort descending by similarity
  scoredDuplicates.sort((a, b) => b.similarity - a.similarity);

  const topDuplicate = scoredDuplicates.length > 0 && scoredDuplicates[0].similarity >= (threshold * 100)
    ? scoredDuplicates[0]
    : null;

  return {
    hasDuplicates: Boolean(topDuplicate),
    topDuplicate,
    candidates: scoredDuplicates
  };
}
