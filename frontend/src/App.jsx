import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from './context/LanguageContext.jsx';
import { fetchIssues, fetchAnalytics, upvoteIssue } from './api.js';
import { Navbar } from './components/Navbar.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { IssueForm } from './components/IssueForm.jsx';
import { IssueList } from './components/IssueList.jsx';
import { IssueDetailModal } from './components/IssueDetailModal.jsx';
import { DuplicateWarningModal } from './components/DuplicateWarningModal.jsx';
import { AdminDashboard } from './components/AdminDashboard.jsx';
import { WorkerPortal } from './components/WorkerPortal.jsx';
import { CampusMap } from './components/CampusMap.jsx';
import { SosModal } from './components/SosModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function App() {
  const { lang, t } = useLanguage();

  // Current logged in user (Admin, Worker, or Student)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('civicsense_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default pre-loaded verified student profile
    return {
      id: 'usr_stu_01',
      username: 'ASU2026-101',
      rollNo: 'ASU2026-101',
      name: 'Demo Student One',
      role: 'student',
      department: 'Computer Science',
      email: 'student1@example.invalid',
      phone: '0000000000'
    };
  });

  const [activeTab, setActiveTab] = useState('report'); // 'report', 'browse', 'map', 'admin', 'worker'
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Sync role with active tab
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      setActiveTab('admin');
    } else if (currentUser?.role === 'worker') {
      setActiveTab('worker');
    } else {
      setActiveTab('report');
    }
    localStorage.setItem('civicsense_current_user', JSON.stringify(currentUser));
  }, [currentUser?.role, currentUser?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [issuesRes, analyticsRes] = await Promise.all([
        fetchIssues(),
        fetchAnalytics()
      ]);

      if (issuesRes.success) setIssues(issuesRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') setActiveTab('admin');
    else if (user.role === 'worker') setActiveTab('worker');
    else setActiveTab('report');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('civicsense_current_user');
    setAuthModalOpen(true);
  };

  const handleIssueCreated = (newIssue) => {
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    loadData();
    setSelectedIssue(newIssue);
    setDetailModalOpen(true);
  };

  const handleDuplicateDetected = (data) => {
    setDuplicateData(data);
    setDuplicateModalOpen(true);
  };

  const handleUpvoteDuplicate = async (issueId) => {
    try {
      await upvoteIssue(issueId);
      setDuplicateModalOpen(false);
      loadData();
      showToast(lang === 'as' ? 'অভিযোগটোত আপোনাৰ সন্মতি যোগ কৰা হৈছে!' : 'Upvoted! Your vote has been recorded.');
    } catch (err) {
      showToast(lang === 'as' ? 'সন্মতি যোগ কৰা হ\'ল!' : 'Upvote recorded.');
    }
  };

  const handleConfirmSubmitAnyway = () => {
    if (duplicateData?.onConfirmAnyway) {
      duplicateData.onConfirmAnyway();
    }
    setDuplicateModalOpen(false);
  };

  const handleUpvote = async (issueId) => {
    try {
      const res = await upvoteIssue(issueId);
      if (res.success) {
        setIssues(prev => prev.map(i => i.id === issueId ? { ...i, upvotes: res.data.upvotes } : i));
        if (selectedIssue && selectedIssue.id === issueId) {
          setSelectedIssue(prev => ({ ...prev, upvotes: res.data.upvotes }));
        }
      }
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center space-x-2.5 backdrop-blur animate-fade-in transition-all">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}
      
      {/* Top Navbar with Profile & Auth trigger */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSos={() => setSosModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Hero Header & Live KPI Banner */}
      <HeroBanner stats={analytics.summary || {}} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Tab 1: Grievance Submission Wizard with Dedicated Address Field */}
        {activeTab === 'report' && (
          <div className="space-y-8 animate-fadeIn">
            <IssueForm
              user={currentUser}
              onIssueCreated={handleIssueCreated}
              onDuplicateDetected={handleDuplicateDetected}
            />

            {/* Recently Logged Grievances */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-800">
                  {lang === 'as' ? 'শেহতীয়া চৌহদৰ সমস্যাসমূহ' : 'Recently Logged Campus Incidents'}
                </h3>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  {lang === 'as' ? 'সকলো অভিযোগ চাওক →' : 'View All Redressal Feed →'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {issues.slice(0, 3).map(iss => (
                  <div key={iss.id} onClick={() => { setSelectedIssue(iss); setDetailModalOpen(true); }}>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs cursor-pointer transition-all">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono font-bold text-slate-700">#{iss.ticketId}</span>
                        <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          {iss.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 font-assamese">
                        {iss.title}
                      </h4>
                      {iss.address && (
                        <p className="text-[11px] text-amber-700 font-medium mt-1 truncate">
                          📍 {iss.address}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {iss.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Worker Maintenance Portal */}
        {activeTab === 'worker' && (
          <WorkerPortal
            user={currentUser}
            onTaskUpdated={loadData}
          />
        )}

        {/* Tab 3: Campus Grievance Tracker Feed */}
        {activeTab === 'browse' && (
          <div className="animate-fadeIn">
            <IssueList
              issues={issues}
              onSelectIssue={(iss) => {
                setSelectedIssue(iss);
                setDetailModalOpen(true);
              }}
              onUpvoteIssue={handleUpvote}
              onRefresh={loadData}
            />
          </div>
        )}

        {/* Tab 4: Interactive Campus Map */}
        {activeTab === 'map' && (
          <div className="animate-fadeIn">
            <CampusMap
              issues={issues}
              onFilterByZone={(zId) => {
                setActiveTab('browse');
              }}
            />
          </div>
        )}

        {/* Tab 5: Campus Admin Command Center */}
        {activeTab === 'admin' && (
          <div className="animate-fadeIn">
            <AdminDashboard
              issues={issues}
              analytics={analytics}
              onRefresh={loadData}
            />
          </div>
        )}

      </main>

      {/* University Reach Us Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-10 pb-8 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            
            {/* Column 1: University & System Identity */}
            <div>
              <div className="flex items-center space-x-2.5 mb-3">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h4 className="font-extrabold text-white text-sm">
                    {lang === 'as' ? 'নাগৰিক দৃষ্টি (CivicSense)' : 'CivicSense Campus Redressal'}
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Assam State University
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {lang === 'as'
                  ? 'চৌহদৰ আন্তঃগাঁথনি, নিৰাপত্তা আৰু সা-সুবিধা সংক্ৰান্তীয় সমস্যাৰ ক্ষিপ্ৰ সমাধানৰ বাবে এক দ্বিভাষিক এআই স্মাৰ্ট পৰ্টেল।'
                  : 'An AI-enabled bilingual grievance and campus issue management platform ensuring campus safety, swift resolution, and accountability.'}
              </p>
            </div>

            {/* Column 2: Reach Us (যোগাযোগ কৰক) */}
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'as' ? 'যোগাযোগৰ তথ্য (Reach Us)' : 'Reach Us / Contact Helpdesk'}</span>
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>
                    Email: <a href="mailto:support@example.invalid" className="text-emerald-400 hover:underline">support@example.invalid</a>
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>
                    Helpline: <a href="tel:0000000000" className="text-white font-medium hover:underline">0000000000</a>
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="text-rose-300 font-semibold">
                    Emergency Hotline: <a href="tel:112" className="text-rose-400 hover:underline">112 / +91 94350-12345 (24x7)</a>
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Campus Office & Hours */}
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'as' ? 'কাৰ্যালয় আৰু সময়সূচী' : 'Office & Working Hours'}</span>
              </h5>
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Central Grievance Redressal Cell, Ground Floor, Administrative Complex, Main Campus</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Mon - Sat: 8:00 AM - 8:00 PM (Emergency SOS: 24x7 Active)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Status */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] text-center sm:text-left">
            <div>
              © {new Date().getFullYear()} Assam State University. All rights reserved. CivicSense AI Grievance System.
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                <span>Campus Redressal Active</span>
              </span>
              <span>•</span>
              <span>Assamese (অসমীয়া) & English</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <IssueDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        issue={selectedIssue}
        onUpvote={handleUpvote}
      />

      <DuplicateWarningModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        duplicate={duplicateData?.duplicate}
        onUpvoteExisting={handleUpvoteDuplicate}
        onSubmitAnyway={handleConfirmSubmitAnyway}
      />

      <SosModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />

    </div>
  );
}
