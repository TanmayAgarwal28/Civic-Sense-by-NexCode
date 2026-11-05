import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getIssueBilingual } from '../utils/bilingualTranslator.js';
import { MapPin, Clock, ThumbsUp, ChevronRight, ShieldAlert, CheckCircle2, Sparkles, AlertCircle, Link2, Mic } from 'lucide-react';

export function IssueCard({ issue, onSelect, onUpvote, currentUserId }) {
  const { lang, t } = useLanguage();
  const bi = getIssueBilingual(issue);

  const isCritical = issue.priority === 'critical';
  const isHigh = issue.priority === 'high';
  const isResolved = issue.status === 'resolved' || issue.status === 'closed';
  const hasVoiceNote = Boolean(issue.voiceNoteUrl || issue.voiceUrl || issue.audioBlobUrl);

  const activeUserId = currentUserId || (() => {
    try {
      const u = JSON.parse(localStorage.getItem('civicsense_current_user'));
      return u?.id || u?.username || 'usr_stu_01';
    } catch (e) {
      return 'usr_stu_01';
    }
  })();

  const isLiked = Boolean(
    issue.isLiked ||
    (Array.isArray(issue.upvotedBy) && issue.upvotedBy.includes(activeUserId)) ||
    (() => {
      try {
        const likes = JSON.parse(localStorage.getItem(`civicsense_user_likes_${activeUserId}`) || '[]');
        return likes.includes(issue.id) || likes.includes(issue.ticketId);
      } catch (e) {
        return false;
      }
    })()
  );

  const getPriorityBadgeClass = () => {
    switch (issue.priority) {
      case 'critical': return 'bg-rose-500/10 text-rose-600 border-rose-300 animate-emergency font-extrabold';
      case 'high': return 'bg-amber-500/10 text-amber-700 border-amber-300 font-bold';
      case 'medium': return 'bg-blue-500/10 text-blue-700 border-blue-300 font-semibold';
      default: return 'bg-slate-100 text-slate-700 border-slate-300 font-semibold';
    }
  };

  const getStatusBadgeClass = () => {
    switch (issue.status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'investigating': return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'assigned': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusText = () => {
    const map = {
      reported: t('statusReported'),
      ai_triaged: t('statusTriaged'),
      investigating: t('statusInvestigating'),
      in_progress: t('statusInProgress'),
      assigned: t('statusAssigned'),
      resolved: t('statusResolved'),
      closed: t('statusClosed')
    };
    return map[issue.status] || issue.status;
  };

  return (
    <div
      onClick={() => onSelect(issue)}
      className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm card-hover cursor-pointer flex flex-col justify-between group animate-cardSlideIn ${
        isCritical
          ? 'border-rose-300 hover:border-rose-500 ring-1 ring-rose-200'
          : 'border-slate-200 hover:border-emerald-500'
      }`}
    >
      <div>
        
        {/* Top Meta: Ticket ID, Priority, Status, Voice badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              #{issue.ticketId}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide border ${getPriorityBadgeClass()}`}>
              {lang === 'as'
                ? (isCritical ? 'জৰুৰীকালীন' : isHigh ? 'উচ্চ' : issue.priority === 'low' ? 'নিম্ন' : 'মধ্যম')
                : issue.priority}
            </span>
            {hasVoiceNote && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center space-x-1">
                <Mic className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>{lang === 'as' ? 'কণ্ঠস্বৰ' : 'Voice'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Issue Title in Active Language */}
        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2 font-assamese">
          {lang === 'as' ? bi.titleAs : bi.titleEn}
        </h4>

        {/* Location & Department */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 mb-2">
          <span className="flex items-center text-slate-600 font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 flex-shrink-0" />
            <span className="truncate max-w-[190px]">{issue.location}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-indigo-600 font-medium truncate max-w-[170px] font-assamese">
            {lang === 'as' ? (issue.department?.as || issue.category) : (issue.department?.en || issue.category)}
          </span>
        </div>

        {/* Specific Address Tag if available */}
        {issue.address && (
          <div className="text-[11px] text-amber-900 bg-amber-50/90 px-2.5 py-1 rounded-lg border border-amber-200 mb-2.5 truncate font-medium flex items-center">
            <span className="font-bold mr-1">📍 {lang === 'as' ? 'ঠিকনা:' : 'Address:'}</span> {issue.address}
          </div>
        )}

        {/* Photo Thumbnail if available */}
        {issue.imageUrl && (
          <div className="mb-3 relative rounded-xl overflow-hidden h-32 bg-slate-100 border border-slate-200 group-hover:border-slate-300 transition-colors">
            <img src={issue.imageUrl} alt="Damage evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute bottom-1.5 left-1.5 bg-slate-900/85 backdrop-blur-sm text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded shadow">
              📷 {lang === 'as' ? 'এআই ফটো পৰীক্ষিত' : 'AI Vision Tagged'}
            </div>
          </div>
        )}

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-assamese mb-3">
          {lang === 'as' ? bi.descriptionAs : bi.descriptionEn}
        </p>

        {/* Compound Hazard or Duplicate Banner */}
        {issue.isCompoundHazard && (
          <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>
              {lang === 'as' 
                ? 'যৌগিক বিপদ: পানী আৰু সক্ৰিয় বিজুলী সংযোগৰ আশংকা!'
                : 'Compound Risk: Water ingress near live switchboard!'}
            </span>
          </div>
        )}

        {issue.duplicateInfo && (
          <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-semibold flex items-center space-x-1.5">
            <Link2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>
              {lang === 'as'
                ? `প্ৰতিলিপি অভিযোগ: টিকট #${issue.duplicateInfo.linkedTicketId} ৰ সৈতে সংযুক্ত`
                : `Semantic duplicate linked to #${issue.duplicateInfo.linkedTicketId}`}
            </span>
          </div>
        )}

      </div>

      {/* Card Footer: SLA countdown, Upvote, and View Detail Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        
        {/* SLA Window */}
        <div className="flex items-center text-slate-500 text-[11px]">
          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <span>{lang === 'as' ? `সময়সীমা: ${issue.slaHours || 24} ঘণ্টা লক্ষ্য` : `SLA: ${issue.slaHours || 24}h target`}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Upvote / Like Button (Turns Blue, strictly 1 like per student limit) */}
          <button
            type="button"
            disabled={isLiked}
            onClick={(e) => {
              e.stopPropagation();
              if (isLiked) return;
              onUpvote(issue.id);
            }}
            className={`group/like flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all duration-200 shadow-sm ${
              isLiked
                ? 'bg-blue-600 text-white border border-blue-500 shadow-blue-500/30 ring-2 ring-blue-400/40 cursor-default opacity-100 animate-likeBounce'
                : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 hover:shadow-xs cursor-pointer active:scale-90 hover:scale-105'
            }`}
            title={
              isLiked
                ? (lang === 'as' ? 'আপুনি ইতিমধ্যে সন্মতি জনাইছে (প্ৰতিজনৰ বাবে কেৱল ১টা লাইক অনুমোদিত)' : 'Liked! (Only 1 like allowed per person)')
                : (lang === 'as' ? 'সন্মতি জনাওক (+১, প্ৰতিজনৰ বাবে ১টা লাইক)' : 'Upvote (+1, 1 like per student)')
            }
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isLiked ? 'text-white fill-white scale-110' : 'text-slate-500 group-hover/like:scale-115 group-hover/like:text-blue-600'
              }`}
            />
            <span className={`font-mono text-xs ${isLiked ? 'text-white font-black' : ''}`}>
              {issue.upvotes || 0}
            </span>
            {isLiked && (
              <span className="text-[10px] bg-blue-700/90 px-1 py-0.2 rounded text-blue-100 font-bold ml-0.5">
                ✓
              </span>
            )}
          </button>

          {/* View Details Arrow */}
          <span className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 group-hover:translate-x-1 transition-transform duration-200">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>

      </div>

    </div>
  );
}
