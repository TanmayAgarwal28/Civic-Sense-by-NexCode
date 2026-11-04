import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Activity, CheckCircle2, Clock, Wrench, ShieldAlert, Users, Sparkles } from 'lucide-react';

export function HeroBanner({ stats = {} }) {
  const { lang, t } = useLanguage();

  const liveSla = typeof stats.slaComplianceRate === 'number'
    ? stats.slaComplianceRate
    : (stats.total > 0 ? Math.round(((stats.resolved || 0) / stats.total) * 100) : 100);
  const healthOffset = 138 * (1 - Math.min(100, Math.max(0, liveSla)) / 100);

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-6 pb-8 border-b border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header & Mission */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-7">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 text-xs font-bold tracking-wider uppercase mb-2.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{lang === 'as' ? 'প্ৰত্যক্ষ চৌহদ তদাৰকী সক্ৰিয়' : 'Live Campus Redressal Engine Active'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {lang === 'as' ? 'এআই স্মাৰ্ট চৌহদ সমস্যা সমাধান ব্যৱস্থা' : 'AI Smart Campus Issue Management'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {lang === 'as'
                ? 'চৌহদৰ সমস্যা দাখিল, দ্বিভাষিক এআই শ্ৰেণীবিভাজন, অসমীয়া আৰু ইংৰাজী কণ্ঠস্বৰ অভিযোগ, প্ৰতিলিপি চিনাক্তকৰণ আৰু ক্ষিপ্ৰ সমাধান।'
                : 'Report and track university grievances. AI automatically interprets complaints, supports voice notes in English & Assamese, flags hazards, and dispatches crews.'}
            </p>
          </div>

          {/* Campus Health Meter */}
          <div className="glass-dark p-4 rounded-3xl flex items-center space-x-4 shadow-xl border border-slate-700/80 self-start lg:self-auto hover:border-slate-600 transition-all duration-300">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" className="text-slate-800" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="26" 
                  stroke="currentColor" 
                  strokeWidth="5" 
                  className={liveSla >= 85 ? "text-emerald-500" : liveSla >= 60 ? "text-amber-500" : "text-rose-500"} 
                  strokeDasharray={163} 
                  strokeDashoffset={163 * (1 - Math.min(100, Math.max(0, liveSla)) / 100)} 
                  strokeLinecap="round" 
                  fill="transparent" 
                />
              </svg>
              <span className={`absolute text-sm font-black ${liveSla >= 85 ? 'text-emerald-400' : liveSla >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {liveSla}%
              </span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('campusHealthScore')}</div>
              <div className="text-sm font-extrabold text-white flex items-center space-x-1.5 mt-0.5">
                <span>{liveSla >= 75 ? t('operational') : (lang === 'as' ? 'তদাৰকী প্ৰয়োজন' : 'Attention Needed')}</span>
                <span className={`w-2 h-2 rounded-full ${liveSla >= 85 ? 'bg-emerald-400 animate-pulse' : liveSla >= 60 ? 'bg-amber-400' : 'bg-rose-400 animate-ping'}`}></span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {t('slaTargetLabel') || 'SLA Target'}: <span className="font-bold text-white font-mono">{liveSla}%</span> {t('slaOnTarget') || 'compliance'}
              </div>
            </div>
          </div>
        </div>

        {/* Live KPI Grid - Ultra-Responsive and Tactile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="glass-dark rounded-2xl p-3.5 border border-indigo-500/30 card-hover shadow-lg shadow-indigo-950/20 group">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('totalIssues')}</span>
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-mono">{stats.total ?? 0}</div>
            <div className="text-[10px] text-indigo-300 font-medium mt-1 truncate">{lang === 'as' ? 'মুঠ পঞ্জীকৃত অভিযোগ' : 'All Registered Incidents'}</div>
          </div>

          <div className="glass-dark rounded-2xl p-3.5 border border-amber-500/30 card-hover shadow-lg shadow-amber-950/20 group">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('inProgressIssues')}</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">{stats.inProgress ?? 0}</div>
            <div className="text-[10px] text-amber-300 font-medium mt-1 truncate">{lang === 'as' ? 'মেৰামতি চলি থকা' : 'Crew Actively Deployed'}</div>
          </div>

          <div className="glass-dark rounded-2xl p-3.5 border border-emerald-500/30 card-hover shadow-lg shadow-emerald-950/20 group">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('resolvedIssues')}</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{stats.resolved ?? 0}</div>
            <div className="text-[10px] text-emerald-300 font-medium mt-1 truncate">{lang === 'as' ? 'যাচাই আৰু সমাধান' : 'Verified & Resolved'}</div>
          </div>

          <div className="glass-dark rounded-2xl p-3.5 border border-rose-500/40 card-hover shadow-lg shadow-rose-950/20 group">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('criticalAlerts')}</span>
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-4 h-4 animate-bounce" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-400 font-mono">{stats.critical ?? 0}</div>
            <div className="text-[10px] text-rose-300 font-medium mt-1 truncate">{lang === 'as' ? 'তাত্ক্ষণিক ২ ঘণ্টা SLA' : 'Critical Hazard SLA'}</div>
          </div>

          <div className="glass-dark rounded-2xl p-3.5 border border-sky-500/30 card-hover shadow-lg shadow-sky-950/20 group">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('avgResolutionTime')}</span>
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-sky-300 font-mono">{stats.avgResolutionHours ?? 0}h</div>
            <div className="text-[10px] text-sky-300 font-medium mt-1 truncate">{lang === 'as' ? 'গড় সমাধানৰ সময়' : 'Avg Resolution Speed'}</div>
          </div>

          <div className="glass-dark rounded-2xl p-3.5 border border-purple-500/30 card-hover shadow-lg shadow-purple-950/20 group">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('duplicatesPrevented')}</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">{stats.duplicatesPrevented ?? 0}</div>
            <div className="text-[10px] text-purple-300 font-medium mt-1 truncate">{lang === 'as' ? 'ৰোধ কৰা ডুপ্লিকেট' : 'Duplicates Clustered'}</div>
          </div>

        </div>

      </div>
    </div>
  );
}
