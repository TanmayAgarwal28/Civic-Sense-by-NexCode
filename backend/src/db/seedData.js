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

export const INITIAL_ISSUES = [];

export const INITIAL_SEED_ISSUES = INITIAL_ISSUES;
