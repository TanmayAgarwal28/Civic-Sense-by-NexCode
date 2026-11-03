/**
 * CivicSense Assamese (অসমীয়া) Linguistic & NLP Engine
 * 
 * Provides:
 * - Unicode text normalization (U+0980 - U+09FF)
 * - Assamese tokenizer and stopword filter
 * - Entity extraction (hostels, floors, blocks, campus landmarks)
 * - Hazard and urgency vector detection
 * - Cross-lingual semantic concept mapping to English
 */

export const ASSAMESE_STOPWORDS = new Set([
  'আৰু', 'এই', 'সেই', 'এটা', 'এখন', 'হৈছে', 'আছে', 'নাই', 'কৰা', 'হৈ', 'পৰা',
  'লৈ', 'বাবে', 'কাৰণে', 'হলে', 'যদি', 'কিন্তু', 'বা', 'মই', 'আমি', 'তেওঁ',
  'তেওঁলোক', 'মোৰ', 'আমাৰ', 'যোৱা', 'কালি', 'আজি', 'কালৈ', 'হৈছে', 'থকা', 'কৰি',
  'লৈকে', 'দ্বাৰা', 'ওপৰত', 'তলত', 'ভিতৰত', 'বাহিৰত', 'বহুত', 'অলপ', 'সকলো'
]);

// Campus entity extractors for Assamese
export const ASSAMESE_CAMPUS_ENTITIES = {
  zones: [
    { pattern: /হোষ্টেল\s*([০-৯0-9]+|[১২৩৪৫]+)/i, label: 'Hostel' },
    { pattern: /ছাত্ৰাবাস\s*([০-৯0-9]+|[১২৩৪৫]+)/i, label: 'Boys Hostel' },
    { pattern: /ছাত্ৰীনিবাস\s*([০-৯0-9]+|[১২৩৪৫]+)/i, label: 'Girls Hostel' },
    { pattern: /গ্ৰন্থাগাৰ|লাইব্ৰেৰী|ডিজিটেল\s*ৰিডিং/i, label: 'Central Library' },
    { pattern: /কেফেটেৰিয়া|কেণ্টিন|মেচ/i, label: 'Cafeteria' },
    { pattern: /কলা\s*ভৱন|আৰ্টচ/i, label: 'Arts Building' },
    { pattern: /বিজ্ঞান\s*ভৱন|ছাইঞ্চ/i, label: 'Science Complex' },
    { pattern: /প্ৰশাসনিক\s*ভৱন|এডমিন/i, label: 'Administrative Block' },
    { pattern: /অভিযান্ত্ৰিক\s*ভৱন|ইঞ্জিনিয়াৰিং/i, label: 'Engineering Block' },
    { pattern: /ক্ৰীড়া\s*প্ৰাংগন|খেলপথাৰ|জিম/i, label: 'Sports Complex' },
    { pattern: /পথ|ৰাস্তা|ফুটপাথ/i, label: 'Main Roads' }
  ],
  locations: [
    { pattern: /([১-৯0-9]+)\s*(য়|তম)?\s*মহলা/i, label: 'Floor' },
    { pattern: /বাথৰুম|শৌচাগাৰ|ৱাশ্বৰুম/i, label: 'Washroom' },
    { pattern: /ছাদ|ছাত/i, label: 'Rooftop' },
    { pattern: /বাৰাণ্ডা|কৰিডৰ/i, label: 'Corridor' },
    { pattern: /প্ৰৱেশদ্বাৰ|গেট|দুৱাৰ/i, label: 'Entrance Gate' }
  ]
};

// Concept lexicon mapping Assamese roots <-> Semantic concepts
export const CONCEPT_LEXICON = {
  water_plumbing: {
    as: ['পানী', 'পাইপ', 'নল', 'বাথৰুম', 'টেপ', 'টেংকী', 'নিষ্কাশন', 'নলা', 'পানী ওলাই', 'ফাটিছে', 'পানী জমা', 'লিক', 'শৌচাগাৰ', 'লেতেৰা পানী', 'পানীৰ নাটনি', 'মটৰ'],
    en: ['water', 'pipe', 'leak', 'plumbing', 'washroom', 'tap', 'tank', 'overflow', 'drainage', 'burst', 'flood', 'motor', 'sewage']
  },
  electrical: {
    as: ['বিজুলী', 'বিদ্যুৎ', 'কাৰেণ্ট', 'ছুইটচ', 'চুইচ', 'তাঁৰ', 'লাইট', 'এন্ধাৰ', 'শ্বৰ্ট চাৰ্কিট', 'ফিউজ', 'পেনেল', 'স্ফুলিংগ', 'স্পাৰ্ক', 'জ্বলা নাই', 'বিদ্যুতৰ খুঁটা', 'পাংখা', 'পেনেল বোৰ্ড'],
    en: ['electricity', 'power', 'current', 'switch', 'wire', 'light', 'dark', 'short circuit', 'fuse', 'spark', 'panelboard', 'outage', 'lamp', 'fan', 'streetlight']
  },
  it_network: {
    as: ['ৱাই-ফাই', 'ইণ্টাৰনেট', 'কম্পিউটাৰ', 'নেটৱৰ্ক', 'চাৰ্ভাৰ', 'লেব', 'সংযোগ', 'চিগনেল', 'ৰাউটাৰ', 'কেবল', 'অনলাইন', 'ৱেবচাইট', 'প্ৰজেক্টৰ'],
    en: ['wifi', 'wi-fi', 'internet', 'network', 'router', 'server', 'connection', 'signal', 'computer', 'lan', 'offline', 'projector', 'bandwidth']
  },
  roads_infra: {
    as: ['পথ', 'ৰাস্তা', 'গাঁত', 'বৰষুণ', 'পিছলি', 'দুৰ্ঘটনা', 'দেৱাল', 'ছাদ', 'ফাট', 'দুৱাৰ', 'খিৰিকী', 'ভাঙিছে', 'চিৰি', 'ফুটপাথ', 'ছাইকেল', 'স্কুটাৰ', 'কংক্ৰিট'],
    en: ['road', 'pathway', 'pothole', 'crack', 'pavement', 'skid', 'accident', 'broken', 'wall', 'roof', 'door', 'window', 'stairs', 'tile', 'structure', 'damage']
  },
  sanitation: {
    as: ['আৱৰ্জনা', 'ডাষ্টবিন', 'দুৰ্গন্ধ', 'লেতেৰা', 'পৰিচ্ছন্নতা', 'মহ', 'মাখি', 'পচিছে', 'অপৰিষ্কাৰ', 'জাৱৰ', 'প্লাষ্টিক', 'মলিয়ন'],
    en: ['garbage', 'trash', 'dustbin', 'smell', 'odor', 'stink', 'dirty', 'sanitation', 'hygiene', 'waste', 'mosquito', 'flies', 'cleanliness', 'litter']
  },
  security_safety: {
    as: ['সুৰক্ষা', 'নিৰাপত্তা', 'গাৰ্ড', 'চুৰি', 'গেট', 'বিপদ', 'অন্ধকাৰ', 'ভয়', 'অসুৰক্ষিত', 'ছাত্ৰী', 'ৰাতি', 'অনুবেশন', 'সিসিটিভি', 'কেমেৰা'],
    en: ['security', 'safety', 'guard', 'theft', 'dark', 'unsafe', 'girls', 'night', 'intruder', 'cctv', 'camera', 'threat', 'emergency', 'harassment']
  },
  cafeteria_food: {
    as: ['কেফেটেৰিয়া', 'কেণ্টিন', 'খাদ্য', 'খোৱা পানী', 'খোৱাবস্তু', 'বিষাক্ত', 'পুষ্টিকৰ', 'খাব নোৱাৰি', 'গেলা', 'খোৱা টেবুল'],
    en: ['cafeteria', 'canteen', 'food', 'drinking water', 'meal', 'mess', 'cooler', 'hygiene', 'spoiled', 'unhygienic', 'contaminated']
  }
};

// Hazard markers for severity computation
export const HAZARD_KEYWORDS = {
  critical: {
    as: ['শ্বৰ্ট চাৰ্কিট', 'জুই', 'স্ফুলিংগ', 'বিপদজনক', 'জীৱনৰ ভাবুকি', 'বিদ্যুৎ পৃষ্ঠ', 'পানী আৰু বিজুলী', 'পানীৰ ছুইটচ', 'ফাটি গৈছে', 'ভয়ংকৰ', 'ভাঙি পৰিব পাৰে', 'গভীৰ গাঁত', 'দুৰ্ঘটনা হৈছে'],
    en: ['short circuit', 'fire', 'sparking', 'electric shock', 'hazard', 'life threatening', 'electrocution', 'water and electricity', 'burst switchboard', 'structural collapse', 'severe accident']
  },
  high: {
    as: ['অতি সোনকালে', 'জৰুৰী', 'অন্ধকাৰ', 'অসুৰক্ষিত', 'দুদিন ধৰি', 'পানী নাই', 'সংযোগ বিচ্ছিন্ন', 'পিছলি পৰিছে', 'দুৰ্গন্ধ', 'ছাত্ৰীৰ সুৰক্ষা', 'পৰীক্ষাৰ অসুবিধা'],
    en: ['urgent', 'immediately', 'darkness', 'unsafe', 'blackout', 'no water', 'disconnected', 'slipping', 'exam disrupted', 'girls safety', 'foul odor', 'two days']
  }
};

/**
 * Converts Assamese Eastern Nagari numerals (০-৯) to standard Arabic digits (0-9)
 */
export function normalizeNumerals(text) {
  if (!text) return '';
  const numMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
  return text.replace(/[০-৯]/g, d => numMap[d] || d);
}

/**
 * Tokenizes Assamese text into words, removing punctuation and normalizing unicode
 */
export function tokenizeAssamese(text) {
  if (!text) return [];
  // Normalize Assamese unicode characters and digits
  const normalized = normalizeNumerals(text)
    .normalize('NFC')
    .toLowerCase()
    .replace(/[।.,?!;:'"()\[\]{}\-_\/\\—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = normalized.split(' ').filter(token => {
    return token.length > 1 && !ASSAMESE_STOPWORDS.has(token);
  });

  return tokens;
}

/**
 * Detects if text is predominantly Assamese
 */
export function isAssamese(text) {
  if (!text) return false;
  // Assamese Unicode range: \u0980-\u09FF (specifically check for Assamese characteristics: ৰ, ৱ, বা প্ৰ etc.)
  const assameseRegex = /[\u0980-\u09FF]/g;
  const matches = text.match(assameseRegex);
  if (!matches) return false;
  // If >20% characters are Eastern Nagari/Assamese
  return matches.length / text.replace(/\s/g, '').length > 0.2;
}

/**
 * Extracts campus entities like Hostel numbers, floors, or buildings
 */
export function extractCampusEntities(text) {
  const detected = {
    zone: null,
    floor: null,
    specificLocation: null
  };

  for (const item of ASSAMESE_CAMPUS_ENTITIES.zones) {
    const match = text.match(item.pattern);
    if (match) {
      detected.zone = `${item.label} ${match[1] || ''}`.trim();
      break;
    }
  }

  for (const item of ASSAMESE_CAMPUS_ENTITIES.locations) {
    const match = text.match(item.pattern);
    if (match) {
      if (item.label === 'Floor') {
        detected.floor = `${match[1]} Floor`;
      } else {
        detected.specificLocation = item.label;
      }
    }
  }

  return detected;
}

/**
 * Extracts semantic concepts present in the text (both Assamese and English)
 */
export function extractSemanticConcepts(text) {
  const clean = text.toLowerCase();
  const matchedConcepts = new Set();
  const conceptScores = {};

  for (const [conceptKey, vocab] of Object.entries(CONCEPT_LEXICON)) {
    let score = 0;
    // Check Assamese keywords
    for (const kw of vocab.as) {
      if (clean.includes(kw)) {
        score += 2;
        matchedConcepts.add(conceptKey);
      }
    }
    // Check English keywords
    for (const kw of vocab.en) {
      if (clean.includes(kw)) {
        score += 2;
        matchedConcepts.add(conceptKey);
      }
    }
    if (score > 0) {
      conceptScores[conceptKey] = score;
    }
  }

  return {
    matchedConcepts: Array.from(matchedConcepts),
    conceptScores
  };
}
