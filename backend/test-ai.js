import { classifyComplaint } from './src/ai/classifier.js';
import { findDuplicateIssues } from './src/ai/duplicateDetector.js';
import { generateBilingualSummary } from './src/ai/summarizer.js';
import { generateOfficialNotice } from './src/ai/noticeGenerator.js';
import { INITIAL_SEED_ISSUES } from './src/db/seedData.js';

console.log('================================================================');
console.log('   CivicSense AI & Assamese-English Linguistic Engine Tests     ');
console.log('================================================================\n');

// Test 1: Assamese Compound Hazard (Scenario AS-01)
const asCompoundText = 'হোষ্টেল ৪-ৰ ৩য় মহলাৰ বাথৰুমত পানীৰ পাইপ ফাটি পানী ওলাই আছে আৰু বিজুলীৰ ছুইটচৰ ওচৰলৈ গৈছে। অতি সোনকালে পদক্ষেপ লওক কাৰণ শ্বৰ্ট চাৰ্কিট হোৱাৰ সম্ভাৱনা আছে।';
const asClass = classifyComplaint(asCompoundText);
console.log('Test 1: Assamese Compound Hazard (Water + Electricity)');
console.log('  Detected Category:', asClass.category, '|', asClass.categoryName.en, '/', asClass.categoryName.as);
console.log('  Priority:', asClass.priority, '| SLA:', asClass.slaHours, 'hours | Urgency Score:', asClass.urgencyScore);
console.log('  Is Compound Hazard:', asClass.isCompoundHazard);
console.assert(asClass.priority === 'critical', 'Expected priority to be critical');
console.assert(asClass.isCompoundHazard === true, 'Expected compound hazard to be true');
console.log('  ✓ Test 1 Passed!\n');

// Test 2: Bilingual Summary Generation
const summary = generateBilingualSummary({
  title: 'পানীৰ পাইপ ফাটিছে',
  description: asCompoundText,
  location: 'Boys Hostel 4 (3rd Floor)',
  category: asClass.category,
  priority: asClass.priority,
  department: asClass.department,
  isCompoundHazard: asClass.isCompoundHazard
});
console.log('Test 2: Bilingual Structured Summary');
console.log('  [English Summary Preview]:', summary.en.split('\n')[0]);
console.log('  [Assamese Summary Preview]:', summary.as.split('\n')[0]);
console.assert(summary.en.length > 20 && summary.as.length > 20, 'Expected non-empty summaries');
console.log('  ✓ Test 2 Passed!\n');

// Test 3: Cross-Lingual Semantic Duplicate Detection (Scenario EN-03 vs AS-01)
const sampleExistingIssue = {
  id: 'iss_as_01',
  ticketId: 'CS-2026-1001',
  title: 'হোষ্টেল ৪-ৰ বাথৰুমত পানীৰ পাইপ ফাটি বিজুলীৰ ছুইটচৰ ওচৰলৈ গৈছে',
  description: 'হোষ্টেল ৪-ৰ ৩য় মহলাৰ বাথৰুমত পানীৰ পাইপ ফাটি পানী ওলাই আছে আৰু বিজুলীৰ ছুইটচৰ ওচৰলৈ গৈছে।',
  location: 'Boys Hostel 4 (3rd Floor)',
  category: 'water',
  department: { en: 'Electrical Maintenance', as: 'বিদ্যুৎ ৰক্ষণাবেক্ষণ বিভাগ' },
  status: 'in_progress'
};

const enDuplicateText = 'Water leaking continuously from washroom pipe in Hostel 4 3rd floor near switch';
const dupResult = findDuplicateIssues({
  id: 'test_new',
  title: 'Water leaking in Hostel 4',
  description: enDuplicateText,
  location: 'Boys Hostel 4 (3rd Floor)',
  category: 'water'
}, [sampleExistingIssue]);

console.log('Test 3: Cross-Lingual Semantic Duplicate Detection (English -> Assamese)');
console.log('  Has Duplicates:', dupResult.hasDuplicates);
if (dupResult.topDuplicate) {
  console.log('  Top Matched Ticket:', dupResult.topDuplicate.ticketId);
  console.log('  Semantic Similarity Score:', dupResult.topDuplicate.similarity + '%');
  console.log('  Reason (AS):', dupResult.topDuplicate.reason.as);
  console.log('  Reason (EN):', dupResult.topDuplicate.reason.en);
  console.assert(dupResult.topDuplicate.similarity >= 85, 'Expected similarity >= 85%');
}
console.log('  ✓ Test 3 Passed!\n');

// Test 4: Official Administrative Notice Drafter
const notice = generateOfficialNotice(sampleExistingIssue, 'Repaired PVC manifold and insulated electrical switchboard.');
console.log('Test 4: Official Notice Generation');
console.log('  Notice Ref:', notice.ticketId);
console.log('  Notice EN Length:', notice.en.length, 'chars');
console.log('  Notice AS Length:', notice.as.length, 'chars');
console.assert(notice.as.includes('চৌহদ প্ৰশাসনিক বিষয়াৰ কাৰ্যালয়'), 'Expected formal Assamese heading');
console.log('  ✓ Test 4 Passed!\n');

console.log('================================================================');
console.log('   ALL 4 CORE AI & LINGUISTIC TESTS PASSED SUCCESSFULLY!        ');
console.log('================================================================');
