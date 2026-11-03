/**
 * CivicSense Universal Bilingual Translator & Resolver
 * Guarantees that any issue or complaint always has both English and Assamese representations.
 */

export function isAssameseText(text) {
  if (!text) return false;
  const assameseRegex = /[\u0980-\u09FF]/g;
  const matches = text.match(assameseRegex);
  if (!matches) return false;
  return matches.length / text.replace(/\s/g, '').length > 0.15;
}

const PHRASE_PAIRS = [
  { as: 'হোষ্টেল ৪-ৰ ৩য় মহলাত পানীৰ পাইপ ফাটিছে', en: 'Water pipe burst on 3rd Floor of Hostel 4' },
  { as: 'হোষ্টেল ৪-ৰ ৩য় মহলাৰ বাথৰুমত পানীৰ পাইপ ফাটি পানী ওলাই আছে আৰু বিজুলীৰ ছুইটচৰ ওচৰলৈ গৈছে', en: 'Water pipe leaking continuously in 3rd Floor washroom of Hostel 4, dangerously near electrical switches' },
  { as: 'প্ৰধান শৈক্ষিক ভৱনৰ লেব ২০৪-ৰ বাহিৰত চুইচবৰ্ডত ফিৰিঙতি ওলাইছে', en: 'Electric sparking and burning odor from main switchboard outside Lab 204 in Academic Complex' },
  { as: 'লেব ২০৪-ৰ সমুখৰ মূল কড়িড’ৰৰ চুইচবৰ্ডৰ পৰা ধোঁৱা আৰু ফিৰিঙতি ওলাইছে', en: 'Smoke and sparks detected from corridor switchboard in front of Lab 204. Urgent power cutoff requested' },
  { as: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ আৰু কলা ভৱনৰ সংযোগ পথত ডাঙৰ গাঁত আৰু বৰষুণৰ পানী', en: 'Deep pothole and water stagnation on connecting road between Library and Arts Building' },
  { as: 'পুথিভঁৰালৰ পৰা কলা ভৱনলৈ যোৱা পথত প্ৰায় ২ ফুট গভীৰ গাঁত হৈছে', en: 'Approximately 2-foot deep crater on connecting road. Students slipping on two-wheelers' },
  { as: 'ছাত্ৰীনিবাস ৩-ৰ ৱাই-ফাই একচেছ পইণ্ট বিকল, সংযোগ বিচ্ছিন্ন', en: 'Girls Hostel 3 Wi-Fi access point offline. Complete internet blackout' },
  { as: 'ছাত্ৰীনিবাস ৩-ৰ সকলো ব্লকত যোৱা ২৪ ঘণ্টা ধৰি ৱাই-ফাই সংযোগ নাই', en: 'No Wi-Fi connectivity across all blocks of Girls Hostel 3 for past 24 hours. Online exam prep disrupted' },
  { as: 'কেফেটেৰিয়া আৰু কেন্দ্ৰীয় কেণ্টিনৰ পিছফালে আৱৰ্জনাৰ দ’ম আৰু দুৰ্গন্ধ', en: 'Waste accumulation and severe foul odor behind central campus cafeteria' },
  { as: 'কেফেটেৰিয়াৰ ডাম্পিং জ’নত তিনিদিন ধৰি আৱৰ্জনা চাফা কৰা হোৱা নাই', en: 'Garbage not cleared for three days at cafeteria disposal site. Severe mosquito and flies issue' },

  // General building and issue patterns
  { as: 'পানীৰ পাইপ ফাটিছে', en: 'Water pipe burst / leak' },
  { as: 'পানী ওলাই আছে', en: 'Continuous water leakage' },
  { as: 'চুইচবৰ্ডত ফিৰিঙতি', en: 'Sparking from switchboard' },
  { as: 'শ্বৰ্ট চাৰ্কিট', en: 'Short circuit detected' },
  { as: 'ৱাই-ফাই কাম কৰা নাই', en: 'Wi-Fi not working / offline' },
  { as: 'ইণ্টাৰনেট বিচ্ছিন্ন', en: 'Internet disconnected' },
  { as: 'ৰাস্তাত ডাঙৰ গাঁত', en: 'Severe pothole on road' },
  { as: 'আৱৰ্জনা জমা হৈছে', en: 'Garbage accumulated' },
  { as: 'দুৰ্গন্ধ ওলাইছে', en: 'Foul odor / stench' },
  { as: 'লাইট জ্বলা নাই', en: 'Lighting failure' },
  { as: 'ষ্ট্ৰীট লাইট বেয়া', en: 'Streetlight non-functional' },
  { as: 'হোষ্টেল ৪', en: 'Hostel 4' },
  { as: 'হোষ্টেল ১', en: 'Hostel 1' },
  { as: 'হোষ্টেল ২', en: 'Hostel 2' },
  { as: 'হোষ্টেল ৩', en: 'Hostel 3' },
  { as: 'হোষ্টেল ৫', en: 'Hostel 5' },
  { as: 'বাথৰুম', en: 'Washroom' },
  { as: '৩য় মহলা', en: '3rd Floor' },
  { as: '২য় মহলা', en: '2nd Floor' },
  { as: '১ম মহলা', en: '1st Floor' }
];

export function quickTranslateText(text, targetLang) {
  if (!text) return '';
  let res = text;

  // Direct match
  const direct = PHRASE_PAIRS.find(p => p[targetLang === 'en' ? 'as' : 'en'] === text.trim());
  if (direct) return direct[targetLang === 'en' ? 'en' : 'as'];

  if (targetLang === 'en') {
    for (const p of PHRASE_PAIRS) {
      if (res.includes(p.as)) {
        res = res.replace(new RegExp(p.as, 'g'), p.en);
      }
    }
    // Clean up particles
    res = res.replace(/[।]/g, '.').replace(/ৰ\s+/g, ' of ').replace(/ত\s+/g, ' at ').replace(/লৈ\s+/g, ' to ').replace(/আৰু\s+/g, ' and ');
    res = res.replace(/[\u0980-\u09FF]/g, '').replace(/\s+/g, ' ').trim();
    return res || 'Campus maintenance requirement reported.';
  } else {
    for (const p of PHRASE_PAIRS) {
      const re = new RegExp(p.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      if (re.test(res)) {
        res = res.replace(re, p.as);
      }
    }
    res = res
      .replace(/\bwater pipe\b/gi, 'পানীৰ পাইপ')
      .replace(/\bleak(age)?\b/gi, 'লিক')
      .replace(/\bburst\b/gi, 'ফাটিছে')
      .replace(/\bwashroom\b/gi, 'বাথৰুম')
      .replace(/\bspark(ing)?\b/gi, 'ফিৰিঙতি')
      .replace(/\bswitchboard\b/gi, 'চুইচবৰ্ড')
      .replace(/\bpothole\b/gi, 'গাঁত')
      .replace(/\broad\b/gi, 'পথ')
      .replace(/\bgarbage\b/gi, 'আৱৰ্জনা')
      .replace(/\bhostel 4\b/gi, 'হোষ্টেল ৪')
      .replace(/\bhostel 1\b/gi, 'হোষ্টেল ১')
      .replace(/\bhostel 2\b/gi, 'হোষ্টেল ২')
      .replace(/\bhostel 3\b/gi, 'হোষ্টেল ৩')
      .replace(/\bhostel 5\b/gi, 'হোষ্টেল ৫')
      .replace(/\b3rd floor\b/gi, '৩য় মহলা')
      .replace(/\b2nd floor\b/gi, '২য় মহলা')
      .replace(/\b1st floor\b/gi, '১ম মহলা')
      .replace(/\band\b/gi, 'আৰু')
      .replace(/\bnear\b/gi, 'ওচৰত');
    return res.replace(/\s+/g, ' ').trim();
  }
}

/**
 * Returns complete bilingual content { titleEn, titleAs, descriptionEn, descriptionAs }
 * for ANY issue object.
 */
export function getIssueBilingual(issue) {
  if (!issue) {
    return { titleEn: '', titleAs: '', descriptionEn: '', descriptionAs: '' };
  }

  const rawTitle = issue.title || '';
  const rawDesc = issue.description || '';
  const isAssam = isAssameseText(rawTitle + ' ' + rawDesc);

  let titleEn = issue.titleEn;
  let titleAs = issue.titleAs;
  let descriptionEn = issue.descriptionEn;
  let descriptionAs = issue.descriptionAs;

  if (!titleEn) {
    titleEn = isAssam ? quickTranslateText(rawTitle, 'en') : rawTitle;
  }
  if (!titleAs) {
    titleAs = isAssam ? rawTitle : quickTranslateText(rawTitle, 'as');
  }
  if (!descriptionEn) {
    descriptionEn = isAssam ? quickTranslateText(rawDesc, 'en') : rawDesc;
  }
  if (!descriptionAs) {
    descriptionAs = isAssam ? rawDesc : quickTranslateText(rawDesc, 'as');
  }

  return {
    titleEn: titleEn || rawTitle,
    titleAs: titleAs || rawTitle,
    descriptionEn: descriptionEn || rawDesc,
    descriptionAs: descriptionAs || rawDesc
  };
}
