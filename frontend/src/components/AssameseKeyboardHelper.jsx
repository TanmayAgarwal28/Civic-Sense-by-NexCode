import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Keyboard, Sparkles } from 'lucide-react';

export function AssameseKeyboardHelper({ onInsertChar, onInsertPhrase }) {
  const { lang } = useLanguage();

  const vowels = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'এ', 'ঐ', 'ও', 'ঔ'];
  const consonants = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'ৰ', 'ল', 'ৱ', 'শ', 'ষ', 'স', 'হ', 'ক্ষ', 'জ্ঞ', 'ৎ', 'ং', 'ঃ', 'ঁ'];
  const campusPhrases = [
    { label: 'হোষ্টেল ৪', text: 'হোষ্টেল ৪' },
    { label: 'বাথৰুমত পানী', text: 'বাথৰুমত পানীৰ পাইপ ফাটিছে' },
    { label: 'বিজুলীৰ ছুইটচ', text: 'বিজুলীৰ ছুইটচৰ ওচৰলৈ গৈছে' },
    { label: 'ৱাই-ফাই বিকল', text: 'ৱাই-ফাই (Wi-Fi) সংযোগ কাম কৰা নাই' },
    { label: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ', text: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰৰ ডিজিটেল ৰিডিং ৰুম' },
    { label: 'পথত ডাঙৰ গাঁত', text: 'পথত এটা ডাঙৰ গাঁত সৃষ্টি হৈছে' },
    { label: 'অতি সোনকালে', text: 'অতি সোনকালে সমাধান কৰক' },
    { label: 'শ্বৰ্ট চাৰ্কিটৰ ভয়', text: 'শ্বৰ্ট চাৰ্কিট হোৱাৰ সম্ভাৱনা আছে' }
  ];

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 my-3 shadow-sm">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/60">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
          <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'as' ? 'অসমীয়া বৰ্ণ আৰু শব্দ সহায়ক' : 'Assamese Virtual Character Palette'}</span>
        </div>
        <span className="text-[10px] text-slate-400">
          {lang === 'as' ? 'যিকোনো আখৰ বা বাক্যাংশত ক্লিক কৰক' : 'Click any character or phrase to insert at cursor'}
        </span>
      </div>

      {/* Quick Campus Phrases */}
      <div className="mb-2.5">
        <div className="text-[10px] font-semibold text-slate-400 mb-1">
          {lang === 'as' ? 'চৌহদৰ নিয়মীয়া শব্দমালা:' : 'Quick Campus Phrases:'}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {campusPhrases.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsertPhrase(item.text)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-200 border border-slate-600/80 transition-all font-assamese"
            >
              + {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Special Assamese Distinctive Characters */}
      <div className="mb-2">
        <div className="text-[10px] font-semibold text-slate-400 mb-1 flex items-center space-x-1">
          <span>{lang === 'as' ? 'অসমীয়া বিশেষ বৰ্ণমালা (ৰ, ৱ, ক্ষ, জ্ঞ):' : 'Distinctive Assamese Characters (Ra, Wa, Ksa, Gya):'}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {['ৰ', 'ৱ', 'ক্ষ', 'জ্ঞ', 'ষ্ট', 'ম্প', 'ন্ধ', 'ণ্ড', 'ক্ত', 'ষ্ঠ', 'স্থ'].map((char, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsertChar(char)}
              className="w-7 h-7 flex items-center justify-center rounded bg-emerald-950/70 hover:bg-emerald-600 hover:text-white text-emerald-300 font-bold text-xs border border-emerald-700/60 transition-all font-assamese"
              title={`Insert Assamese ${char}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Vowels & Consonants Toggle */}
      <details className="text-[11px] text-slate-400">
        <summary className="cursor-pointer hover:text-emerald-400 font-medium">
          {lang === 'as' ? 'সকলো স্বৰবৰ্ণ আৰু ব্যঞ্জনবৰ্ণ খোলক...' : 'Expand Full Alphabet Palette...'}
        </summary>
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex flex-wrap gap-1">
          {vowels.concat(consonants).map((char, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsertChar(char)}
              className="w-6 h-6 flex items-center justify-center rounded bg-slate-700/70 hover:bg-slate-600 text-slate-200 text-xs font-assamese"
            >
              {char}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
