import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  AUTH_TOKEN_SECRET: process.env.AUTH_TOKEN_SECRET || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  DATA_DIR: path.join(__dirname, '../data'),
  UPLOADS_DIR: path.join(__dirname, '../uploads'),
  CAMPUS_NAME: {
    en: 'Assam State University - Tech Campus',
    as: 'অসম ৰাজ্যিক বিশ্ববিদ্যালয় - প্ৰযুক্তিবিদ্যা চৌহদ'
  },
  CATEGORIES: [
    { id: 'water', en: 'Water Supply & Plumbing', as: 'পানী যোগান আৰু প্লাম্বিং', defaultDept: 'Water Works & Sanitation' },
    { id: 'electricity', en: 'Electricity & Lighting', as: 'বিদ্যুৎ আৰু পোহৰ', defaultDept: 'Electrical Maintenance' },
    { id: 'infrastructure', en: 'Infrastructure & Roads', as: 'গাঁথনি আৰু পথ', defaultDept: 'Civil Infrastructure' },
    { id: 'it_network', en: 'IT & Campus Wi-Fi', as: 'তথ্য প্ৰযুক্তি আৰু ইণ্টাৰনেট', defaultDept: 'Computer & Network Center' },
    { id: 'sanitation', en: 'Sanitation & Waste', as: 'পৰিচ্ছন্নতা আৰু আৱৰ্জনা', defaultDept: 'Campus Hygiene & Sanitation' },
    { id: 'hostel', en: 'Hostel Facilities', as: 'হোষ্টেল সা-সুবিধা', defaultDept: 'Hostel Administration' },
    { id: 'security', en: 'Security & Safety', as: 'সুৰক্ষা আৰু নিৰাপত্তা', defaultDept: 'Campus Security Unit' },
    { id: 'cafeteria', en: 'Cafeteria & Food Hygiene', as: 'কেণ্টিন আৰু খাদ্য পৰিচ্ছন্নতা', defaultDept: 'Health & Canteen Committee' },
    { id: 'library', en: 'Library Services', as: 'গ্ৰন্থাগাৰ সেৱা', defaultDept: 'Central Library Administration' }
  ],
  ZONES: [
    { id: 'hostel_boys', en: 'Boys Hostels (1-5)', as: 'ছাত্ৰাবাস (১-৫)' },
    { id: 'hostel_girls', en: 'Girls Hostels (1-4)', as: 'ছাত্ৰীনিবাস (১-৪)' },
    { id: 'academic_block_a', en: 'Academic Block A (Engineering)', as: 'শৈক্ষিক ভৱন ক (অভিযান্ত্ৰিক)' },
    { id: 'academic_block_b', en: 'Academic Block B (Sciences)', as: 'শৈক্ষিক ভৱন খ (বিজ্ঞান)' },
    { id: 'central_library', en: 'Central Library & Digital Hub', as: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ আৰু ডিজিটেল হাব' },
    { id: 'admin_block', en: 'Administrative Block', as: 'প্ৰশাসনিক ভৱন' },
    { id: 'cafeteria_hub', en: 'Student Cafeteria & Food Court', as: 'ছাত্ৰ কেফেটেৰিয়া আৰু খাদ্য কেন্দ্ৰ' },
    { id: 'sports_complex', en: 'Indoor Sports & Gymnasium', as: 'ক্ৰীড়া প্ৰাংগন আৰু ব্যায়ামাগাৰ' },
    { id: 'campus_pathways', en: 'Main Campus Roads & Walkways', as: 'মুখ্য চৌহদৰ পথ আৰু ফুটপাথ' }
  ],
  SLA_HOURS: {
    critical: 2,
    high: 6,
    medium: 24,
    low: 48
  }
};
