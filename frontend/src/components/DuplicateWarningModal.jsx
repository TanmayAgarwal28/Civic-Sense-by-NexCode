import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { AlertTriangle, ThumbsUp, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export function DuplicateWarningModal({ isOpen, onClose, duplicate, onUpvoteExisting, onSubmitAnyway }) {
  const { lang, t } = useLanguage();

  if (!isOpen || !duplicate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/70 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-start space-x-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>{t('duplicateModalTitle')}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {t('duplicateModalDesc')}
            </p>
          </div>
        </div>

        {/* Semantic Similarity Gauge */}
        <div className="my-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('similarityScore')}:</span>
            </span>
            <span className="text-sm font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {duplicate.similarity}% {lang === 'as' ? 'সাদৃশ্য' : 'Match'}
            </span>
          </div>

          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-amber-400 to-rose-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, duplicate.similarity)}%` }}
            />
          </div>

          {/* Matched Issue Card */}
          <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold text-emerald-400">#{duplicate.ticketId}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                {duplicate.location}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5 leading-snug font-assamese">
              {lang === 'as' ? (duplicate.titleAs || duplicate.title) : (duplicate.titleEn || duplicate.title)}
            </h4>
            <div className="text-xs text-slate-300 bg-slate-800/60 p-2 rounded border border-slate-700/60 font-assamese">
              <strong>{lang === 'as' ? 'এআই সাদৃশ্যৰ কাৰণ:' : 'AI Correlation Reason:'}</strong>{' '}
              {lang === 'as' ? (duplicate.reason?.as || duplicate.reason?.en || duplicate.reason) : (duplicate.reason?.en || duplicate.reason?.as || duplicate.reason)}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          {t('duplicateDetectedNotice')}
        </p>

        {/* Decision Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => onUpvoteExisting(duplicate.id || duplicate.ticketId)}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{t('upvoteInsteadBtn')}</span>
          </button>
          
          <button
            onClick={onSubmitAnyway}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            {t('submitAnywayBtn')}
          </button>
        </div>

      </div>
    </div>
  );
}
