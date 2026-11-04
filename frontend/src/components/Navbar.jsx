import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { logPortalActivity } from '../api.js';
import { 
  ShieldAlert, Globe, Bell, UserCheck, ShieldCheck, 
  Wrench, GraduationCap, PhoneCall, Sparkles, LogIn, LogOut, Menu, X, Database 
} from 'lucide-react';

export function Navbar({ currentUser, onOpenAuth, onLogout, onOpenSos, activeTab, setActiveTab }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    const nextLang = lang === 'as' ? 'en' : 'as';
    toggleLanguage();
    logPortalActivity({
      action: 'LANGUAGE_SWITCHED',
      title: `Display Language Changed to ${nextLang === 'as' ? 'অসমীয়া (Assamese)' : 'English'}`,
      description: `User toggled portal UI language preference in navigation bar.`,
      diskFile: 'backend/data/activity_log.json',
      data: { previous: lang, next: nextLang }
    });
  };

  const handleSosClick = () => {
    logPortalActivity({
      action: 'SOS_EMERGENCY_TRIGGERED',
      title: `🚨 Campus Emergency SOS Hotline Triggered`,
      description: `User triggered emergency call dispatch to DU Campus Security (0373-2370231).`,
      diskFile: 'backend/data/activity_log.json',
      data: { hotline: '0373-2370231', service: 'Emergency Response' }
    });
    onOpenSos();
  };

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'admin': return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
      case 'worker': return <Wrench className="w-4 h-4 text-amber-400" />;
      default: return <GraduationCap className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getRoleBadgeClass = () => {
    switch (currentUser?.role) {
      case 'admin': return 'bg-indigo-950 text-indigo-300 border-indigo-700';
      case 'worker': return 'bg-amber-950 text-amber-300 border-amber-700';
      default: return 'bg-emerald-950 text-emerald-300 border-emerald-700';
    }
  };

  return (
    <header className="bg-slate-900/95 text-white sticky top-0 z-40 shadow-xl border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-22 py-2 sm:py-3">
          
          {/* Brand Logo & University Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group pr-2" 
            onClick={() => setActiveTab(currentUser?.role === 'worker' ? 'worker' : 'report')}
          >
            <div className="relative">
              <img 
                src="/civicsense-icon.png" 
                alt="CivicSense Emblem" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-contain ring-2 ring-emerald-500/40 shadow-md shadow-emerald-950/50 group-hover:scale-105 group-hover:ring-emerald-400 transition-all duration-200 flex-shrink-0" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent group-hover:to-emerald-200 transition-all">
                  {lang === 'as' ? 'চিভিকচেন্স' : 'CivicSense'}
                </h1>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-400" />
                  {lang === 'as' ? 'স্মাৰ্ট চৌহদ' : 'Smart Campus'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block mt-0.5 font-medium">
                {lang === 'as' ? 'অসম ৰাজ্যিক বিশ্ববিদ্যালয় • চৌহদ নিৰাময় পৰ্টেল' : 'Assam State University • Campus Redressal'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Spacious, clearly separated, responsive */}
          <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
            {currentUser?.role !== 'worker' && (
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {t('reportIssueTab')}
              </button>
            )}

            {/* Worker Tab if role is worker */}
            {currentUser?.role === 'worker' && (
              <button
                onClick={() => setActiveTab('worker')}
                className={`px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'worker'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'as' ? 'মোৰ কাৰ্য্যসূচী' : 'My Dispatches'}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {t('browseIssuesTab')}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {t('campusMapTab')}
            </button>

            {/* Full-Stack Live Backend & Persistent Database Engine Console */}
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 ring-2 ring-emerald-400/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>{lang === 'as' ? 'বেকএণ্ড আৰু ডাটাবেচ' : 'Backend & DB'}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-extrabold uppercase">LIVE</span>
            </button>

            {/* Admin Console (Strictly for authenticated Admin) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-300" />
                <span>{lang === 'as' ? 'প্ৰশাসক কনচোল' : 'Admin'}</span>
              </button>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2">
            
            {/* Tactile Language Switcher - Visual Toggle for Both Languages */}
            <button
              onClick={handleLanguageToggle}
              title={lang === 'as' ? 'Switch to English' : 'অসমীয়ালৈ সলনি কৰক'}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all duration-200 shadow-sm cursor-pointer group"
            >
              <Globe className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              <div className="flex items-center space-x-1 text-[11px] font-mono">
                <span className={lang === 'en' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}>EN</span>
                <span className="text-slate-600">|</span>
                <span className={lang === 'as' ? 'text-emerald-400 font-extrabold font-assamese' : 'text-slate-400 font-assamese'}>অসমীয়া</span>
              </div>
            </button>

            {/* Emergency SOS Hotline */}
            <button
              onClick={handleSosClick}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white border border-rose-500/80 shadow-md shadow-rose-900/40 animate-emergency cursor-pointer transition-all active:scale-95"
              title={lang === 'as' ? 'চৌহদ জৰুৰীকালীন হটলাইন' : 'Campus Emergency Hotline'}
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">SOS 24x7</span>
            </button>

            {/* Logged in User Profile or Login Trigger */}
            {currentUser ? (
              <div className="flex items-center space-x-2.5">
                <div 
                  onClick={onOpenAuth}
                  className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer hover:opacity-90 shadow-sm transition-all ${getRoleBadgeClass()}`}
                  title={lang === 'as' ? 'প্ৰ’ফাইল সলনি কৰক' : 'Switch profile or manage account'}
                >
                  {getRoleIcon()}
                  <div className="hidden sm:block text-left">
                    <div className="font-bold leading-tight truncate max-w-[130px]">{currentUser.name}</div>
                    <div className="text-[10px] opacity-75 uppercase font-mono tracking-wider">{currentUser.role}</div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                  title={lang === 'as' ? 'প্ৰস্থান কৰক' : 'Sign Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'as' ? 'প্ৰৱেশ কৰক' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-fadeIn">
          <div className="grid grid-cols-1 gap-1.5">
            {currentUser?.role !== 'worker' && (
              <button
                onClick={() => { setActiveTab('report'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === 'report' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{t('reportIssueTab')}</span>
                <span>✏️</span>
              </button>
            )}

            {currentUser?.role === 'worker' && (
              <button
                onClick={() => { setActiveTab('worker'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === 'worker' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Wrench className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'as' ? 'মোৰ কাৰ্য্যসূচী' : 'My Assigned Dispatches'}</span>
                </span>
                <span>🔧</span>
              </button>
            )}

            <button
              onClick={() => { setActiveTab('browse'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'browse' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{t('browseIssuesTab')}</span>
              <span>📋</span>
            </button>

            <button
              onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'map' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{t('campusMapTab')}</span>
              <span>🗺️</span>
            </button>

            {/* Backend & Live Database in Mobile Menu (Always accessible) */}
            <button
              onClick={() => { setActiveTab('database'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'database' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'as' ? 'বেকএণ্ড আৰু ডাটাবেচ' : 'Backend & Live Database'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">LIVE</span>
            </button>

            {/* Admin Console in Mobile Menu (Strictly Admin only) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{lang === 'as' ? 'প্ৰশাসক কনচোল' : 'Admin Console'}</span>
                </span>
                <span>🛡️</span>
              </button>
            )}
          </div>

          {/* Mobile SOS button */}
          <button
            onClick={() => { handleSosClick(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{lang === 'as' ? 'চৌহদ জৰুৰীকালীন SOS ২৪x৭' : 'Campus Emergency SOS 24x7'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
