import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { 
  ShieldAlert, Globe, Bell, UserCheck, ShieldCheck, 
  Wrench, GraduationCap, PhoneCall, Sparkles, LogIn, LogOut, Menu, X, Database 
} from 'lucide-react';

export function Navbar({ currentUser, onOpenAuth, onLogout, onOpenSos, activeTab, setActiveTab }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-xl border-b border-slate-800/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 py-3">
          
          {/* Brand Logo & University Identity */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer hover:opacity-95 transition-opacity pr-4" 
            onClick={() => setActiveTab(currentUser?.role === 'worker' ? 'worker' : 'report')}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-emerald-400/30 flex-shrink-0">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  {lang === 'as' ? 'নাগৰিক দৃষ্টি' : 'CivicSense'}
                </h1>
                <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-400" />
                  Smart Campus
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block mt-0.5 font-medium">
                Assam State University • {lang === 'as' ? 'দ্বিভাষিক চৌহদ নিৰাময় পৰ্টেল' : 'Bilingual Issue Redressal'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Spacious, centered, clearly separated */}
          <nav className="hidden md:flex items-center space-x-2 bg-slate-800/70 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
            {currentUser?.role !== 'worker' && (
              <button
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'report'
                    ? 'bg-emerald-600 text-white shadow-md'
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'worker'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'as' ? 'মোৰ কাৰ্য্যসূচী' : 'My Assigned Dispatches'}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'browse'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {t('browseIssuesTab')}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {t('campusMapTab')}
            </button>

            {/* Admin Dashboard Tab (Admin only) */}
            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'admin'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>{lang === 'as' ? 'প্ৰশাসক কনচোল' : 'Admin Console'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'database'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'as' ? 'প্ৰত্যক্ষ ডাটাবেচ' : 'Live Database'}</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Tools - Generously spaced out, not crammed */}
          <div className="flex items-center space-x-3 sm:space-x-4 pl-4">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Switch Language / ভাষা সলনি কৰক"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-emerald-400 border border-slate-700 hover:border-emerald-500/50 transition-all shadow-sm cursor-pointer"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'as' ? 'English (EN)' : 'অসমীয়া (AS)'}</span>
            </button>

            {/* Emergency SOS Hotline */}
            <button
              onClick={onOpenSos}
              className="hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500/80 shadow-md shadow-rose-600/20 animate-pulse cursor-pointer"
              title="Campus Emergency Hotline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS 24x7</span>
            </button>

            {/* Logged in User Profile or Login Trigger */}
            {currentUser ? (
              <div className="flex items-center space-x-2.5">
                <div 
                  onClick={onOpenAuth}
                  className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer hover:opacity-90 shadow-sm transition-all ${getRoleBadgeClass()}`}
                  title="Switch profile or manage account"
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
                  title="Sign Out"
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

            {currentUser?.role === 'admin' && (
              <>
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

                <button
                  onClick={() => { setActiveTab('database'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeTab === 'database' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'as' ? 'প্ৰত্যক্ষ ডাটাবেচ' : 'Live Database'}</span>
                  </span>
                  <span>🗄️</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile SOS button */}
          <button
            onClick={() => { onOpenSos(); setMobileMenuOpen(false); }}
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
