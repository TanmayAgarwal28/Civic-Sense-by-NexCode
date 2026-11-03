export const INITIAL_SETTINGS = {
  aiAutoDispatch: true, // true = direct AI dispatch to worker; false = requires Admin approval
  campusName: {
    en: 'Assam State University - Tech Campus',
    as: 'অসম ৰাজ্যিক বিশ্ববিদ্যালয় - প্ৰযুক্তিবিদ্যা চৌহদ'
  },
  adminEmail: 'admin@example.invalid'
};

export const INITIAL_CATEGORIES = [
  { id: 'water', en: 'Water Supply & Plumbing', as: 'পানী যোগান আৰু প্লাম্বিং', defaultDept: 'Water Works & Sanitation' },
  { id: 'electricity', en: 'Electricity & Lighting', as: 'বিদ্যুৎ আৰু পোহৰ', defaultDept: 'Electrical Maintenance' },
  { id: 'infrastructure', en: 'Infrastructure & Roads', as: 'গাঁথনি আৰু পথ', defaultDept: 'Civil Infrastructure' },
  { id: 'it_network', en: 'IT & Campus Wi-Fi', as: 'তথ্য প্ৰযুক্তি আৰু ইণ্টাৰনেট', defaultDept: 'Computer & Network Center' },
  { id: 'sanitation', en: 'Sanitation & Waste', as: 'পৰিচ্ছন্নতা আৰু আৱৰ্জনা', defaultDept: 'Campus Hygiene & Sanitation' },
  { id: 'hostel', en: 'Hostel Facilities', as: 'হোষ্টেল সা-সুবিধা', defaultDept: 'Hostel Administration' },
  { id: 'security', en: 'Security & Safety', as: 'সুৰক্ষা আৰু নিৰাপত্তা', defaultDept: 'Campus Security Unit' },
  { id: 'cafeteria', en: 'Cafeteria & Food Hygiene', as: 'কেণ্টিন আৰু খাদ্য পৰিচ্ছন্নতা', defaultDept: 'Health & Canteen Committee' },
  { id: 'library', en: 'Library Services', as: 'গ্ৰন্থাগাৰ সেৱা', defaultDept: 'Central Library Administration' }
];

export const INITIAL_LOCATIONS = [
  { id: 'hostel_boys', en: 'Boys Hostels (Hostels 1-5)', as: 'ছাত্ৰাবাস (১-৫)', x: 18, y: 22 },
  { id: 'hostel_girls', en: 'Girls Hostels (Hostels 1-4)', as: 'ছাত্ৰীনিবাস (১-৪)', x: 18, y: 72 },
  { id: 'academic_block_a', en: 'Academic Block A (Engineering)', as: 'শৈক্ষিক ভৱন ক (অভিযান্ত্ৰিক)', x: 50, y: 25 },
  { id: 'academic_block_b', en: 'Academic Block B (Sciences)', as: 'শৈক্ষিক ভৱন খ (বিজ্ঞান)', x: 50, y: 70 },
  { id: 'central_library', en: 'Central Library & Digital Hub', as: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ আৰু ডিজিটেল হাব', x: 42, y: 48 },
  { id: 'admin_block', en: 'Administrative Block', as: 'প্ৰশাসনিক ভৱন', x: 78, y: 48 },
  { id: 'cafeteria_hub', en: 'Student Cafeteria & Food Court', as: 'ছাত্ৰ কেফেটেৰিয়া আৰু খাদ্য কেন্দ্ৰ', x: 65, y: 35 },
  { id: 'sports_complex', en: 'Indoor Sports & Gymnasium', as: 'ক্ৰীড়া প্ৰাংগন আৰু ব্যায়ামাগাৰ', x: 78, y: 80 },
  { id: 'campus_pathways', en: 'Main Campus Roads & Walkways', as: 'মুখ্য চৌহদৰ পথ আৰু ফুটপাথ', x: 48, y: 90 }
];

// Pre-admission official university roll roster
// Students must match Roll No + Full Name to create their account!
export const INITIAL_STUDENT_ROSTER = [
  { rollNo: 'ASU2026-101', name: 'Demo Student One', department: 'Computer Science', phone: '0000000000', isClaimed: true },
  { rollNo: 'ASU2026-102', name: 'Demo Student Two', department: 'Physics & Astronomy', phone: '0000000000', isClaimed: true },
  { rollNo: 'ASU2026-103', name: 'Demo Student Three', department: 'Mechanical Engg', phone: '0000000000', isClaimed: true },
  { rollNo: 'ASU2026-104', name: 'Demo Student Four', department: 'Electrical Engg', phone: '0000000000', isClaimed: true },
  { rollNo: 'ASU2026-105', name: 'Demo Student Five', department: 'Humanities & Arts', phone: '0000000000', isClaimed: true },
  { rollNo: 'ASU2026-106', name: 'Demo Applicant', department: 'Civil Engg', phone: '0000000000', isClaimed: false },
  { rollNo: 'ASU2026-107', name: 'Demo Student Seven', department: 'Chemical Sciences', phone: '0000000000', isClaimed: false },
  { rollNo: 'ASU2026-108', name: 'Demo Student Eight', department: 'Biotechnology', phone: '0000000000', isClaimed: false },
  { rollNo: 'ASU2026-109', name: 'Demo Student Nine', department: 'Computer Science', phone: '0000000000', isClaimed: false },
  { rollNo: 'ASU2026-110', name: 'Demo Student Ten', department: 'Mathematics', phone: '0000000000', isClaimed: false }
];

export const INITIAL_USERS = [
  // 1. Admin Profile (Master Administrator Profile)
  {
    id: 'usr_admin_01',
    username: 'CampusAdminX1',
    password: 'CivicSecure#2026',
    name: 'Chief Campus Administrator',
    role: 'admin',
    email: 'admin@example.invalid',
    phone: '0000000000',
    isActive: true,
    createdAt: new Date().toISOString()
  },

  // 2. Worker Profiles (Created only by Admin)
  {
    id: 'usr_wrk_01',
    username: 'WRK-ELEC01',
    password: 'worker@123',
    name: 'Demo Electrician',
    role: 'worker',
    department: 'Electrical Maintenance',
    email: 'electrician@example.invalid',
    phone: '0000000000',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_wrk_02',
    username: 'WRK-PLUMB01',
    password: 'worker@123',
    name: 'Demo Plumber',
    role: 'worker',
    department: 'Water Works & Sanitation',
    email: 'plumber@example.invalid',
    phone: '0000000000',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_wrk_03',
    username: 'WRK-NET01',
    password: 'worker@123',
    name: 'Demo Network Technician',
    role: 'worker',
    department: 'Computer & Network Center',
    email: 'network@example.invalid',
    phone: '0000000000',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_wrk_04',
    username: 'WRK-SEC01',
    password: 'worker@123',
    name: 'Demo Security Inspector',
    role: 'worker',
    department: 'Campus Security Unit',
    email: 'security@example.invalid',
    phone: '0000000000',
    isActive: true,
    createdAt: new Date().toISOString()
  },

  // 3. Student Profiles (Pre-claimed accounts)
  {
    id: 'usr_stu_01',
    username: 'ASU2026-101',
    rollNo: 'ASU2026-101',
    password: 'student@123',
    name: 'Demo Student One',
    role: 'student',
    department: 'Computer Science',
    email: 'student1@example.invalid',
    phone: '0000000000',
    isActive: true, // Can be toggled on/off by Admin
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_stu_02',
    username: 'ASU2026-102',
    rollNo: 'ASU2026-102',
    password: 'student@123',
    name: 'Demo Student Two',
    role: 'student',
    department: 'Physics & Astronomy',
    email: 'student2@example.invalid',
    phone: '0000000000',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_stu_03',
    username: 'ASU2026-103',
    rollNo: 'ASU2026-103',
    password: 'student@123',
    name: 'Demo Student Three',
    role: 'student',
    department: 'Mechanical Engg',
    email: 'student3@example.invalid',
    phone: '0000000000',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_stu_04',
    username: 'ASU2026-104',
    rollNo: 'ASU2026-104',
    password: 'student@123',
    name: 'Demo Student Four',
    role: 'student',
    department: 'Electrical Engg',
    email: 'student4@example.invalid',
    phone: '0000000000',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_ISSUES = [
  {
    id: 'iss_seed_01',
    ticketId: 'CS-2026-1001',
    title: 'Water pipe leakage and dampness near electric switchboard in Hostel 4',
    titleEn: 'Water pipe leakage and dampness near electric switchboard in Hostel 4',
    titleAs: 'হোষ্টেল ৪-ৰ ৩য় মহলাত পানীৰ পাইপ ফাটিছে আৰু চুইচবৰ্ডত পানী পৰিছে',
    description: 'Severe water leak from the 2nd floor bathroom pipe leaking into electrical fixtures. High risk of electrical short circuit and fire.',
    descriptionEn: 'Severe water leak from the 2nd floor bathroom pipe leaking into electrical fixtures. High risk of electrical short circuit and fire.',
    descriptionAs: 'হোষ্টেল ৪-ৰ বাথৰুমৰ পাইপ ফাটি পানী বিজুলীৰ চুইচবৰ্ডৰ কাষলৈ বৈ গৈছে। যিকোনো মুহূৰ্তত শ্বৰ্ট চাৰ্কিট আৰু অগ্নিসংযোগৰ আশংকা।',
    address: 'Boys Hostel 4, 2nd Floor, Corridor near Room 204',
    location: 'Boys Hostels (Hostels 1-5)',
    zoneId: 'hostel_boys',
    category: 'water',
    categoryName: 'Water Supply & Plumbing',
    department: 'Water Works & Sanitation',
    priority: 'critical',
    urgencyScore: 92,
    status: 'in_progress',
    slaHours: 2,
    slaDeadline: new Date(Date.now() + 1.5 * 3600 * 1000).toISOString(),
    reporterId: 'usr_stu_01',
    reporterName: 'Demo Student One',
    reporterRoll: 'ASU2026-101',
    assignedWorkerId: 'usr_wrk_02',
    assignedWorkerName: 'Demo Plumber (WRK-PLUMB01)',
    upvotes: 6,
    language: 'en',
    originalLanguage: 'en',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 't_seed_01_1',
        status: 'reported',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        noteEn: 'Grievance lodged and prioritized by AI triage.',
        noteAs: 'এআই তদাৰকীৰ দ্বাৰা অভিযোগ নথিভুক্ত আৰু অগ্ৰাধিকাৰ নিৰ্ধাৰণ কৰা হ’ল।'
      },
      {
        id: 't_seed_01_2',
        status: 'in_progress',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        noteEn: 'Assigned to plumbing crew WRK-PLUMB01 for emergency isolation.',
        noteAs: 'জৰুৰীকালীন মেৰামতিৰ বাবে প্লাম্বাৰ দলক দায়িত্ব প্ৰদান কৰা হৈছে।'
      }
    ]
  },
  {
    id: 'iss_seed_02',
    ticketId: 'CS-2026-1002',
    title: 'প্ৰধান শৈক্ষিক ভৱনৰ লেব ২০৪-ৰ বাহিৰত চুইচবৰ্ডত ফিৰিঙতি ওলাইছে',
    titleEn: 'Electric switchboard sparking and smoke outside Lab 204 in Academic Complex',
    titleAs: 'প্ৰধান শৈক্ষিক ভৱনৰ লেব ২০৪-ৰ বাহিৰত চুইচবৰ্ডত ফিৰিঙতি ওলাইছে',
    description: 'কম্পিউটাৰ বিজ্ঞান লেব ২০৪-ৰ বাহিৰৰ চুইচবৰ্ডৰ পৰা ফিৰিঙতি ওলাইছে আৰু প্লাষ্টিক জ্বলা গোন্ধ ওলাইছে। অতি বিপজ্জনক অৱস্থা।',
    descriptionEn: 'Electric sparking and burning plastic odor from corridor switchboard outside CS Lab 204. Extremely hazardous electrical condition.',
    descriptionAs: 'কম্পিউটাৰ বিজ্ঞান লেব ২০৪-ৰ বাহিৰৰ চুইচবৰ্ডৰ পৰা ফিৰিঙতি ওলাইছে আৰু প্লাষ্টিক জ্বলা গোন্ধ ওলাইছে। অতি বিপজ্জনক অৱস্থা।',
    address: 'Academic Block A, 2nd Floor, Outside CS Lab 204',
    location: 'Academic Block A (Engineering)',
    zoneId: 'academic_block_a',
    category: 'electricity',
    categoryName: 'Electricity & Lighting',
    department: 'Electrical Maintenance',
    priority: 'critical',
    urgencyScore: 96,
    status: 'reported',
    slaHours: 2,
    slaDeadline: new Date(Date.now() + 1.8 * 3600 * 1000).toISOString(),
    reporterId: 'usr_stu_02',
    reporterName: 'Demo Student Two',
    reporterRoll: 'ASU2026-102',
    assignedWorkerId: 'usr_wrk_01',
    assignedWorkerName: 'Demo Electrician (WRK-ELEC01)',
    upvotes: 9,
    language: 'as',
    originalLanguage: 'as',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 't_seed_02_1',
        status: 'reported',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        noteEn: 'Reported with critical urgency via bilingual Assamese voice/text portal.',
        noteAs: 'দ্বিভাষিক পৰ্টেলৰ জৰিয়তে জৰুৰীকালীন অভিযোগ নথিভুক্ত কৰা হ’ল।'
      }
    ]
  },
  {
    id: 'iss_seed_03',
    ticketId: 'CS-2026-1003',
    title: 'Central Library 3rd floor digital reference Wi-Fi router reboot required',
    titleEn: 'Central Library 3rd floor digital reference Wi-Fi router reboot required',
    titleAs: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰৰ ৩য় মহলাৰ ডিজিটেল ৰেফাৰেন্স ৱাই-ফাই ৰাউটাৰ বিকল',
    description: 'Students unable to access university e-journals and academic database due to router packet drops on 3rd floor.',
    descriptionEn: 'Students unable to access university e-journals and academic database due to router packet drops on 3rd floor.',
    descriptionAs: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰৰ ৩য় মহলাত ৱাই-ফাই বিচ্ছিন্ন হৈ পৰাৰ বাবে ছাত্ৰ-ছাত্ৰীসকলে ই-জাৰ্নেল আৰু গৱেষণা তথ্যকোষ প্ৰৱেশ কৰিব পৰা নাই।',
    address: 'Central Library, 3rd Floor Digital Reference Section',
    location: 'Central Library & Digital Hub',
    zoneId: 'central_library',
    category: 'it_network',
    categoryName: 'IT & Campus Wi-Fi',
    department: 'Computer & Network Center',
    priority: 'medium',
    urgencyScore: 55,
    status: 'in_progress',
    slaHours: 24,
    slaDeadline: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
    reporterId: 'usr_stu_03',
    reporterName: 'Demo Student Three',
    reporterRoll: 'ASU2026-103',
    assignedWorkerId: 'usr_wrk_03',
    assignedWorkerName: 'Demo Network Technician (WRK-NET01)',
    upvotes: 4,
    language: 'en',
    originalLanguage: 'en',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 't_seed_03_1',
        status: 'reported',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        noteEn: 'Logged by library study group.',
        noteAs: 'গ্ৰন্থাগাৰ অধ্যয়ন দলে অভিযোগ দাখিল কৰিছে।'
      }
    ]
  },
  {
    id: 'iss_seed_04',
    ticketId: 'CS-2026-1004',
    title: 'কেণ্টিনৰ বাটৰ নলাৰ ঢাকনি ভাঙি বিপজ্জনক গাঁত হৈছে',
    titleEn: 'Damaged drain slab causing hazardous pit on pathway near cafeteria',
    titleAs: 'কেণ্টিনৰ বাটৰ নলাৰ ঢাকনি ভাঙি বিপজ্জনক গাঁত হৈছে',
    description: 'ছাত্ৰ কেফেটেৰিয়াৰ সন্মুখৰ পথত কংক্ৰিটৰ নলাৰ ঢাকনি ভাঙি আছে। সন্ধিয়া পোহৰ কম থাকিলে ছাত্ৰ-ছাত্ৰী পিছলি পৰাৰ আশংকা।',
    descriptionEn: 'Broken concrete drain cover on the pathway in front of student cafeteria. Risk of severe fall and injury at night.',
    descriptionAs: 'ছাত্ৰ কেফেটেৰিয়াৰ সন্মুখৰ পথত কংক্ৰিটৰ নলাৰ ঢাকনি ভাঙি আছে। সন্ধিয়া পোহৰ কম থাকিলে ছাত্ৰ-ছাত্ৰী পিছলি পৰাৰ আশংকা।',
    address: 'Pathway between Student Cafeteria and Sports Complex',
    location: 'Main Campus Roads & Walkways',
    zoneId: 'campus_pathways',
    category: 'infrastructure',
    categoryName: 'Infrastructure & Roads',
    department: 'Civil Infrastructure',
    priority: 'high',
    urgencyScore: 78,
    status: 'reported',
    slaHours: 6,
    slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    reporterId: 'usr_stu_04',
    reporterName: 'Demo Student Four',
    reporterRoll: 'ASU2026-104',
    upvotes: 3,
    language: 'as',
    originalLanguage: 'as',
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 't_seed_04_1',
        status: 'reported',
        timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
        noteEn: 'Hazard flagged for campus civil engineering team.',
        noteAs: 'চৌহদৰ নিৰ্মাণ বিভাগলৈ তথ্য প্ৰেৰণ কৰা হৈছে।'
      }
    ]
  },
  {
    id: 'iss_seed_05',
    ticketId: 'CS-2026-1005',
    title: 'Leaking RO drinking water cooler tap replaced in Girls Hostel 2',
    titleEn: 'Leaking RO drinking water cooler tap replaced in Girls Hostel 2',
    titleAs: 'ছাত্ৰীনিবাস ২-ৰ খোৱা পানীৰ আৰ’ ফিল্টাৰৰ পানী ওলোৱা টেপ সলনি কৰা হ’ল',
    description: 'Continuous dripping from the main cold water tap caused water stagnation in the dining entrance.',
    descriptionEn: 'Continuous dripping from the main cold water tap caused water stagnation in the dining entrance.',
    descriptionAs: 'মূল খোৱা পানীৰ টেপৰ পৰা নিৰন্তৰ পানী নিগৰি ডাইনিং হলৰ প্ৰৱেশদ্বাৰত পানী জমা হৈ আছিল।',
    address: 'Girls Hostel 2, 1st Floor Dining Hall Entrance',
    location: 'Girls Hostels (Hostels 1-4)',
    zoneId: 'hostel_girls',
    category: 'water',
    categoryName: 'Water Supply & Plumbing',
    department: 'Water Works & Sanitation',
    priority: 'low',
    urgencyScore: 35,
    status: 'resolved',
    slaHours: 48,
    slaDeadline: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Replaced damaged silicone seal and 0.5-inch tap cartridge. Tested with full tank pressure. Fully operational and verified clean.',
    reporterId: 'usr_stu_01',
    reporterName: 'Demo Student One',
    reporterRoll: 'ASU2026-101',
    assignedWorkerId: 'usr_wrk_02',
    assignedWorkerName: 'Demo Plumber (WRK-PLUMB01)',
    upvotes: 5,
    language: 'en',
    originalLanguage: 'en',
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 't_seed_05_1',
        status: 'reported',
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        noteEn: 'Maintenance request logged.',
        noteAs: 'ৰক্ষণাবেক্ষণৰ আবেদন পঞ্জীয়ন হ’ল।'
      },
      {
        id: 't_seed_05_2',
        status: 'resolved',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        noteEn: 'Repair certified by plumbing supervisor with photo proof.',
        noteAs: 'প্লাম্বাৰ অধীক্ষকৰ দ্বাৰা মেৰামতি পৰীক্ষা আৰু সমাপ্ত ঘোষণা কৰা হ’ল।'
      }
    ]
  }
];

export const INITIAL_SEED_ISSUES = INITIAL_ISSUES;
