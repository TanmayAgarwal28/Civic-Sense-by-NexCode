import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Activity, CheckCircle2, Clock, Wrench, ShieldAlert, Users, Sparkles } from 'lucide-react';

export function HeroBanner({ stats = {} }) {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-6 pb-8 border-b border-slate-700/60 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Mission */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{lang === 'as' ? 'প্ৰত্যক্ষ চৌহদ তদাৰকী সক্ৰিয়' : 'Live Campus Redressal Engine Active'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'as' ? 'দ্বিভাষিক এআই স্মাৰ্ট চৌহদ সমস্যা সমাধান ব্যৱস্থা' : 'Bilingual AI Smart Campus Issue Management'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'as'
                ? 'অসমীয়া আৰু ইংৰাজী ভাষাত চৌহদৰ সমস্যা দাখিল, স্বয়ংক্ৰিয় এআই শ্ৰেণীবিভাজন, প্ৰতিলিপি চিনাক্তকৰণ আৰু তৎপৰ ক্ষিপ্ৰ সমাধান।'
                : 'Report and track university grievances in Assamese or English. AI automatically interprets complaints, flags hazards, detects semantic duplicates, and alerts crews.'}
            </p>
          </div>

          {/* Campus Health Meter */}
          <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-2xl flex items-center space-x-4 shadow-md self-start md:self-auto">
            <div className="relative flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" className="text-slate-700" fill="transparent" />
                <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" className="text-emerald-500" strokeDasharray={138} strokeDashoffset={138 * (1 - 0.94)} strokeLinecap="round" fill="transparent" />
              </svg>
              <span className="absolute text-xs font-bold text-emerald-400">94%</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">{t('campusHealthScore')}</div>
              <div className="text-sm font-bold text-white flex items-center space-x-1">
                <span>{t('operational')}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-[11px] text-slate-400">SLA: {stats.slaComplianceRate || 95}% on target</div>
            </div>
          </div>
        </div>

        {/* Live KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">{t('totalIssues')}</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white">{stats.total ?? 0}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Assam State Univ</div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">{t('inProgressIssues')}</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400">{stats.inProgress ?? 0}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Crew deployed</div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">{t('resolvedIssues')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">{stats.resolved ?? 0}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Verified & Signed off</div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">{t('criticalAlerts')}</span>
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
            </div>
            <div className="text-xl font-bold text-rose-400">{stats.critical ?? 0}</div>
            <div className="text-[10px] text-rose-300/80 mt-0.5">Immediate 2h SLA</div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">{t('avgResolutionTime')}</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-sky-400">{stats.avgResolutionHours ?? 0}h</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Campus benchmark</div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">{t('duplicatesPrevented')}</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-400">{stats.duplicatesPrevented ?? 0}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Via Semantic AI Match</div>
          </div>

        </div>

      </div>
    </div>
  );
}
