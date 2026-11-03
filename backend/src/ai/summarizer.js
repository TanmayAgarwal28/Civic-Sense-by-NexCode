import { isAssamese } from './assameseNlp.js';

/**
 * Generates structured, high-accuracy bilingual summaries and recommended action protocols
 * in both Assamese (অসমীয়া) and English.
 */
export function generateBilingualSummary({ title, description, location, category, priority, department, isCompoundHazard }) {
  const isInputAssam = isAssamese(description || title);
  
  // Category specific details in both languages
  const templates = {
    water: {
      enCore: 'Potable water or plumbing network malfunction',
      asCore: 'পানী যোগান অথবা নলীকা ব্যৱস্থাৰ বিজুতি',
      enAction: [
        'Isolate the main sub-line valve immediately to prevent water loss and damage',
        'Deploy plumbing crew with replacement pipe fittings, sealing tape, and clamps',
        'Verify structural integrity and check floor drainage to prevent stagnation'
      ],
      asAction: [
        'ক্ষতিসাধন ৰোধ কৰিবলৈ মূল পানীৰ পাইপলাইনৰ ভাল্ভ তৎক্ষণাৎ বন্ধ কৰক',
        'নতুন পাইপ আৰু ছীলিং সামগ্ৰী লৈ প্লাম্বাৰ দল প্ৰেৰণ কৰক',
        'পানী জমা নহবলৈ মজিয়া আৰু নলা পৰীক্ষা কৰক'
      ]
    },
    electricity: {
      enCore: 'Electrical power delivery or circuitry malfunction with potential safety hazard',
      asCore: 'বিদ্যুৎ সৰবৰাহ অথবা বৰ্তনীৰ বিজুতি যিয়ে নিৰাপত্তাজনিত ভাবুকি কঢ়িয়াই আনিছে',
      enAction: [
        'De-energize the respective circuit breaker (MCB) in the distribution panel',
        'Cordon off the immediate vicinity with hazard caution tape',
        'Inspect insulation, ground fault breakers, and replace damaged wiring or fixtures'
      ],
      asAction: [
        'ডিষ্ট্ৰিবিউচন পেনেলৰ পৰা নিৰ্দিষ্ট চাৰ্কিট ব্ৰেকাৰ (MCB) বিচ্ছিন্ন কৰক',
        'ভাবুকিপূৰ্ণ এলেকাটো সাৱধানতা সংকেতেৰে ঘেৰি ৰাখক',
        'তাঁৰ আৰু চুইচবোৰ্ড পৰীক্ষা কৰি নতুন অংশ সংযোগ কৰক'
      ]
    },
    it_network: {
      enCore: 'Campus network connectivity interruption or digital infrastructure disruption',
      asCore: 'চৌহদৰ ইণ্টাৰনেট সংযোগ বিচ্ছিন্নতা অথবা ডিজিটেল সেৱাৰ ব্যাহত অৱস্থা',
      enAction: [
        'Check uplink gateway and wireless access point (AP) status logs remotely',
        'Dispatch field technician to power cycle PoE switches and inspect Ethernet termination',
        'Inform affected campus department upon restoral of Wi-Fi services'
      ],
      asAction: [
        'ৰিমোট মাধ্যমৰে ৱাই-ফাই একচেছ পইণ্ট আৰু গেটৱে’ৰ স্থিতি পৰীক্ষা কৰক',
        'নেটৱৰ্ক ছুইচ আৰু কেবল পৰীক্ষাৰ বাবে কাৰিকৰী দল প্ৰেৰণ কৰক',
        'সংযোগ পুনৰুদ্ধাৰ হোৱাৰ পিছত ব্যৱহাৰকাৰীসকলক অৱগত কৰক'
      ]
    },
    infrastructure: {
      enCore: 'Civil infrastructure wear, road surface cratering or physical asset damage',
      asCore: 'চৌহদৰ আন্তঃগাঁথনিৰ ক্ষতি, পথৰ গাঁত অথবা ভৌতিক সম্পদৰ ভাঙোন',
      enAction: [
        'Erect warning barricades and safety reflectors around the damaged zone',
        'Dispatch civil maintenance team with quick-setting cold-mix asphalt or masonry mortar',
        'Level and finish surface to restore safe passage for students and vehicles'
      ],
      asAction: [
        'ক্ষতিগ্ৰস্ত স্থানত সতৰ্কতামূলক বেৰিকেড আৰু ৰিফ্লেক্টৰ স্থাপন কৰক',
        'চিভিল দলৰ দ্বাৰা মেৰামতি আৰু গাঁত পূৰণৰ কাম আৰম্ভ কৰক',
        'ছাত্ৰ-ছাত্ৰী আৰু বাহনৰ নিৰাপদ চলাচল নিশ্চিত কৰক'
      ]
    },
    sanitation: {
      enCore: 'Waste management backlog or environmental hygiene breach',
      asCore: 'আৱৰ্জনা জমা হোৱা অথবা পৰিবেশ স্বচ্ছতাৰ অৱনতি',
      enAction: [
        'Dispatch sanitation response crew with heavy-duty waste collection bins',
        'Apply disinfectant, anti-larval spray, and deodorizing powder',
        'Install scheduled clearance frequency tags on adjacent collection points'
      ],
      asAction: [
        'আৱৰ্জনা নিষ্কাশন দল প্ৰেৰণ কৰি স্থানটো চাফা কৰক',
        'জীৱাণুনাশক আৰু কীটনাশক ঔষধ ছটিয়াই পৰিচ্ছন্নতা বৰ্তাই ৰাখক',
        'নিয়মীয়া চাফাইৰ বাবে সময়সূচী নিৰ্ধাৰণ কৰক'
      ]
    },
    security: {
      enCore: 'Campus security vulnerability, blind spot, or perimeter monitoring concern',
      asCore: 'চৌহদ নিৰাপত্তাৰ দুৰ্বলতা, অন্ধকাৰ এলেকা অথবা সুৰক্ষাৰ অভাৱ',
      enAction: [
        'Increase security guard patrol frequency along the reported stretch',
        'Ensure immediate illumination or deployment of temporary high-mast lighting',
        'Review CCTV feeds and coordinate with university proctorial cell'
      ],
      asAction: [
        'নিৰ্দিষ্ট স্থানত নিৰাপত্তাৰক্ষীৰ তহল বৃদ্ধি কৰক',
        'পোহৰৰ ব্যৱস্থা অতি শীঘ্ৰে সক্ৰিয় কৰক',
        'চিচিটিভি ফুটেজ পৰীক্ষা কৰি সুৰক্ষা নিশ্চিত কৰক'
      ]
    },
    cafeteria: {
      enCore: 'Canteen food sanitation or drinking water dispenser contamination',
      asCore: 'কেফেটেৰিয়াৰ খাদ্য মান অথবা খোৱা পানীৰ পৰিশোধন বিজুতি',
      enAction: [
        'Temporarily seal the contaminated dispenser or water cooler',
        'Replace activated carbon and UV filtration candles immediately',
        'Conduct microbial water quality testing before reopening dispenser for use'
      ],
      asAction: [
        'ক্ষতিগ্ৰস্ত ৱাটাৰ কুলাৰ বা ফিল্টাৰ তাৎক্ষণাৎ বন্ধ কৰক',
        'নতুন ফিল্টাৰ কেণ্ডেল স্থাপন কৰি পানীৰ পৰিশোধন পৰীক্ষা কৰক',
        'নিৰাপদ মান নিশ্চিত নোহোৱালৈকে খোৱাৰ বাবে মুকলি নকৰিব'
      ]
    },
    hostel: {
      enCore: 'Residential student hall amenity impairment',
      asCore: 'ছাত্ৰাবাসৰ অত্যাৱশ্যকীয় সা-সুবিধাৰ বিজুতি',
      enAction: [
        'Coordinate with the resident warden to inspect the student block',
        'Dispatch emergency technician team within allotted SLA window',
        'Record student confirmation sign-off upon completion of work'
      ],
      asAction: [
        'হোষ্টেল ৱাৰ্ডেনৰ সৈতে সমন্বয় ৰাখি পৰিদৰ্শন কৰক',
        'নিৰ্ধাৰিত সময়ৰ ভিতৰত কাৰিকৰী দল প্ৰেৰণ কৰি সমস্যা সমাধান কৰক',
        'ছাত্ৰ-ছাত্ৰীৰ পৰা সন্তুষ্টিৰ প্ৰমাণপত্ৰ সংগ্ৰহ কৰক'
      ]
    },
    library: {
      enCore: 'Central academic library resource or study facility disruption',
      asCore: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰৰ অধ্যয়ন পৰিবেশ অথবা সুবিধাৰ ব্যাঘাত',
      enAction: [
        'Inspect reading room infrastructure and acoustic/network conditions',
        'Restore normal academic environment promptly for research scholars',
        'Update librarian desk bulletin with resolution timeline'
      ],
      asAction: [
        'অধ্যয়ন কক্ষৰ পৰিবেশ আৰু কাৰিকৰী সা-সুবিধা পৰীক্ষা কৰক',
        'গৱেষক আৰু ছাত্ৰ-ছাত্ৰীৰ বাবে উপযুক্ত শান্ত পৰিবেশ ঘূৰাই আনক',
        'লাইব্ৰেৰীৰ তথ্যফলকত কামৰ অগ্ৰগতি প্ৰকাশ কৰক'
      ]
    }
  };

  const currentTemplate = templates[category] || templates.infrastructure;

  // Compound Hazard special alert note
  const compoundHazardNoteEn = isCompoundHazard 
    ? 'CRITICAL SAFETY INTERSECTION: Water ingress near live electrical conduit creates an imminent electrocution and short-circuit hazard. Electrical power isolation must precede plumbing intervention!'
    : '';
  const compoundHazardNoteAs = isCompoundHazard
    ? 'জৰুৰী সুৰক্ষা সতৰ্কবাৰ্তা: বিজুলীৰ চুইচবোৰ্ডৰ ওচৰত পানী বিয়পি পৰাৰ ফলত বিদ্যুৎস্পৃষ্ট আৰু শ্বৰ্ট চাৰ্কিটৰ ভয়ংকৰ সম্ভাৱনা আছে। প্লাম্বিঙৰ কাম কৰাৰ পূৰ্বেই বিদ্যুৎ যোগান বন্ধ কৰাটো বাধ্যতামূলক!'
    : '';

  // Generate English Summary
  const summaryEn = `Issue Summary: ${currentTemplate.enCore} at ${location}.
Priority Assessment: ${priority.toUpperCase()} urgency (Dispatched to ${department.en || 'Campus Administration'}).
Impact Analysis: ${description ? description.slice(0, 160) + '...' : 'Direct impact on campus stakeholders.'}
${compoundHazardNoteEn ? `\nNote: ${compoundHazardNoteEn}` : ''}`;

  // Generate Assamese Summary
  const summaryAs = `সমস্যাৰ সাৰাংশ: ${location}-ত ${currentTemplate.asCore}।
গুৰুত্ব নিৰ্ধাৰণ: ${priority === 'critical' ? 'জৰুৰীকালীন' : priority === 'high' ? 'উচ্চ' : 'মধ্যম'} অগ্ৰাধিকাৰ (${department.as || 'চৌহদ প্ৰশাসন'}লৈ প্ৰেৰিত)।
প্ৰভাৱ বিশ্লষণ: ${description ? description.slice(0, 160) + '...' : 'চৌহদৰ সদস্যসকলৰ দৈনিক কাৰ্য্যকলাপত ব্যাঘাত।' }
${compoundHazardNoteAs ? `\nবিশেষ সতৰ্কবাৰ্তা: ${compoundHazardNoteAs}` : ''}`;

  return {
    en: summaryEn.trim(),
    as: summaryAs.trim(),
    rootCauseRisk: {
      en: isCompoundHazard ? 'Electrocution & Structural Water Seepage' : `${currentTemplate.enCore} leading to campus service outage.`,
      as: isCompoundHazard ? 'বিদ্যুৎস্পৃষ্টৰ আশংকা আৰু আন্তঃগাঁথনিগত পানীৰ ক্ষয়ক্ষতি।' : `${currentTemplate.asCore} যাৰ ফলত সেৱা ব্যাহত হৈছে।`
    },
    actionPlan: {
      en: currentTemplate.enAction,
      as: currentTemplate.asAction
    }
  };
}
