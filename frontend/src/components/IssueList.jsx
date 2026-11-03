import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { IssueCard } from './IssueCard.jsx';
import { Search, Filter, SlidersHorizontal, AlertCircle, Sparkles } from 'lucide-react';

export function IssueList({ issues = [], onSelectIssue, onUpvoteIssue, onRefresh }) {
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
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Status Chips */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            <button
              onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all' && priorityFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('filterAll')} ({issues.length})
            </button>

            <button
              onClick={() => { setPriorityFilter('critical'); setStatusFilter('all'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                priorityFilter === 'critical'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span>{t('filterCritical')}</span>
            </button>

            <button
              onClick={() => { setStatusFilter('in_progress'); setPriorityFilter('all'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'in_progress'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {t('filterInProgress')}
            </button>

            <button
              onClick={() => { setStatusFilter('resolved'); setPriorityFilter('all'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white'
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
            <span className="text-slate-400 font-medium flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Filter:
            </span>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All Categories (সকলো শ্ৰেণী)</option>
              <option value="water">Water Supply (পানী যোগান)</option>
              <option value="electricity">Electricity (বিদ্যুৎ আৰু পোহৰ)</option>
              <option value="infrastructure">Infrastructure & Roads (পথ আৰু গাঁথনি)</option>
              <option value="it_network">IT & Wi-Fi (তথ্য প্ৰযুক্তি)</option>
              <option value="sanitation">Sanitation (পৰিচ্ছন্নতা)</option>
              <option value="hostel">Hostels (ছাত্ৰাবাস)</option>
              <option value="security">Security & Safety (নিৰাপত্তা)</option>
              <option value="cafeteria">Cafeteria (কেণ্টিন)</option>
            </select>

            {/* Language Filter */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All Languages / সকলো ভাষা</option>
              <option value="as">অসমীয়া (Assamese Only)</option>
              <option value="en">English Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700"
            >
              <option value="recent">{t('sortByRecent')}</option>
              <option value="urgency">{t('sortByUrgency')}</option>
              <option value="upvotes">{t('sortByUpvotes')}</option>
            </select>
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
            Try adjusting your search keywords, clearing active filters, or filing a new grievance.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all'); setCategoryFilter('all'); }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Clear All Filters
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
            />
          ))}
        </div>
      )}

    </div>
  );
}
