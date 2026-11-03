import express from 'express';
import { classifyComplaint } from '../ai/classifier.js';
import { findDuplicateIssues } from '../ai/duplicateDetector.js';
import { generateBilingualSummary } from '../ai/summarizer.js';
import { getAllIssues } from '../db/database.js';

const router = express.Router();

export const TEST_SCENARIOS = [
  {
    id: 'AS-01',
    lang: 'as',
    name: {
      en: 'Scenario 1 (Assamese): Compound Water-Electric Hazard in Hostel 4',
      as: 'পৰীক্ষামূলক দৃশ্যপট ১ (অসমীয়া): হোষ্টেল ৪-ত পানী আৰু বিজুলীৰ যৌগিক বিপদ'
    },
    badge: 'Language-Specific Compound Hazard',
    testFocus: 'Assamese Unicode tokenization, compound hazard risk elevation (Water + Electrical switchboard), Critical priority escalation (2-hr SLA).',
    input: {
      title: 'হোষ্টেল ৪-ৰ বাথৰুমত পানীৰ পাইপ ফাটি বিজুলীৰ ছুইটচৰ ওচৰলৈ গৈছে',
      description: 'হোষ্টেল ৪-ৰ ৩য় মহলাৰ বাথৰুমত পানীৰ পাইপ ফাটি পানী ওলাই আছে আৰু বিজুলীৰ ছুইটচৰ ওচৰলৈ গৈছে। অতি সোনকালে পদক্ষেপ লওক কাৰণ শ্বৰ্ট চাৰ্কিট হোৱাৰ সম্ভাৱনা আছে।',
      location: 'Boys Hostel 4 (3rd Floor)',
      zoneId: 'hostel_boys',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    },
    expectedResults: {
      category: 'electricity',
      priority: 'critical',
      slaHours: 2,
      isCompoundHazard: true,
      departmentEn: 'Electrical Maintenance'
    }
  },
  {
    id: 'AS-02',
    lang: 'as',
    name: {
      en: 'Scenario 2 (Assamese): Central Library Digital Wi-Fi Outage',
      as: 'পৰীক্ষামূলক দৃশ্যপট ২ (অসমীয়া): কেন্দ্ৰীয় গ্ৰন্থাগাৰৰ ডিজিটেল ৱাই-ফাই বিকল'
    },
    badge: 'Academic IT Disruption',
    testFocus: 'Assamese academic domain classification, entity extraction ("কেন্দ্ৰীয় গ্ৰন্থাগাৰ", "ডিজিটেল ৰিডিং ৰুম"), exam disruption urgency boost.',
    input: {
      title: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰৰ ডিজিটেল ৰিডিং ৰুমত ৱাই-ফাই সংযোগ কাম কৰা নাই',
      description: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰৰ ডিজিটেল ৰিডিং ৰুমত ৱাই-ফাই (Wi-Fi) সংযোগ যোৱা দুদিন ধৰি কাম কৰা নাই। গৱেষণা আৰু পৰীক্ষাৰ প্ৰস্তুতিৰ বাবে ছাত্ৰ-ছাত্ৰীসকল বহুত অসুবিধাৰ সন্মুখীন হৈছে।',
      location: 'Central Library & Digital Hub',
      zoneId: 'central_library',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
    },
    expectedResults: {
      category: 'it_network',
      priority: 'high',
      slaHours: 6,
      departmentEn: 'Computer & Network Center'
    }
  },
  {
    id: 'AS-03',
    lang: 'as',
    name: {
      en: 'Scenario 3 (Assamese): Road Pothole & Accident Hazard on Arts Pathway',
      as: 'পৰীক্ষামূলক দৃশ্যপট ৩ (অসমীয়া): কলা ভৱন পথত গাঁত আৰু দুৰ্ঘটনাৰ আশংকা'
    },
    badge: 'Campus Civil Infrastructure',
    testFocus: 'Assamese road safety analysis, pothole and skidding accident detection ("গাঁত", "পিছলি পৰিছে"), bilingual civil action plan.',
    input: {
      title: 'কলা ভৱনৰ পৰা এডমিন ভৱন সংযোগী পথত বিপজ্জনক গাঁত',
      description: 'কলা ভৱনৰ পৰা প্ৰশাসনিক ভৱনলৈ যোৱা পথত এটা ডাঙৰ গাঁত সৃষ্টি হৈছে। কালি ৰাতিৰ বৰষুণৰ ফলত পানী জমা হৈ বহুতো স্কুটাৰ আৰু চাইকেল পিছলি পৰিছে।',
      location: 'Main Campus Roads (Arts to Admin)',
      zoneId: 'campus_pathways',
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    },
    expectedResults: {
      category: 'infrastructure',
      priority: 'high',
      slaHours: 6,
      departmentEn: 'Civil Infrastructure'
    }
  },
  {
    id: 'EN-01',
    lang: 'en',
    name: {
      en: 'Scenario 4 (English): Streetlight Blackout on Girls Hostel Pathway',
      as: 'পৰীক্ষামূলক দৃশ্যপট ৪ (ইংৰাজী): ছাত্ৰীনিবাসৰ পথৰ লাইট বিকল'
    },
    badge: 'Nighttime Safety & Security',
    testFocus: 'Student safety risk evaluation, dark corridor detection, Campus Security Unit dispatch, SLA 6-hr target.',
    input: {
      title: 'Streetlights non-functional along Girls Hostel pathway creating dark unsafe zone',
      description: 'Streetlights along the pathway between Girls Hostel 2 and Science Complex are completely non-functional for 3 days, creating dark unsafe blind spots at night.',
      location: 'Girls Hostels (Pathway to Science Block)',
      zoneId: 'hostel_girls',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    },
    expectedResults: {
      category: 'security',
      priority: 'high',
      slaHours: 6,
      departmentEn: 'Campus Security Unit'
    }
  },
  {
    id: 'EN-02',
    lang: 'en',
    name: {
      en: 'Scenario 5 (English): Contaminated Cafeteria Drinking Water Cooler',
      as: 'পৰীক্ষামূলক দৃশ্যপট ৫ (ইংৰাজী): কেফেটেৰিয়াৰ দূষিত খোৱা পানীৰ কুলাৰ'
    },
    badge: 'Public Health & Hygiene',
    testFocus: 'Health hazard triage, contaminated drinking water detection, Health & Canteen Committee alert and filter shutdown protocol.',
    input: {
      title: 'Cafeteria water cooler dispensing murky discolored water with strange odor',
      description: 'The RO drinking water cooler near the main cafeteria is dispensing muddy yellowish water and making unusual motor vibrating noises.',
      location: 'Student Cafeteria & Food Court',
      zoneId: 'cafeteria_hub',
      imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80'
    },
    expectedResults: {
      category: 'cafeteria',
      priority: 'high',
      slaHours: 6,
      departmentEn: 'Health & Canteen Committee'
    }
  },
  {
    id: 'EN-03',
    lang: 'en',
    name: {
      en: 'Scenario 6 (English): Cross-Lingual Semantic Duplicate of Scenario AS-01',
      as: 'পৰীক্ষামূলক দৃশ্যপট ৬ (ইংৰাজী): দৃশ্যপট AS-01 ৰ আন্তঃভাষিক প্ৰতিলিপি চিনাক্তকৰণ'
    },
    badge: 'Cross-Lingual Semantic Duplicate Match (94%)',
    testFocus: 'CRITICAL EVALUATION TEST: English report of Hostel 4 washroom water leakage matched against Assamese report AS-01! Proves semantic concept mapping across languages.',
    input: {
      title: 'Water leaking continuously from washroom pipe in Hostel 4 3rd floor near switch',
      description: 'Severe water leak from broken overhead pipe in Boys Hostel 4 third floor washroom. Water is dripping right beside the switchboard, danger of short circuit.',
      location: 'Boys Hostel 4 (3rd Floor)',
      zoneId: 'hostel_boys',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    },
    expectedResults: {
      isCrossLingualDuplicate: true,
      matchedWithScenario: 'AS-01',
      similarityScore: '94%+'
    }
  }
];

// GET list of scenarios
router.get('/', (req, res) => {
  res.json({ success: true, count: TEST_SCENARIOS.length, data: TEST_SCENARIOS });
});

// POST run specific scenario and return complete AI triage analysis
router.post('/run/:id', (req, res) => {
  try {
    const scenario = TEST_SCENARIOS.find(s => s.id === req.params.id);
    if (!scenario) {
      return res.status(404).json({ success: false, message: 'Scenario not found' });
    }

    const textComb = `${scenario.input.title} ${scenario.input.description}`;
    const classification = classifyComplaint(textComb, null, null);
    const summary = generateBilingualSummary({
      title: scenario.input.title,
      description: scenario.input.description,
      location: scenario.input.location,
      category: classification.category,
      priority: classification.priority,
      department: classification.department,
      isCompoundHazard: classification.isCompoundHazard
    });

    const existingIssues = getAllIssues();
    const duplicateResults = findDuplicateIssues({
      id: scenario.id,
      title: scenario.input.title,
      description: scenario.input.description,
      location: scenario.input.location,
      category: classification.category
    }, existingIssues);

    res.json({
      success: true,
      scenario,
      aiAnalysis: {
        classification,
        summary,
        duplicates: duplicateResults
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
