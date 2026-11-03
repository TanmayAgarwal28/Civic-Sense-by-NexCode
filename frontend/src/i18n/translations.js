/**
 * CivicSense Comprehensive Bilingual Localization (Assamese & English)
 * 100% complete coverage for all UI elements, labels, tooltips, and badges.
 */

export const TRANSLATIONS = {
  en: {
    // Brand & Header
    appTitle: 'CivicSense',
    appSubtitle: 'Bilingual AI Smart Campus Issue Management System',
    tagline: 'Intelligent Grievance Triage & Resolution Platform',
    universityName: 'Assam State University - Tech Campus',
    roleStudent: 'Student / Stakeholder View',
    roleAdmin: 'Campus Admin Command Center',
    sosButton: 'Emergency SOS Hotline',
    langToggle: 'অসমীয়া',
    notifications: 'Notifications',

    // Hero & Stats
    campusHealthScore: 'Campus Health Index',
    operational: 'Operational',
    totalIssues: 'Total Issues Filed',
    resolvedIssues: 'Resolved & Verified',
    inProgressIssues: 'Under Active Work',
    avgResolutionTime: 'Avg SLA Resolution',
    duplicatesPrevented: 'Duplicate Dispatches Saved',
    criticalAlerts: 'Critical Emergency Alerts',

    // Test Scenarios Bar
    testScenariosTitle: 'Hackathon Evaluation Test Scenarios (3 Assamese + 3 English)',
    testScenariosSubtitle: 'Demonstrate live AI multimodal triage, compound hazard risk elevation, and cross-lingual duplicate detection.',
    testBtn: 'Run AI Test',
    loadIntoFormBtn: 'Load into Form',
    testedBadge: 'Live Scenario',

    // Submission Form
    reportIssueTab: 'Report Campus Issue',
    browseIssuesTab: 'Campus Grievance Tracker',
    adminDashboardTab: 'Admin Triage & Operations',
    campusMapTab: 'Interactive Campus Map',
    formHeading: 'Submit Grievance or Infrastructure Issue',
    formSubheading: 'Write in Assamese or English. AI will auto-categorize, prioritize, and alert maintenance.',
    issueTitleLabel: 'Issue Title / চমু শিৰোনাম',
    issueTitlePlaceholder: 'e.g. Water pipe leakage near switchboard in Hostel 4...',
    issueDescLabel: 'Detailed Description / বিতং বিৱৰণ',
    issueDescPlaceholder: 'Describe the problem, exact spot, hazard risk, or how long it has been faulty...',
    zoneLabel: 'Campus Zone / চৌহদৰ স্থান',
    selectZonePlaceholder: '-- Select Campus Location Zone --',
    categoryLabel: 'Category / বিভাগীয় শ্ৰেণী',
    autoCategoryOption: '✨ Let AI Auto-Detect Category',
    photoUploadLabel: 'Attach Photographic Evidence (Multimodal Vision)',
    photoUploadHint: 'Drag & drop image or choose file. AI inspects fissures, water, and sparks.',
    anonymousLabel: 'Submit Anonymously (Hide my student identity from public tracker)',
    submitBtn: 'Submit Grievance to AI Triage',
    submittingBtn: 'AI Triaging & Validating...',
    aiPreCheckTitle: 'Real-time AI Pre-Check Preview',
    aiPreCheckHint: 'Type your issue to see instant AI categorization, priority, and duplicate analysis.',
    detectedCategory: 'Detected Category',
    detectedPriority: 'Urgency / Priority',
    assignedDept: 'Routing Department',
    estimatedSla: 'Target SLA Window',
    virtualKeyboardTitle: 'Assamese Character Assistant (অসমীয়া বৰ্ণ আৰু যুক্তাক্ষৰ সহায়ক)',

    // Duplicate Detection
    duplicateModalTitle: '⚠️ Semantic Duplicate Issue Detected!',
    duplicateModalDesc: 'Our AI found an existing open complaint matching your location and problem description.',
    similarityScore: 'Semantic Similarity',
    duplicateMatchedWith: 'Existing Registered Issue',
    upvoteInsteadBtn: '👍 Upvote Existing Issue (+1 Me Too)',
    submitAnywayBtn: 'Submit as Separate Issue Anyway',
    duplicateDetectedNotice: 'Filing duplicates causes redundant crew dispatch. Upvoting raises priority on the existing ticket.',

    // Public Tracker & Filters
    trackerHeading: 'Campus Grievance Redressal Feed',
    searchPlaceholder: 'Search by Ticket ID (e.g. CS-2026-1001), keywords, or location...',
    filterAll: 'All Issues',
    filterCritical: '🚨 Critical Priority',
    filterHigh: 'High Priority',
    filterInProgress: 'In Progress',
    filterResolved: 'Resolved',
    sortByRecent: 'Most Recent',
    sortByUrgency: 'Highest Urgency',
    sortByUpvotes: 'Most Upvoted',
    noIssuesFound: 'No campus issues found matching the selected filters.',

    // Issue Card & Detail
    ticketLabel: 'Ticket',
    viewDetailsBtn: 'View Bilingual Summary & Timeline',
    upvoteBtn: 'Me Too',
    anonymousUser: 'Campus Member',
    reportedOn: 'Reported',
    timelineHeading: 'Lifecycle & Resolution Timeline',
    aiSummaryHeading: 'AI-Generated Structured Bilingual Summary',
    actionPlanHeading: 'Recommended Maintenance Action Protocol',
    beforeAfterPhotos: 'Inspection & Resolution Verification Photos',
    beforePhoto: 'Reported Evidence',
    afterPhoto: 'Resolution Proof Photo',
    resolutionNotesLabel: 'Maintenance Field Report',

    // Statuses
    statusReported: 'Reported',
    statusTriaged: 'AI Triaged',
    statusInvestigating: 'Investigating',
    statusInProgress: 'In Progress',
    statusAssigned: 'Assigned',
    statusResolved: 'Resolved & Verified',
    statusClosed: 'Closed',
    statusEscalated: 'Escalated',

    // Priorities
    priorityCritical: 'CRITICAL (2h SLA)',
    priorityHigh: 'HIGH (6h SLA)',
    priorityMedium: 'MEDIUM (24h SLA)',
    priorityLow: 'LOW (48h SLA)',

    // Admin Dashboard
    adminHeading: 'Campus Infrastructure & Grievance Command Center',
    adminSubheading: 'Real-time coordination, crew dispatch, SLA breach monitoring, and official communications.',
    updateStatusModal: 'Update Grievance Status',
    selectStatus: 'Select New Status',
    resolutionNotesPlaceholder: 'Enter technical actions taken, components replaced, or groundskeeper inspection sign-off...',
    uploadResolutionProof: 'Upload Post-Repair Resolution Proof Photo',
    assignOfficerLabel: 'Assign Technical Officer / Crew',
    generateNoticeBtn: '📄 Generate Official Notice (Bilingual)',
    exportCsvBtn: 'Export CSV Report',
    resetDemoDataBtn: 'Reset Demo Data',
    officialNoticeModalTitle: 'Official University Administrative Notice',
    officialNoticeModalDesc: 'Auto-drafted formal bilingual correspondence on Assam State University letterhead.',
    copyNoticeBtn: 'Copy Notice to Clipboard',
    printNoticeBtn: 'Print / Save PDF',
    closeBtn: 'Close',
    saveChangesBtn: 'Save & Dispatch Updates',

    // Feedback
    citizenRatingHeading: 'Citizen Satisfaction Feedback',
    ratingThankYou: 'Thank you for verifying this resolution!'
  },

  as: {
    // Brand & Header
    appTitle: 'নাগৰিক দৃষ্টি (CivicSense)',
    appSubtitle: 'দ্বিভাষিক এআই স্মাৰ্ট চৌহদ সমস্যা সমাধান পৰ্টেল',
    tagline: 'বুদ্ধিমত্তাপূৰ্ণ অভিযোগ শ্ৰেণীবিভাজন আৰু ক্ষিপ্ৰ নিৰাময় ব্যৱস্থা',
    universityName: 'অসম ৰাজ্যিক বিশ্ববিদ্যালয় - প্ৰযুক্তিবিদ্যা চৌহদ',
    roleStudent: 'ছাত্ৰ-ছাত্ৰী / অভিযোগকাৰী প্ৰৱেশ',
    roleAdmin: 'প্ৰশাসনিক নিয়ন্ত্ৰণ কেন্দ্ৰ (Admin)',
    sosButton: 'জৰুৰীকালীন SOS হটলাইন',
    langToggle: 'English',
    notifications: 'জাননীসমূহ',

    // Hero & Stats
    campusHealthScore: 'চৌহদ পৰিচালনা সূচক',
    operational: 'কাৰ্য্যক্ষম',
    totalIssues: 'মুঠ দাখিলকৃত অভিযোগ',
    resolvedIssues: 'সমাধান আৰু প্ৰমাণিত',
    inProgressIssues: 'সক্ৰিয় কাৰ্যসূচী',
    avgResolutionTime: 'গড় সমাধান সময়',
    duplicatesPrevented: 'ৰাহি হোৱা অতিৰিক্ত শ্ৰম',
    criticalAlerts: 'জৰুৰীকালীন সতৰ্কবাৰ্তা',

    // Test Scenarios Bar
    testScenariosTitle: 'হেকেথন মূল্যায়নৰ পৰীক্ষামূলক দৃশ্যপট (৩ টা অসমীয়া + ৩ টা ইংৰাজী)',
    testScenariosSubtitle: 'এআই মাল্টিমডেল শ্ৰেণীবিভাজন, যৌগিক বিপদ চিনাক্তকৰণ আৰু আন্তঃভাষিক প্ৰতিলিপি চিনাক্তকৰণ পৰীক্ষা কৰক।',
    testBtn: 'এআই পৰীক্ষা চলাওক',
    loadIntoFormBtn: 'ফৰ্মত ভৰাওক',
    testedBadge: 'সক্ৰিয় দৃশ্যপট',

    // Submission Form
    reportIssueTab: 'নতুন অভিযোগ দাখিল',
    browseIssuesTab: 'চৌহদৰ অভিযোগ তালিকা',
    adminDashboardTab: 'প্ৰশাসনিক নিয়ন্ত্ৰণ ফলক',
    campusMapTab: 'চৌহদৰ মানচিত্ৰ',
    formHeading: 'চৌহদৰ সমস্যা অথবা অভাৱ-অভিযোগ দাখিল কৰক',
    formSubheading: 'অসমীয়া অথবা ইংৰাজীত লিখক। এআই ব্যৱস্থাই স্বয়ংক্ৰিয়ভাৱে শ্ৰেণীবিভাজন আৰু গুৰুত্ব নিৰ্ধাৰণ কৰিব।',
    issueTitleLabel: 'সমস্যাৰ চমু শিৰোনাম',
    issueTitlePlaceholder: 'যেনে: হোষ্টেল ৪-ৰ বাথৰুমত পানীৰ পাইপ ফাটি বিজুলীৰ চুইচৰ ওচৰলৈ গৈছে...',
    issueDescLabel: 'বিতং বিৱৰণ (স্থান আৰু বিপদৰ সম্ভাৱনা)',
    issueDescPlaceholder: 'সমস্যাৰ বিস্তাৰিত বিৱৰণ, সঠিক স্থান, ছাত্ৰ-ছাত্ৰীৰ অসুবিধা বা বিপদৰ আশংকা উল্লেখ কৰক...',
    zoneLabel: 'চৌহদৰ স্থান নিৰ্বাচন',
    selectZonePlaceholder: '-- চৌহদৰ নিৰ্দিষ্ট স্থান নিৰ্বাচন কৰক --',
    categoryLabel: 'বিভাগীয় শ্ৰেণী',
    autoCategoryOption: '✨ এআই-ক স্বয়ংক্ৰিয়ভাৱে নিৰ্বাচন কৰিবলৈ দিয়ক',
    photoUploadLabel: 'ফটো প্ৰমাণ সংলগ্ন কৰক (মাল্টিমডেল এআই পৰীক্ষণ)',
    photoUploadHint: 'ফটো ইয়াত পেলাওক। এআই ব্যৱস্থাই পানী, ক্ৰেক, লাইট আৰু আৱৰ্জনা চিনাক্ত কৰিব।',
    anonymousLabel: 'নাম গোপন ৰাখি দাখিল কৰক (Anonymous)',
    submitBtn: 'অভিযোগ এআই পৰীক্ষণলৈ দাখিল কৰক',
    submittingBtn: 'এআই পৰীক্ষণ চলি আছে...',
    aiPreCheckTitle: 'পোনপটীয়া এআই পূৰ্ব-সমীক্ষা (AI Pre-Check)',
    aiPreCheckHint: 'টাইপ কৰাৰ লগে লগে এআই শ্ৰেণী, অগ্ৰাধিকাৰ আৰু প্ৰতিলিপি নিৰ্ধাৰণ ইয়াত দেখা যাব।',
    detectedCategory: 'চিনাক্ত বিভাগীয় শ্ৰেণী',
    detectedPriority: 'অগ্ৰাধিকাৰ / জৰুৰীকালীন মাত্ৰা',
    assignedDept: 'দায়িত্বপ্ৰাপ্ত বিভাগ',
    estimatedSla: 'সমাধানৰ নিৰ্ধাৰিত সময়সীমা',
    virtualKeyboardTitle: 'অসমীয়া বৰ্ণ আৰু যুক্তাক্ষৰ সহায়ক (Assamese Character Palette)',

    // Duplicate Detection
    duplicateModalTitle: '⚠️ অনুৰূপ প্ৰতিলিপি অভিযোগ ধৰা পৰিছে!',
    duplicateModalDesc: 'আপুনি দাখিল কৰিব বিচৰা স্থান আৰু বিষয়ৰ সৈতে মিল থকা আন এটা সক্ৰিয় অভিযোগ ইতিমধ্যে পঞ্জীয়ন হৈ আছে।',
    similarityScore: 'সাদৃশ্যৰ মাত্ৰা (Similarity)',
    duplicateMatchedWith: 'পূৰ্বতে পঞ্জীয়ন হোৱা অভিযোগ',
    upvoteInsteadBtn: '👍 পূৰ্বৰ অভিযোগত সন্মতি দিয়ক (+১ Me Too)',
    submitAnywayBtn: 'তথাপিও নতুন অভিযোগ হিচাপে দাখিল কৰক',
    duplicateDetectedNotice: 'একেটা সমস্যা বাৰে বাৰে দাখিল কৰিলে কৰ্মচাৰীৰ সময় অপচয় হয়। সন্মতি জনালে অগ্ৰাধিকাৰ বৃদ্ধি পায়।',

    // Public Tracker & Filters
    trackerHeading: 'চৌহদৰ অভিযোগ নিষ্পত্তিৰ সামূহিক সূচী',
    searchPlaceholder: 'টিকট নম্বৰ (CS-2026-1001), স্থান বা শব্দৰে সন্ধান কৰক...',
    filterAll: 'সকলো অভিযোগ',
    filterCritical: '🚨 জৰুৰীকালীন অগ্ৰাধিকাৰ',
    filterHigh: 'উচ্চ অগ্ৰাধিকাৰ',
    filterInProgress: 'মেৰামতি চলি থকা',
    filterResolved: 'সমাধান সম্পন্ন',
    sortByRecent: 'শেহতীয়া অভিযোগ',
    sortByUrgency: 'উচ্চ অগ্ৰাধিকাৰ প্ৰথম',
    sortByUpvotes: 'সৰ্বাধিক সমৰ্থিত',
    noIssuesFound: 'নিৰ্বাচিত ফিল্টাৰৰ সৈতে কোনো অভিযোগ পোৱা নগ’ল।',

    // Issue Card & Detail
    ticketLabel: 'টিকট',
    viewDetailsBtn: 'দ্বিভাষিক সাৰাংশ আৰু স্থিতি চাওক',
    upvoteBtn: 'সন্মতি (+১)',
    anonymousUser: 'চৌহদৰ সদস্য',
    reportedOn: 'পঞ্জীয়নৰ তাৰিখ',
    timelineHeading: 'সমাধান প্ৰক্ৰিয়াৰ সময়সূচী (Timeline)',
    aiSummaryHeading: 'এআই-নিৰ্মিত দ্বিভাষিক সাৰাংশ (Bilingual Summary)',
    actionPlanHeading: 'পৰামৰ্শিত বিভাগীয় কাৰ্য্যসূচী',
    beforeAfterPhotos: 'পৰীক্ষণ আৰু সমাধানৰ প্ৰমাণস্বৰূপ ফটো',
    beforePhoto: 'অভিযোগৰ সময়ৰ ফটো',
    afterPhoto: 'সমাধানৰ পিছৰ ফটো',
    resolutionNotesLabel: 'কাৰিকৰী দলৰ প্ৰতিবেদন',

    // Statuses
    statusReported: 'নথিভুক্ত',
    statusTriaged: 'এআই পৰীক্ষিত',
    statusInvestigating: 'তদন্ত অব্যাহত',
    statusInProgress: 'কাম চলি আছে',
    statusAssigned: 'বিভাগলৈ প্ৰেৰিত',
    statusResolved: 'সমাধান আৰু প্ৰমাণিত',
    statusClosed: 'বন্ধ কৰা হ’ল',
    statusEscalated: 'উচ্চ কৰ্তৃপক্ষলৈ অগ্ৰেৰিত',

    // Priorities
    priorityCritical: 'জৰুৰীকালীন (২ ঘণ্টা SLA)',
    priorityHigh: 'উচ্চ (৬ ঘণ্টা SLA)',
    priorityMedium: 'মধ্যম (২৪ ঘণ্টা SLA)',
    priorityLow: 'নিম্ন (৪৮ ঘণ্টা SLA)',

    // Admin Dashboard
    adminHeading: 'চৌহদ আন্তঃগাঁথনি আৰু অভিযোগ নিয়ন্ত্ৰণ কক্ষ',
    adminSubheading: 'সক্ৰিয় কাৰ্যসূচী সমন্বয়, কৰ্মী প্ৰেৰণ, SLA তদাৰকী আৰু চৰকাৰী জাননী প্ৰেৰণ।',
    updateStatusModal: 'অভিযোগৰ স্থিতি সলনি কৰক',
    selectStatus: 'নতুন স্থিতি নিৰ্বাচন কৰক',
    resolutionNotesPlaceholder: 'গৃহীত কাৰিকৰী পদক্ষেপ, সলনি কৰা অংশ আৰু পৰিদৰ্শনৰ টোকা লিখক...',
    uploadResolutionProof: 'সমাধানৰ পিছৰ প্ৰমাণস্বৰূপ ফটো আপলোড কৰক',
    assignOfficerLabel: 'দায়িত্বপ্ৰাপ্ত কাৰিকৰী বিষয়া / দল',
    generateNoticeBtn: '📄 চৰকাৰী জাননী প্ৰস্তুত কৰক (Bilingual Notice)',
    exportCsvBtn: 'CSV প্ৰতিবেদন ডাউনলোড',
    resetDemoDataBtn: 'ডেমো তথ্য পুনৰ সংস্থাপন',
    officialNoticeModalTitle: 'বিশ্ববিদ্যালয় প্ৰশাসনৰ চৰকাৰী জাননী',
    officialNoticeModalDesc: 'অসম ৰাজ্যিক বিশ্ববিদ্যালয়ৰ লেটাৰহেডত স্বয়ংক্ৰিয়ভাৱে প্ৰস্তুত কৰা দ্বিভাষিক চৰকাৰী জাননী।',
    copyNoticeBtn: 'জাননী কপি কৰক',
    printNoticeBtn: 'প্ৰিণ্ট / সংৰক্ষণ কৰক',
    closeBtn: 'বন্ধ কৰক',
    saveChangesBtn: 'সংৰক্ষণ আৰু প্ৰেৰণ কৰক',

    // Feedback
    citizenRatingHeading: 'নাগৰিক সন্তুষ্টি আৰু মতামত',
    ratingThankYou: 'সমাধান সত্যাপন কৰাৰ বাবে ধন্যবাদ!'
  }
};
