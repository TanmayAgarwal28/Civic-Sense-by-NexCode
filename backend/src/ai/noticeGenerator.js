/**
 * CivicSense Official University Administrative Notice & Resolution Drafter
 * Automatically drafts formal bilingual notices for university boards,
 * emails/SMS to complainants, and work orders to engineering crews.
 */

export function generateOfficialNotice(issue, resolutionNotes = '', officerName = 'Campus Maintenance Officer') {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const ticketId = issue.ticketId || `CS-${issue.id.slice(0, 6)}`;
  const location = issue.location || 'Campus Premises';
  const categoryEn = issue.categoryName?.en || issue.category;
  const categoryAs = issue.categoryName?.as || issue.category;

  const noticeEn = `OFFICE OF THE CAMPUS ADMINISTRATIVE OFFICER
ASSAM STATE UNIVERSITY - TECH CAMPUS
Ref: ASU/CIVIC/${ticketId}/${new Date().getFullYear()}
Date: ${dateStr}

SUBJECT: ACTION TAKEN REPORT / STATUS UPDATE - ISSUE REGISTRATION #${ticketId}

To: Campus Stakeholder / Complainant
Location Affected: ${location}
Service Domain: ${categoryEn}

Dear University Member,

This is an official communication regarding your grievance filed under Ticket #${ticketId}. The Campus Issue Redressal Taskforce has reviewed the incident with Priority Level: ${issue.priority?.toUpperCase()}.

Current Status: ${issue.status === 'resolved' ? 'RESOLVED & VERIFIED' : 'ACTIVE INTERVENTION IN PROGRESS'}
Assigned Department: ${issue.department?.en || 'Estate & Works Division'}
SLA Target Window: Within ${issue.slaHours || 24} hours

Action Notes:
${resolutionNotes || 'Authorized engineering crew has executed emergency on-site triage. Preventive measures and permanent repairs have been documented in compliance with university campus standards.'}

For further inquiries or verification, please quote ticket number #${ticketId}.

Sincerely,
${officerName}
Chief Campus Administrator & Estate Engineer
Assam State University`;

  const noticeAs = `চৌহদ প্ৰশাসনিক বিষয়াৰ কাৰ্যালয়
অসম ৰাজ্যিক বিশ্ববিদ্যালয় - প্ৰযুক্তিবিদ্যা চৌহদ
স্মাৰক নং: ASU/CIVIC/${ticketId}/${new Date().getFullYear()}
তাৰিখ: ${dateStr}

বিষয়: পদক্ষেপ গ্ৰহণ প্ৰতিবেদন / স্থিতি অৱগতকৰণ - অভিযোগ পঞ্জীয়ন #${ticketId}

প্ৰতি: বিশ্ববিদ্যালয়ৰ সন্মানীয় সদস্য / অভিযোগকাৰী
ক্ষতিগ্ৰস্ত স্থান: ${location}
সেৱা বিভাগ: ${categoryAs}

সন্মানীয় সদস্যসকল,

অভিযোগ নম্বৰ #${ticketId} সম্পৰ্কে এইখন এক চৰকাৰী জাননী। চৌহদ সমস্যা সমাধান টাস্কফ’ৰ্চে ঘটনাটো ${issue.priority === 'critical' ? 'জৰুৰীকালীন' : issue.priority === 'high' ? 'উচ্চ' : 'নিয়মীয়া'} গুৰুত্বৰে সমীক্ষা কৰিছে।

বৰ্তমান স্থিতি: ${issue.status === 'resolved' ? 'সম্পূৰ্ণৰূপে সমাধান আৰু প্ৰমাণিত' : 'কাৰ্য্যকৰী পদক্ষেপ চলি আছে'}
দায়িত্বপ্ৰাপ্ত বিভাগ: ${issue.department?.as || 'চৌহদ পৰিচালনা আৰু লোকনিৰ্মাণ শাখা'}
নিৰ্ধাৰিত সময়সীমা: ${issue.slaHours || 24} ঘণ্টাৰ ভিতৰত

গৃহীত ব্যৱস্থাৰ বিৱৰণ:
${resolutionNotes || 'অনুমোদিত কাৰিকৰী দলে ঘটনাস্থলীত উপস্থিত হৈ তৎকালীন পৰীক্ষণ আৰু মেৰামতি কাৰ্য সম্পূৰ্ণ কৰিছে। বিশ্ববিদ্যালয়ৰ সুৰক্ষা নীতি অনুসৰি ব্যৱস্থা গ্ৰহণ কৰা হৈছে।'}

অধিক তথ্য অথবা পুনৰীক্ষণৰ বাবে অনুগ্ৰহ কৰি টিকট নম্বৰ #${ticketId} উল্লেখ কৰক।

ধন্যবাদেৰে,
${officerName}
মুখ্য চৌহদ প্ৰশাসক তথা কাৰ্য্যবাহী অভিযন্তা
অসম ৰাজ্যিক বিশ্ববিদ্যালয়`;

  return {
    ticketId,
    generatedAt: new Date().toISOString(),
    en: noticeEn,
    as: noticeAs
  };
}
