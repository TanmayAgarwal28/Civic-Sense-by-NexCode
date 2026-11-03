export const FALLBACK_ISSUES = [];

export const FALLBACK_CATEGORIES = [
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

export const FALLBACK_LOCATIONS = [
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

export const FALLBACK_USERS = {
  students: [
    { id: 'usr_stu_01', rollNo: 'ASU2026-101', name: 'Demo Student One', department: 'Computer Science', phone: '0000000000', isActive: true },
    { id: 'usr_stu_02', rollNo: 'ASU2026-102', name: 'Demo Student Two', department: 'Physics & Astronomy', phone: '0000000000', isActive: true },
    { id: 'usr_stu_03', rollNo: 'ASU2026-103', name: 'Demo Student Three', department: 'Mechanical Engg', phone: '0000000000', isActive: true },
    { id: 'usr_stu_04', rollNo: 'ASU2026-104', name: 'Demo Student Four', department: 'Electrical Engg', phone: '0000000000', isActive: true }
  ],
  workers: [
    { id: 'usr_wrk_01', username: 'WRK-ELEC01', name: 'Demo Electrician', department: 'Electrical Maintenance', phone: '0000000000' },
    { id: 'usr_wrk_02', username: 'WRK-PLUMB01', name: 'Demo Plumber', department: 'Water Works & Sanitation', phone: '0000000000' },
    { id: 'usr_wrk_03', username: 'WRK-NET01', name: 'Demo Network Technician', department: 'Computer & Network Center', phone: '0000000000' },
    { id: 'usr_wrk_04', username: 'WRK-SEC01', name: 'Demo Security Inspector', department: 'Campus Security Unit', phone: '0000000000' }
  ],
  roster: [
    { rollNo: 'ASU2026-101', name: 'Demo Student One', department: 'Computer Science', phone: '0000000000', isClaimed: true },
    { rollNo: 'ASU2026-102', name: 'Demo Student Two', department: 'Physics & Astronomy', phone: '0000000000', isClaimed: true },
    { rollNo: 'ASU2026-106', name: 'Demo Applicant', department: 'Civil Engg', phone: '0000000000', isClaimed: false },
    { rollNo: 'ASU2026-107', name: 'Demo Student Seven', department: 'Chemical Sciences', phone: '0000000000', isClaimed: false }
  ]
};

export const FALLBACK_ANALYTICS = {
  summary: {
    total: 0,
    resolved: 0,
    inProgress: 0,
    investigating: 0,
    reported: 0,
    critical: 0,
    high: 0,
    resolutionRate: 100,
    slaComplianceRate: 100,
    avgResolutionHours: 0,
    duplicatesPrevented: 0
  }
};
