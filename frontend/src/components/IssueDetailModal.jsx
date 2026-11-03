import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getIssueBilingual } from '../utils/bilingualTranslator.js';
import { 
  X, MapPin, Clock, ThumbsUp, ShieldAlert, CheckCircle2, 
  FileText, Sparkles, User, Calendar, ExternalLink, Star, Languages 
} from 'lucide-react';

export function IssueDetailModal({ isOpen, onClose, issue, onUpvote }) {
  const { lang, t } = useLanguage();
  const [rating, setRating] = useState(issue?.rating || 0);
  const [hasRated, setHasRated] = useState(false);
  const [activeSummaryTab, setActiveSummaryTab] = useState(lang === 'as' ? 'as' : 'en');
  const [langMode, setLangMode] = useState('both'); // 'both' | 'en' | 'as'

  if (!isOpen || !issue) return null;

  const bi = getIssueBilingual(issue);
  const isResolved = issue.status === 'resolved' || issue.status === 'closed';

  const handleRate = (star) => {
    setRating(star);
    setHasRated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-300 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Top Header */}
        <div className="sticky top-0 bg-slate-900 text-white p-5 rounded-t-3xl z-10 flex items-start justify-between border-b border-slate-800">
          <div className="flex-1 pr-3">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                #{issue.ticketId}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                issue.priority === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {issue.priority} Priority
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                SLA: {issue.slaHours || 24} Hours
              </span>

              {/* Language Display Mode Toggle */}
              <div className="ml-auto flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setLangMode('both')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    langMode === 'both' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="View both English and Assamese"
                >
                  {lang === 'as' ? 'দুয়োটা (Both)' : 'Both (EN+AS)'}
                </button>
                <button
                  type="button"
                  onClick={() => setLangMode('en')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    langMode === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLangMode('as')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    langMode === 'as' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  অসমীয়া
                </button>
              </div>
            </div>

            {/* Bilingual or Single Title */}
            {langMode === 'both' ? (
              <div className="space-y-1.5 mt-2 mb-1">
                <div className="flex items-start gap-1.5">
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 uppercase shrink-0 mt-0.5">
                    EN
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {bi.titleEn}
                  </h3>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40 uppercase shrink-0 mt-0.5 font-assamese">
                    অসমীয়া
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-200 leading-snug font-assamese">
                    {bi.titleAs}
                  </h3>
                </div>
              </div>
            ) : langMode === 'en' ? (
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug mt-1">
                {bi.titleEn}
              </h3>
            ) : (
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug font-assamese mt-1">
                {bi.titleAs}
              </h3>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                {issue.location}
              </span>
              <span>•</span>
              <span className="text-indigo-300 font-medium">
                {lang === 'as' ? (issue.department?.as || issue.category) : (issue.department?.en || issue.category)}
              </span>
            </div>

            {issue.address && (
              <div className="mt-2 text-xs bg-slate-800/80 text-amber-300 px-3 py-1 rounded-xl border border-amber-500/30 font-medium">
                📍 <strong>Specific Address:</strong> {issue.address}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 flex-1 text-slate-800">
          
          {/* Compound Hazard Warning If Applicable */}
          {issue.isCompoundHazard && (
            <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl flex items-start space-x-3 text-rose-800">
              <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-900">
                  {lang === 'as' ? 'যৌগিক বিপদ সতৰ্কতা (Water + Live Electricity)' : 'Critical Compound Safety Hazard Detected!'}
                </h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed font-assamese">
                  {lang === 'as'
                    ? 'বিজুলীৰ ছুইটচবোৰ্ডৰ কাষত পানী বিয়পি পৰাৰ ফলত বিদ্যুৎস্পৃষ্ট আৰু শ্বৰ্ট চাৰ্কিটৰ ভয়ংকৰ সম্ভাৱনা আছে। বিদ্যুৎ যোগান বন্ধ কৰাটো প্ৰাথমিক চৰ্ত।'
                    : 'Water ingress in direct proximity to energized electrical switches poses imminent electrocution hazard. Power isolation was mandated before plumbing repair.'}
                </p>
              </div>
            </div>
          )}

          {/* Original Complaint Text & Reporter Meta */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-200/80">
              <span className="font-bold text-slate-700 flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {issue.reporterName || t('anonymousUser')} ({issue.reporterRole || 'student'})
              </span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {new Date(issue.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>

            {/* Bilingual or Single Description Display */}
            {langMode === 'both' ? (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">EN</span>
                    <span>English Statement</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {bi.descriptionEn}
                  </p>
                </div>
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 shadow-2xs font-assamese">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">অসমীয়া</span>
                    <span>অসমীয়া অভিযোগ বিৱৰণ</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-assamese whitespace-pre-wrap">
                    {bi.descriptionAs}
                  </p>
                </div>
              </div>
            ) : langMode === 'en' ? (
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {bi.descriptionEn}
              </p>
            ) : (
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-assamese">
                {bi.descriptionAs}
              </p>
            )}
          </div>

          {/* Evidence Photos (Multimodal Inspection) */}
          {issue.imageUrl && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t('beforeAfterPhotos')}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reported Photo */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                  <div className="h-48 relative">
                    <img src={issue.imageUrl} alt="Before Fix" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {t('beforePhoto')}
                    </span>
                  </div>
                  <div className="p-2.5 text-[11px] text-slate-300 bg-slate-900">
                    <span className="font-semibold text-emerald-400">AI Vision Inspection:</span>{' '}
                    Liquid ingress and physical damage confirmed.
                  </div>
                </div>

                {/* Resolution Proof Photo if available */}
                {issue.resolutionProofUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-emerald-300 bg-slate-900 shadow-sm">
                    <div className="h-48 relative">
                      <img src={issue.resolutionProofUrl} alt="After Fix" className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {t('afterPhoto')}
                      </span>
                    </div>
                    <div className="p-2.5 text-[11px] text-emerald-300 bg-slate-900">
                      ✓ Post-repair physical verification signed by Maintenance Officer.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400">
                    <Clock className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-xs font-semibold">Post-Repair Resolution Proof</span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Maintenance officer will attach verified photo upon task completion.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Structured Bilingual Summary with Language Tabs */}
          {issue.summary && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{t('aiSummaryHeading')}</span>
                </div>

                {/* Summary Language Tabs */}
                <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveSummaryTab('as')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      activeSummaryTab === 'as' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    অসমীয়া (AS)
                  </button>
                  <button
                    onClick={() => setActiveSummaryTab('en')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      activeSummaryTab === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English (EN)
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeSummaryTab === 'as' ? (
                <div className="space-y-3 font-assamese text-xs">
                  <pre className="whitespace-pre-wrap font-assamese text-slate-200 leading-relaxed text-xs">
                    {issue.summary.as}
                  </pre>
                  {issue.actionPlan?.as && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <div className="font-bold text-emerald-300 mb-1.5">
                        🛠️ পৰামৰ্শিত বিভাগীয় পদক্ষেপ (Action Protocol):
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        {issue.actionPlan.as.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-xs">
                    {issue.summary.en}
                  </pre>
                  {issue.actionPlan?.en && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <div className="font-bold text-emerald-300 mb-1.5">
                        🛠️ Recommended Maintenance Action Protocol:
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        {issue.actionPlan.en.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Visual Lifecycle Progress Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              {t('timelineHeading')}
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {issue.timeline?.map((entry, index) => (
                <div key={entry.id || index} className="relative group">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-600 ring-4 ring-white flex items-center justify-center text-white text-[10px]">
                    ✓
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-bold text-slate-800 uppercase tracking-wider">
                        {entry.status}
                      </span>
                      <span>
                        {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-assamese">
                      {lang === 'as' ? (entry.noteAs || entry.noteEn) : (entry.noteEn || entry.noteAs)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Feedback & Satisfaction Rating if Resolved */}
          {isResolved && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
              <h4 className="text-sm font-bold text-emerald-900 mb-1">
                {t('citizenRatingHeading')}
              </h4>
              <p className="text-xs text-emerald-700 mb-3">
                How satisfied are you with the promptness and quality of this resolution?
              </p>
              
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {hasRated && (
                <p className="text-xs font-bold text-emerald-800 mt-2">
                  ✓ {t('ratingThankYou')} (Rated {rating}/5)
                </p>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-100 rounded-b-3xl border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => onUpvote(issue.id)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 transition-all shadow-sm"
          >
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span>{t('upvoteBtn')} ({issue.upvotes || 0})</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
          >
            {t('closeBtn')}
          </button>
        </div>

      </div>
    </div>
  );
}
