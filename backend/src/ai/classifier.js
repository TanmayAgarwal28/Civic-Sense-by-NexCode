import { CONFIG } from '../config.js';
import { extractCampusEntities, extractSemanticConcepts, HAZARD_KEYWORDS, isAssamese } from './assameseNlp.js';

export function classifyComplaint(text, imageAnalysis = null, explicitCategory = null) {
  const isAssam = isAssamese(text);
  const textLower = (text || '').toLowerCase();
  const { matchedConcepts, conceptScores } = extractSemanticConcepts(text);
  const entities = extractCampusEntities(text);

  // Score categories
  const categoryScores = {
    water: (conceptScores.water_plumbing || 0) * 1.5,
    electricity: (conceptScores.electrical || 0) * 1.5,
    it_network: (conceptScores.it_network || 0) * 1.5,
    infrastructure: (conceptScores.roads_infra || 0) * 1.4,
    sanitation: (conceptScores.sanitation || 0) * 1.3,
    security: (conceptScores.security_safety || 0) * 1.4,
    cafeteria: (conceptScores.cafeteria_food || 0) * 1.4,
    hostel: 0,
    library: 0
  };

  // Check for Hostel mentions
  if (textLower.includes('হোষ্টেল') || textLower.includes('ছাত্ৰাবাস') || textLower.includes('ছাত্ৰীনিবাস') || textLower.includes('hostel')) {
    categoryScores.hostel += 1.5;
  }
  // Check for Library mentions
  if (textLower.includes('গ্ৰন্থাগাৰ') || textLower.includes('লাইব্ৰেৰী') || textLower.includes('library') || textLower.includes('reading room')) {
    categoryScores.library += 2.0;
  }

  // Vision boost if image detected specific types
  if (imageAnalysis) {
    if (imageAnalysis.detectedType === 'water_damage') categoryScores.water += 3.0;
    if (imageAnalysis.detectedType === 'electrical_hazard') categoryScores.electricity += 3.0;
    if (imageAnalysis.detectedType === 'structural_cavity') categoryScores.infrastructure += 3.0;
    if (imageAnalysis.detectedType === 'sanitation_spill') categoryScores.sanitation += 2.5;
  }

  // Pick highest scoring category or default
  let bestCategory = explicitCategory || 'infrastructure';
  let highestScore = 0;

  for (const [cat, score] of Object.entries(categoryScores)) {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = cat;
    }
  }

  // If both water and electricity are detected (Compound Hazard!), prioritize electrical safety
  if (conceptScores.water_plumbing > 0 && conceptScores.electrical > 0) {
    bestCategory = 'electricity'; // Shock risk supersedes plumbing
  }

  const categoryObj = CONFIG.CATEGORIES.find(c => c.id === bestCategory) || CONFIG.CATEGORIES[0];

  // Prioritization and Urgency Scoring (0 - 100)
  let urgencyScore = 30; // base moderate urgency
  let priority = 'medium';

  // Check critical keywords
  const isCritical = 
    HAZARD_KEYWORDS.critical.as.some(kw => textLower.includes(kw)) ||
    HAZARD_KEYWORDS.critical.en.some(kw => textLower.includes(kw)) ||
    (imageAnalysis && imageAnalysis.isCompoundElectricalHazard);

  const isHigh = 
    HAZARD_KEYWORDS.high.as.some(kw => textLower.includes(kw)) ||
    HAZARD_KEYWORDS.high.en.some(kw => textLower.includes(kw)) ||
    textLower.includes('exam') || textLower.includes('পৰীক্ষা') ||
    textLower.includes('non-functional') || textLower.includes('কাম কৰা নাই') ||
    textLower.includes('unsafe') || textLower.includes('অসুৰক্ষিত');

  if (isCritical) {
    urgencyScore = 95;
    priority = 'critical';
  } else if (isHigh) {
    urgencyScore = 75;
    priority = 'high';
  } else if (highestScore > 4) {
    urgencyScore = 55;
    priority = 'medium';
  } else {
    urgencyScore = 35;
    priority = 'low';
  }

  const slaHours = CONFIG.SLA_HOURS[priority] || 24;
  const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

  // Bilingual Department and Sub-unit
  const department = {
    en: categoryObj.defaultDept,
    as: getAssameseDepartmentName(categoryObj.defaultDept)
  };

  return {
    category: categoryObj.id,
    categoryName: {
      en: categoryObj.en,
      as: categoryObj.as
    },
    department,
    priority,
    urgencyScore,
    slaHours,
    slaDeadline,
    detectedEntities: entities,
    matchedConcepts,
    isCompoundHazard: isCritical && (conceptScores.water_plumbing > 0 && conceptScores.electrical > 0),
    languageDetected: isAssam ? 'as' : 'en'
  };
}

function getAssameseDepartmentName(enDept) {
  const map = {
    'Water Works & Sanitation': 'পানী যোগান আৰু অনাময় শাখা',
    'Electrical Maintenance': 'বিদ্যুৎ ৰক্ষণাবেক্ষণ বিভাগ',
    'Civil Infrastructure': 'লোকনিৰ্মাণ আৰু পথ শাখা',
    'Computer & Network Center': 'কম্পিউটাৰ আৰু নেটৱৰ্কিং কেন্দ্ৰ',
    'Campus Hygiene & Sanitation': 'চৌহদ পৰিচ্ছন্নতা আৰু অনাময় শাখা',
    'Hostel Administration': 'ছাত্ৰাবাস পৰিচালনা সমিতি',
    'Campus Security Unit': 'চৌহদ নিৰাপত্তা আৰু সুৰক্ষা বাহিনী',
    'Health & Canteen Committee': 'স্বাস্থ্য আৰু কেণ্টিন তদাৰকী সমিতি',
    'Central Library Administration': 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ প্ৰশাসন'
  };
  return map[enDept] || 'সাধাৰণ প্ৰশাসন শাখা';
}
