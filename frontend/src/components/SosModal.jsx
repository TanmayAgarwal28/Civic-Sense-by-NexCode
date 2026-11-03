import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { PhoneCall, ShieldAlert, Zap, Flame, HeartPulse, X } from 'lucide-react';

export function SosModal({ isOpen, onClose }) {
  const { lang, t } = useLanguage();

  if (!isOpen) return null;

  const hotlines = [
    {
      icon: ShieldAlert,
      color: 'bg-rose-500 text-white',
      titleEn: 'Campus Security Main Gate Control Room',
      titleAs: 'মুখ্য গেট চৌহদ নিৰাপত্তা নিয়ন্ত্ৰণ কক্ষ',
      phone: '+91 94350-12345 / Extn: 100',
      timingEn: '24x7 Immediate Patrol Dispatch',
      timingAs: '২৪x৭ তাৎক্ষণিক টহল দল'
    },
    {
      icon: Zap,
      color: 'bg-amber-500 text-white',
      titleEn: 'Electrical Hazard & Substation Breakdown',
      titleAs: 'বিদ্যুৎ সংকট আৰু ছাবষ্টেচন জৰুৰীকালীন দল',
      phone: '+91 94350-54321 / Extn: 112',
      timingEn: 'Instant MCB Cutoff Response',
      timingAs: 'তাৎক্ষণিক বিদ্যুৎ সংযোগ বিছিন্নকৰণ'
    },
    {
      icon: HeartPulse,
      color: 'bg-emerald-600 text-white',
      titleEn: 'University Health Centre & Ambulance',
      titleAs: 'বিশ্ববিদ্যালয় স্বাস্থ্য কেন্দ্ৰ আৰু এম্বুলেন্স',
      phone: '+91 94350-99999 / Extn: 108',
      timingEn: 'Emergency Medical Officer on Duty',
      timingAs: 'জৰুৰীকালীন কৰ্তব্যৰত চিকিৎসা বিষয়া'
    },
    {
      icon: Flame,
      color: 'bg-red-600 text-white',
      titleEn: 'Campus Fire Safety & Chemical Spill Cell',
      titleAs: 'অগ্নিনিৰ্বাপক আৰু ৰাসায়নিক দুৰ্ঘটনা শাখা',
      phone: '+91 94350-10101 / Extn: 101',
      timingEn: 'Rapid Response Unit',
      timingAs: 'ক্ষিপ্ৰ সহাৰি শাখা'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-rose-400">
            <PhoneCall className="w-5 h-5 animate-pulse" />
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              {lang === 'as' ? 'চৌহদৰ জৰুৰীকালীন SOS হটলাইন' : 'Campus 24x7 Emergency SOS Directory'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-2 mb-4">
          {lang === 'as'
            ? 'শ্বৰ্ট চাৰ্কিট, চিকিৎসা প্ৰয়োজনীয়তা অথবা সুৰক্ষা সংকটৰ ক্ষেত্ৰত তৎক্ষণাৎ যোগাযোগ কৰক।'
            : 'For life-threatening hazards, electric sparks, sudden fires, or medical emergencies, call the campus duty officer immediately.'}
        </p>

        {/* Hotlines List */}
        <div className="space-y-3">
          {hotlines.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl flex items-center justify-between hover:border-slate-600 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${h.color} shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight font-assamese">
                      {lang === 'as' ? h.titleAs : h.titleEn}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      ● {lang === 'as' ? h.timingAs : h.timingEn}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${h.phone.split('/')[0].trim()}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center space-x-1 shadow-sm whitespace-nowrap"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{lang === 'as' ? 'কল কৰক' : 'Call Now'}</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            {t('closeBtn')}
          </button>
        </div>

      </div>
    </div>
  );
}
