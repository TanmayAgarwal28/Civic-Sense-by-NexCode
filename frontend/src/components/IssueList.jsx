import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { IssueCard } from './IssueCard.jsx';
import { Search, Filter, SlidersHorizontal, AlertCircle, Sparkles } from 'lucide-react';

export function IssueList({ issues = [], onSelectIssue, onUpvoteIssue, onRefresh, currentUser }) {
  const { lang, t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'urgency', 'upvotes'

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = 
        (issue.title && issue.title.toLowerCase().includes(q)) ||
        (issue.description && issue.description.toLowerCase().includes(q)) ||
        (issue.ticketId && issue.ticketId.toLowerCase().includes(q)) ||
        (issue.location && issue.location.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && (issue.status === 'resolved' || issue.status === 'closed')) return false;
      if (statusFilter === 'resolved' && issue.status !== 'resolved' && issue.status !== 'closed') return false;
      if (statusFilter === 'in_progress' && issue.status !== 'in_progress') return false;
    }

    // Priority filter
    if (priorityFilter !== 'all' && issue.priority !== priorityFilter) return false;

    // Category filter
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;

    // Language filter
    if (languageFilter !== 'all' && issue.language !== languageFilter) return false;

    return true;
  });

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'urgency') {
      return (b.urgencyScore || 0) - (a.urgencyScore || 0);
    }
    if (sortBy === 'upvotes') {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
    // Default: recent
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Main Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-md space-y-4 animate-fadeIn">
        
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-xs sm:text-sm font-medium transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Status Chips - Horizontally scrollable on mobile */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                statusFilter === 'all' && priorityFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('filterAll')} ({issues.length})
            </button>

            <button
              onClick={() => { setPriorityFilter('critical'); setStatusFilter('all'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer flex-shrink-0 ${
                priorityFilter === 'critical'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>{t('filterCritical')}</span>
            </button>

            <button
              onClick={() => { setStatusFilter('in_progress'); setPriorityFilter('all'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                statusFilter === 'in_progress'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {t('filterInProgress')}
            </button>

            <button
              onClick={() => { setStatusFilter('resolved'); setPriorityFilter('all'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {t('filterResolved')}
            </button>
          </div>

        </div>

        {/* Secondary Filter Dropdowns & Sorter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-bold flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" />
              {lang === 'as' ? 'ফিল্টাৰ:' : 'Filter:'}
            </span>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-medium cursor-pointer focus:outline-none focus:border-emerald-500 shadow-sm"
            >
              <option value="all">{lang === 'as' ? 'সকলো শ্ৰেণী' : 'All Categories'}</option>
              <option value="water">{lang === 'as' ? 'পানী যোগান' : 'Water Supply'}</option>
              <option value="electricity">{lang === 'as' ? 'বিদ্যুৎ আৰু পোহৰ' : 'Electricity'}</option>
              <option value="infrastructure">{lang === 'as' ? 'পথ আৰু আন্তঃগাঁথনি' : 'Infrastructure & Roads'}</option>
              <option value="it_network">{lang === 'as' ? 'তথ্য প্ৰযুক্তি আৰু ৱাই-ফাই' : 'IT & Wi-Fi'}</option>
              <option value="sanitation">{lang === 'as' ? 'পৰিচ্ছন্নতা' : 'Sanitation'}</option>
              <option value="hostel">{lang === 'as' ? 'ছাত্ৰাবাস' : 'Hostels'}</option>
              <option value="security">{lang === 'as' ? 'নিৰাপত্তা আৰু সুৰক্ষা' : 'Security & Safety'}</option>
              <option value="cafeteria">{lang === 'as' ? 'কেণ্টিন' : 'Cafeteria'}</option>
            </select>

            {/* Language Filter */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-medium cursor-pointer focus:outline-none focus:border-emerald-500 shadow-sm"
            >
              <option value="all">{lang === 'as' ? 'সকলো পঞ্জীয়ন ভাষা' : 'All Origin Languages'}</option>
              <option value="as">{lang === 'as' ? 'কেৱল অসমীয়া' : 'Assamese Origin'}</option>
              <option value="en">{lang === 'as' ? 'কেৱল ইংৰাজী' : 'English Origin'}</option>
            </select>
          </div>

          {/* Sort By & Results Count */}
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
              {sortedIssues.length} {lang === 'as' ? 'অভিযোগ' : 'Incidents'}
            </span>

            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-bold hidden sm:inline flex items-center">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                {lang === 'as' ? 'ক্ৰম সজোৱা:' : 'Sort:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="recent">{t('sortByRecent')}</option>
                <option value="urgency">{t('sortByUrgency')}</option>
                <option value="upvotes">{t('sortByUpvotes')}</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Issues Grid */}
      {sortedIssues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">
            {t('noIssuesFound')}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {lang === 'as'
              ? 'আপোনাৰ সন্ধান শব্দ পৰিৱৰ্তন কৰক বা নতুন অভিযোগ দাখিল কৰক।'
              : 'Try adjusting your search keywords, clearing active filters, or filing a new grievance.'}
          </p>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all'); setCategoryFilter('all'); }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            {lang === 'as' ? 'সকলো ফিল্টাৰ পৰিষ্কাৰ কৰক' : 'Clear All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedIssues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onSelect={onSelectIssue}
              onUpvote={onUpvoteIssue}
              currentUserId={currentUser?.id || currentUser?.username}
            />
          ))}
        </div>
      )}

    </div>
  );
}
