import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { 
  updateIssueStatus, 
  generateOfficialNotice, 
  resetDemoData, 
  deleteIssueAdmin, 
  approveDispatchAdmin,
  fetchAdminUsers, 
  toggleUserAccess, 
  createWorker, 
  addStudentRoster, 
  fetchCategories, 
  createCategory, 
  deleteCategory, 
  fetchLocations, 
  createLocation, 
  deleteLocation, 
  fetchAdminSettings, 
  updateAdminSettings, 
  fetchRawDatabase,
  adminChangePassword
} from '../api.js';
import { 
  ShieldCheck, AlertTriangle, Clock, CheckCircle2, FileText, 
  Download, RefreshCw, Printer, Copy, UserCheck, Wrench, Sparkles, 
  Filter, Trash2, Users, Database, Plus, ToggleLeft, ToggleRight, 
  Settings as SettingsIcon, MapPin, Key, Compass, Navigation 
} from 'lucide-react';

export function AdminDashboard({ issues = [], analytics = {}, onRefresh }) {
  const { lang, t } = useLanguage();

  const [activeAdminTab, setActiveAdminTab] = useState('triage'); // 'triage', 'users', 'categories', 'settings', 'database'

  // Issues and Status update modal
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('in_progress');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Official Notice Modal State
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [generatedNotice, setGeneratedNotice] = useState(null);
  const [noticeLangTab, setNoticeLangTab] = useState(lang === 'as' ? 'as' : 'en');
  const [copied, setCopied] = useState(false);

  // User Management State
  const [userData, setUserData] = useState({
    students: [
      { id: 'usr_stu_01', rollNo: 'ASU2026-101', name: 'Demo Student One', department: 'Computer Science', phone: '0000000000', isActive: true },
      { id: 'usr_stu_02', rollNo: 'ASU2026-102', name: 'Demo Student Two', department: 'Physics & Astronomy', phone: '0000000000', isActive: true },
      { id: 'usr_stu_03', rollNo: 'ASU2026-103', name: 'Demo Student Three', department: 'Mechanical Engg', phone: '0000000000', isActive: true },
      { id: 'usr_stu_04', rollNo: 'ASU2026-104', name: 'Demo Student Four', department: 'Electrical Engg', phone: '0000000000', isActive: true }
    ],
    workers: [
      { id: 'usr_wrk_01', username: 'WRK-ELEC01', name: 'Demo Electrician', department: 'Electrical Maintenance', phone: '0000000000' },
      { id: 'usr_wrk_02', username: 'WRK-PLUMB01', name: 'Demo Plumber', department: 'Water Works & Sanitation', phone: '0000000000' },
      { id: 'usr_wrk_03', username: 'WRK-NET01', name: 'Demo Network Technician', department: 'Computer & Network Center', phone: '0000000000' },
      { id: 'usr_wrk_04', username: 'WRK-SEC01', name: 'Demo Security Inspector', department: 'Campus Security Unit', phone: '0000000000' }
    ],
    roster: [
      { rollNo: 'ASU2026-101', name: 'Demo Student One', department: 'Computer Science', phone: '0000000000', isClaimed: true },
      { rollNo: 'ASU2026-102', name: 'Demo Student Two', department: 'Physics & Astronomy', phone: '0000000000', isClaimed: true },
      { rollNo: 'ASU2026-106', name: 'Demo Applicant', department: 'Civil Engg', phone: '0000000000', isClaimed: false },
      { rollNo: 'ASU2026-107', name: 'Demo Student Seven', department: 'Chemical Sciences', phone: '0000000000', isClaimed: false }
    ]
  });

  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [workerUsername, setWorkerUsername] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [workerDept, setWorkerDept] = useState('Electrical Maintenance');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerPassword, setWorkerPassword] = useState('worker@123');

  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [rosterRoll, setRosterRoll] = useState('');
  const [rosterName, setRosterName] = useState('');
  const [rosterDept, setRosterDept] = useState('Computer Science');
  const [rosterPhone, setRosterPhone] = useState('');

  // Categories & Locations State
  const [categoriesList, setCategoriesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatAs, setNewCatAs] = useState('');
  const [newCatDept, setNewCatDept] = useState('General Maintenance');
  const [newLocEn, setNewLocEn] = useState('');
  const [newLocAs, setNewLocAs] = useState('');

  // Campus Map Custom Placement State (Coords or Relative Distance from Dept)
  const [locInputMode, setLocInputMode] = useState('coords'); // 'coords' or 'relative'
  const [locX, setLocX] = useState(50);
  const [locY, setLocY] = useState(50);
  const [locRefDept, setLocRefDept] = useState('admin_block');
  const [locDistance, setLocDistance] = useState(150);
  const [locDirection, setLocDirection] = useState('North-East');

  // Admin Change Password State
  const [adminOldPassword, setAdminOldPassword] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminPwdLoading, setAdminPwdLoading] = useState(false);
  const [adminPwdError, setAdminPwdError] = useState('');

  // Settings State (AI Auto-Dispatch vs Admin Approval)
  const [settings, setSettings] = useState({ aiAutoDispatch: true, adminEmail: 'admin@example.invalid' });

  // Database Viewer State
  const [rawDbData, setRawDbData] = useState(null);
  const [dbCollection, setDbCollection] = useState('issues');
  const [toastMessage, setToastMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    onConfirm: null
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load Admin Data on mount
  const loadAdminData = async () => {
    try {
      const [usersRes, catRes, locRes, setRes] = await Promise.all([
        fetchAdminUsers(),
        fetchCategories(),
        fetchLocations(),
        fetchAdminSettings()
      ]);
      if (usersRes.data) setUserData(usersRes.data);
      if (catRes.data) setCategoriesList(catRes.data);
      if (locRes.data) setLocationsList(locRes.data);
      if (setRes.data) setSettings(setRes.data);
    } catch (e) {
      console.warn('Using local admin data:', e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadRawDatabase = async () => {
    try {
      const res = await fetchRawDatabase();
      if (res.data) setRawDbData(res.data);
    } catch (e) {
      console.warn('Raw DB offline note:', e);
    }
  };

  useEffect(() => {
    if (activeAdminTab === 'database') {
      loadRawDatabase();
    }
  }, [activeAdminTab]);

  // Handle Delete Issue (100% Optimistic & Safe)
  const handleDeleteIssue = async (id, ticketId) => {
    setConfirmModal({
      open: true,
      title: lang === 'as' ? 'অভিযোগ মচি পেলাওক' : 'Delete Work Order',
      message: lang === 'as' ? `আপুনি #${ticketId} অভিযোগটো স্থায়ীভাৱে মচি পেলাবলৈ নিশ্চিতনে?` : `Are you sure you want to permanently delete work order #${ticketId}?`,
      confirmText: lang === 'as' ? 'মচি পেলাওক' : 'Delete Order',
      onConfirm: async () => {
        showToast(`Work order #${ticketId} deleted.`);
        try {
          await deleteIssueAdmin(id);
        } catch (err) {}
        if (onRefresh) onRefresh();
      }
    });
  };

  // Handle Approve Dispatch (100% Optimistic & Safe)
  const handleApproveDispatch = async (id) => {
    showToast('Grievance approved and dispatched to worker crew.');
    if (onRefresh) onRefresh();
    try {
      await approveDispatchAdmin(id, { assignedOfficer: 'Campus Chief Engineer Dispatched' });
    } catch (err) {
      console.warn('Backend sync note:', err);
    }
  };

  // Handle Toggle Student Active Access (Instant UI Toggle)
  const handleToggleStudent = async (userId) => {
    const student = userData.students.find(s => s.id === userId);
    const currentStatus = student?.isActive !== false;
    const newStatus = !currentStatus;

    // Instantly flip the switch in the UI
    setUserData(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === userId ? { ...s, isActive: newStatus } : s)
    }));
    showToast(`Access turned ${newStatus ? 'ON (Active)' : 'OFF (Suspended)'}.`);

    try {
      await toggleUserAccess(userId, currentStatus);
    } catch (err) {
      console.warn('Backend sync note:', err);
    }
  };

  // Handle Settings Toggle (Direct AI Dispatch vs Admin Approval)
  const handleToggleDispatchMode = async () => {
    const newMode = !settings.aiAutoDispatch;
    setSettings(prev => ({ ...prev, aiAutoDispatch: newMode }));
    showToast(newMode ? 'Direct AI Auto-Dispatch: ACTIVE' : 'Admin Approval Mode: REQUIRED');

    try {
      await updateAdminSettings({ aiAutoDispatch: newMode });
    } catch (err) {
      console.warn('Backend sync note:', err);
    }
  };

  // Handle Create Worker (Optimistic)
  const handleCreateWorker = async (e) => {
    e.preventDefault();
    const newWrk = {
      id: `usr_wrk_${Date.now()}`,
      username: workerUsername.trim(),
      name: workerName.trim(),
      department: workerDept,
      phone: workerPhone.trim(),
      isActive: true
    };

    setUserData(prev => ({ ...prev, workers: [...prev.workers, newWrk] }));
    setWorkerModalOpen(false);
    setWorkerUsername('');
    setWorkerName('');
    setWorkerPhone('');
    showToast(`Worker ${newWrk.name} profile created.`);

    try {
      await createWorker({
        username: newWrk.username,
        name: newWrk.name,
        department: newWrk.department,
        phone: newWrk.phone,
        password: workerPassword
      });
    } catch (err) {
      console.warn('Backend sync note:', err);
    }
  };

  // Handle Add Student to Admission Roster (Optimistic)
  const handleAddRoster = async (e) => {
    e.preventDefault();
    const newRosterEntry = {
      rollNo: rosterRoll.trim().toUpperCase(),
      name: rosterName.trim(),
      department: rosterDept,
      phone: rosterPhone.trim(),
      isClaimed: false
    };

    setUserData(prev => ({ ...prev, roster: [...(prev.roster || []), newRosterEntry] }));
    setRosterModalOpen(false);
    setRosterRoll('');
    setRosterName('');
    setRosterPhone('');
    showToast(`Roll No. ${newRosterEntry.rollNo} registered in admission roster.`);

    try {
      await addStudentRoster(newRosterEntry);
    } catch (err) {
      console.warn('Backend sync note:', err);
    }
  };

  // Handle Category Add/Delete (Optimistic)
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatEn || !newCatAs) return;
    const newCat = {
      id: `cat_${Date.now()}`,
      en: newCatEn.trim(),
      as: newCatAs.trim(),
      defaultDept: newCatDept
    };

    setCategoriesList(prev => [...prev, newCat]);
    setNewCatEn('');
    setNewCatAs('');
    showToast(`Category ${newCat.en} added.`);

    try {
      await createCategory(newCat);
    } catch (err) {
      console.warn('Backend sync note:', err);
    }
  };

  const handleDeleteCategory = async (catId) => {
    setConfirmModal({
      open: true,
      title: lang === 'as' ? 'শ্ৰেণী মচি পেলাওক' : 'Delete Category',
      message: lang === 'as' ? 'আপুনি এই সমস্যা শ্ৰেণীটো মচি পেলাবলৈ নিশ্চিতনে?' : 'Are you sure you want to remove this grievance category?',
      confirmText: lang === 'as' ? 'মচক' : 'Delete Category',
      onConfirm: async () => {
        setCategoriesList(prev => prev.filter(c => c.id !== catId));
        showToast('Category removed.');
        try {
          await deleteCategory(catId);
        } catch (err) {}
      }
    });
  };

  // Calculate relative map coordinates based on distance & direction from reference department
  const calculateRelativeCoords = (refId, distMeters, dir) => {
    const ref = locationsList.find(l => l.id === refId) || { x: 78, y: 48 };
    const baseX = ref.x !== undefined ? Number(ref.x) : 50;
    const baseY = ref.y !== undefined ? Number(ref.y) : 50;
    
    // Scale: 100 meters = 7% on map
    const scale = (Number(distMeters) / 100) * 7;
    let dx = 0;
    let dy = 0;
    
    switch (dir) {
      case 'North': dx = 0; dy = -scale; break;
      case 'North-East': dx = scale * 0.7; dy = -scale * 0.7; break;
      case 'East': dx = scale; dy = 0; break;
      case 'South-East': dx = scale * 0.7; dy = scale * 0.7; break;
      case 'South': dx = 0; dy = scale; break;
      case 'South-West': dx = -scale * 0.7; dy = scale * 0.7; break;
      case 'West': dx = -scale; dy = 0; break;
      case 'North-West': dx = -scale * 0.7; dy = -scale * 0.7; break;
      default: dx = 0; dy = -scale;
    }
    
    const x = Math.round(Math.min(92, Math.max(8, baseX + dx)));
    const y = Math.round(Math.min(92, Math.max(8, baseY + dy)));
    return { x, y };
  };

  // Handle Location Add (Optimistic with Map Coordinate Placement)
  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocEn.trim() || !newLocAs.trim()) return;

    let computedX = Number(locX);
    let computedY = Number(locY);
    let refDeptName = '';

    if (locInputMode === 'relative') {
      const rel = calculateRelativeCoords(locRefDept, locDistance, locDirection);
      computedX = rel.x;
      computedY = rel.y;
      const refObj = locationsList.find(l => l.id === locRefDept);
      refDeptName = refObj ? refObj.en : 'Campus Core';
    }

    const newLoc = {
      id: `loc_${Date.now()}`,
      en: newLocEn.trim(),
      as: newLocAs.trim(),
      x: computedX,
      y: computedY,
      refDept: locInputMode === 'relative' ? refDeptName : null,
      distanceMeters: locInputMode === 'relative' ? locDistance : null,
      direction: locInputMode === 'relative' ? locDirection : null,
      color: 'border-emerald-400 bg-emerald-900/40 text-emerald-300'
    };

    setLocationsList(prev => [...prev, newLoc]);
    setNewLocEn('');
    setNewLocAs('');
    showToast(`Campus place "${newLoc.en}" pinned to map at (X: ${computedX}%, Y: ${computedY}%).`);

    try {
      await createLocation(newLoc);
    } catch (err) {
      console.warn('Backend sync note:', err);
    }
  };

  // Handle Admin Change Password
  const handleChangeAdminPassword = async (e) => {
    e.preventDefault();
    setAdminPwdError('');
    if (!adminOldPassword || !adminNewPassword) {
      setAdminPwdError('Please enter both current and new password.');
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setAdminPwdError('New password and confirmation do not match.');
      return;
    }
    if (adminNewPassword.length < 5) {
      setAdminPwdError('New password must be at least 5 characters long.');
      return;
    }

    try {
      setAdminPwdLoading(true);
      await adminChangePassword(adminOldPassword, adminNewPassword);
      setAdminOldPassword('');
      setAdminNewPassword('');
      setAdminConfirmPassword('');
      showToast('Admin password successfully updated! Please remember your new password.');
    } catch (err) {
      setAdminPwdError(err.message || 'Failed to update admin password.');
    } finally {
      setAdminPwdLoading(false);
    }
  };

  const handleDeleteLocation = async (locId) => {
    setConfirmModal({
      open: true,
      title: lang === 'as' ? 'চৌহদ স্থান মচি পেলাওক' : 'Delete Campus Location',
      message: lang === 'as' ? 'আপুনি এই চৌহদ স্থানটো মচি পেলাবলৈ নিশ্চিতনে?' : 'Are you sure you want to remove this campus location?',
      confirmText: lang === 'as' ? 'মচক' : 'Delete Location',
      onConfirm: async () => {
        setLocationsList(prev => prev.filter(l => l.id !== locId));
        showToast('Location removed.');
        try {
          await deleteLocation(locId);
        } catch (err) {}
      }
    });
  };

  const handleOpenStatusModal = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setResolutionNotes(issue.resolutionNotes || '');
    setAssignedOfficer(issue.assignedOfficer || '');
    setStatusModalOpen(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setStatusModalOpen(false);
    showToast(`Work order #${selectedIssue.ticketId} updated to ${newStatus}.`);

    if (onRefresh) onRefresh();
    try {
      const fd = new FormData();
      fd.append('status', newStatus);
      fd.append('resolutionNotes', resolutionNotes);
      if (assignedOfficer) fd.append('assignedOfficer', assignedOfficer);
      await updateIssueStatus(selectedIssue.id, fd);
    } catch (err) {
      console.warn('Backend sync note:', err);
    }
  };

  const handleGenerateNotice = async (issue) => {
    try {
      setSelectedIssue(issue);
      const res = await generateOfficialNotice({
        issueId: issue.id,
        resolutionNotes: issue.resolutionNotes || 'Authorized engineering crew on-site. Permanent repair and compliance verification certified.',
        officerName: 'Er. B. K. Sarma, Executive Campus Engineer'
      });
      if (res.data) {
        setGeneratedNotice(res.data);
        setNoticeModalOpen(true);
      }
    } catch (err) {
      // Fallback client-side notice generator
      setGeneratedNotice({
        ticketId: issue.ticketId,
        en: `OFFICE OF THE CAMPUS ADMINISTRATIVE OFFICER\nASSAM STATE UNIVERSITY\nRef: ASU/CIVIC/${issue.ticketId}\n\nSUBJECT: ACTION TAKEN REPORT - TICKET #${issue.ticketId}\n\nLocation: ${issue.location}\nDepartment: ${issue.department?.en || 'Works Division'}\nStatus: ${issue.status.toUpperCase()}\n\nAuthorized crew has taken necessary remedial measures in compliance with university campus standards.`,
        as: `চৌহদ প্ৰশাসনিক বিষয়াৰ কাৰ্যালয়\nঅসম ৰাজ্যিক বিশ্ববিদ্যালয়\nস্মাৰক নং: ASU/CIVIC/${issue.ticketId}\n\nবিষয়: পদক্ষেপ গ্ৰহণ প্ৰতিবেদন - টিকট #${issue.ticketId}\n\nস্থান: ${issue.location}\nবিভাগ: ${issue.department?.as || 'চৌহদ পৰিচালনা শাখা'}\nস্থিতি: ${issue.status}\n\nবিশ্ববিদ্যালয়ৰ সুৰক্ষা নীতি অনুসৰি অনুমোদিত কাৰিকৰী দলে তৎকালীন মেৰামতি কাৰ্য সম্পূৰ্ণ কৰিছে।`
      });
      setNoticeModalOpen(true);
    }
  };

  const handleCopyNotice = () => {
    if (!generatedNotice) return;
    navigator.clipboard.writeText(noticeLangTab === 'as' ? generatedNotice.as : generatedNotice.en);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    if (!issues || issues.length === 0) return;
    const headers = ['Ticket ID', 'Title', 'Address', 'Category', 'Priority', 'Status', 'Location', 'Reporter', 'SLA Hours', 'Created At'];
    const rows = issues.map(i => [
      i.ticketId,
      `"${(i.title || '').replace(/"/g, '""')}"`,
      `"${(i.address || '').replace(/"/g, '""')}"`,
      i.category,
      i.priority,
      i.status,
      `"${(i.location || '').replace(/"/g, '""')}"`,
      i.reporterName || 'Anonymous',
      i.slaHours || 24,
      i.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `CivicSense_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = async () => {
    setConfirmModal({
      open: true,
      title: lang === 'as' ? 'তথ্য পুনৰ সংস্থাপন' : 'Reset Database',
      message: lang === 'as' ? 'আপুনি সকলো তথ্য ডেমো অৱস্থালৈ পুনৰ সংস্থাপন কৰিবলৈ নিশ্চিতনে?' : 'Are you sure you want to reset all campus grievances and users to original demo state?',
      confirmText: lang === 'as' ? 'পুনৰ সংস্থাপন' : 'Reset Demo Data',
      onConfirm: async () => {
        showToast('Database reset to pristine demo state.');
        try {
          await resetDemoData();
        } catch (err) {}
        loadAdminData();
        if (onRefresh) onRefresh();
      }
    });
  };

  const filteredIssues = issues.filter(i => {
    if (statusFilter === 'all') return true;
    return i.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center space-x-2 animate-fadeIn text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-indigo-600/30 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                  Super Administrator Portal
                </span>
                <span className="text-xs text-slate-400">Master Administrative Access</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {t('adminHeading')}
              </h3>
              <p className="text-xs text-slate-300">
                Full authority over user permissions, worker credentials, dynamic categories, and raw database.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('exportCsvBtn')}</span>
            </button>
            <button
              onClick={handleResetData}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('resetDemoDataBtn')}</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs - Horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800 text-xs overflow-x-auto pb-1 scrollbar-none flex-nowrap">
          <button
            onClick={() => setActiveAdminTab('triage')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeAdminTab === 'triage' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Grievances & Work Orders ({issues.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeAdminTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student & Worker Management</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('categories')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeAdminTab === 'categories' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Dynamic Categories & Locations</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeAdminTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>AI Dispatch Policy Setting</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('database')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeAdminTab === 'database' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Database Viewer</span>
          </button>
        </div>

      </div>

      {/* ================= SECTION 1: GRIEVANCES & WORK ORDERS ================= */}
      {activeAdminTab === 'triage' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <h4 className="font-extrabold text-slate-800 text-sm">
                Campus Work Orders & Dispatches
              </h4>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                {filteredIssues.length}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported (নথিভুক্ত)</option>
                <option value="assigned">Assigned to Crew</option>
                <option value="in_progress">In Progress (কাম চলি থকা)</option>
                <option value="resolved">Resolved & Verified</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Title & Specific Address</th>
                  <th className="px-4 py-3">Department / Assigned</th>
                  <th className="px-4 py-3">Priority / SLA</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      #{issue.ticketId}
                      {issue.language === 'as' && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-slate-200 text-slate-700 font-sans font-bold">
                          অসমীয়া
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 max-w-xs sm:max-w-md">
                      <div className="font-bold text-slate-900 line-clamp-1 font-assamese">
                        {issue.title}
                      </div>
                      {issue.address && (
                        <div className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-amber-600 flex-shrink-0" />
                          <span className="truncate">{issue.address}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">{issue.location}</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-indigo-700">
                        {issue.department?.en || issue.category}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {issue.assignedOfficer || 'Unassigned'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        issue.priority === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {issue.priority}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1">({issue.slaHours || 24}h)</span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        issue.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : issue.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {issue.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                      {issue.adminApprovalStatus === 'pending_approval' && (
                        <button
                          onClick={() => handleApproveDispatch(issue.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          Approve Dispatch
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenStatusModal(issue)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleGenerateNotice(issue)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                      >
                        Notice
                      </button>

                      <button
                        onClick={() => handleDeleteIssue(issue.id, issue.ticketId)}
                        className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors inline-flex items-center"
                        title="Delete work order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SECTION 2: USER & STUDENT MANAGEMENT ================= */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Campus User & Access Control Center
              </h4>
              <p className="text-xs text-slate-500">
                Toggle student account access on/off, pre-approve admission numbers, and issue worker credentials.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRosterModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Admission Roll No.</span>
              </button>

              <button
                onClick={() => setWorkerModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create Worker Account</span>
              </button>
            </div>
          </div>

          {/* Student List with ON/OFF Switch */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Registered Students ({userData.students.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">Use the toggle button to grant or revoke portal access</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Roll No. / ID</th>
                    <th className="px-4 py-2.5">Student Name</th>
                    <th className="px-4 py-2.5">Department</th>
                    <th className="px-4 py-2.5">Phone</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Access Permission (ON/OFF)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {userData.students.map(stu => (
                    <tr key={stu.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{stu.rollNo || stu.username}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{stu.name}</td>
                      <td className="px-4 py-3">{stu.department || 'General'}</td>
                      <td className="px-4 py-3">{stu.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stu.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {stu.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleStudent(stu.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1 cursor-pointer ${
                            stu.isActive !== false
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-rose-600 text-white hover:bg-rose-700'
                          }`}
                        >
                          {stu.isActive !== false ? (
                            <>
                              <ToggleRight className="w-4 h-4" />
                              <span>Access: ON</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4" />
                              <span>Access: OFF</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workers List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700">
              Campus Maintenance Workers & Technicians ({userData.workers.length})
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Worker ID</th>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Assigned Department</th>
                    <th className="px-4 py-2.5">Phone Number</th>
                    <th className="px-4 py-2.5">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {userData.workers.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-amber-800">{w.username}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{w.name}</td>
                      <td className="px-4 py-3 text-indigo-700 font-medium">{w.department}</td>
                      <td className="px-4 py-3">{w.phone}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active Crew
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* University Pre-Admission Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Campus Pre-Admission Roster ({userData.roster?.length || 0})</span>
              <span className="text-[11px] text-slate-400 font-normal">Students verify against this roster during registration</span>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {userData.roster?.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{item.rollNo}</span>
                    <div className="text-slate-700 font-semibold">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.department}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.isClaimed ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.isClaimed ? 'Registered' : 'Available'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= SECTION 3: DYNAMIC CATEGORIES & LOCATIONS ================= */}
      {activeAdminTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Campus Grievance Categories ({categoriesList.length})
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Add or remove issue categories. AI uses these for auto-classification.
            </p>

            <form onSubmit={handleAddCategory} className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs">
              <span className="font-bold text-slate-700 block">Add New Category:</span>
              <input
                type="text"
                required
                value={newCatEn}
                onChange={(e) => setNewCatEn(e.target.value)}
                placeholder="Category Name in English (e.g. Solar Energy)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
              />
              <input
                type="text"
                required
                value={newCatAs}
                onChange={(e) => setNewCatAs(e.target.value)}
                placeholder="Category Name in Assamese (e.g. সৌৰ শক্তি)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-assamese"
              />
              <input
                type="text"
                value={newCatDept}
                onChange={(e) => setNewCatDept(e.target.value)}
                placeholder="Default Routing Department"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                + Save Category
              </button>
            </form>

            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {categoriesList.map(cat => (
                <div key={cat.id} className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{cat.en}</div>
                    <div className="text-slate-500 font-assamese text-[11px]">{cat.as}</div>
                    <div className="text-[10px] text-indigo-600 mt-0.5">{cat.defaultDept}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Campus Facilities & Geo-Spatial Map Placement ({locationsList.length})</span>
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Add campus buildings, departments, or sectors to the interactive map by specifying X/Y axis coordinates or distance & direction from any existing department.
            </p>

            <form onSubmit={handleAddLocation} className="space-y-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-extrabold text-slate-800 flex items-center space-x-1">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pin New Place on Campus Map</span>
                </span>
                
                {/* Mode Selector */}
                <div className="flex items-center space-x-1 p-0.5 bg-slate-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLocInputMode('coords')}
                    className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-all cursor-pointer ${
                      locInputMode === 'coords' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    📍 Direct Coordinates (X/Y)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocInputMode('relative')}
                    className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-all cursor-pointer ${
                      locInputMode === 'relative' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    🧭 From Department (Distance/Dir)
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Place Name (English):</label>
                  <input
                    type="text"
                    required
                    value={newLocEn}
                    onChange={(e) => setNewLocEn(e.target.value)}
                    placeholder="e.g. Nanotechnology Research Hub"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Place Name (অসমীয়া):</label>
                  <input
                    type="text"
                    required
                    value={newLocAs}
                    onChange={(e) => setNewLocAs(e.target.value)}
                    placeholder="e.g. নেন’প্ৰযুক্তি গৱেষণা কেন্দ্ৰ"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-assamese"
                  />
                </div>
              </div>

              {/* Mode A: Direct Coordinates Sliders */}
              {locInputMode === 'coords' ? (
                <div className="space-y-3 p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>X-Axis (West to East):</span>
                      <span className="font-mono font-bold text-indigo-600">{locX}%</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="92"
                      value={locX}
                      onChange={(e) => setLocX(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                      <span>West Campus (8%)</span>
                      <span>Center (50%)</span>
                      <span>East Campus (92%)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Y-Axis (North to South):</span>
                      <span className="font-mono font-bold text-indigo-600">{locY}%</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="92"
                      value={locY}
                      onChange={(e) => setLocY(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                      <span>North Campus (8%)</span>
                      <span>Center (50%)</span>
                      <span>South Campus (92%)</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Mode B: Relative Distance & Direction from Department */
                <div className="space-y-3 p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Reference Department / Building:</label>
                    <select
                      value={locRefDept}
                      onChange={(e) => setLocRefDept(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      {locationsList.map(l => (
                        <option key={l.id} value={l.id}>{l.en} (X: {l.x ?? 50}%, Y: {l.y ?? 50}%)</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Distance (in meters):</label>
                      <input
                        type="number"
                        min="20"
                        max="800"
                        step="10"
                        value={locDistance}
                        onChange={(e) => setLocDistance(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Direction from Dept:</label>
                      <select
                        value={locDirection}
                        onChange={(e) => setLocDirection(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="North">North (উত্তৰ)</option>
                        <option value="North-East">North-East (উত্তৰ-পূব)</option>
                        <option value="East">East (পূব)</option>
                        <option value="South-East">South-East (দক্ষিণ-পূব)</option>
                        <option value="South">South (দক্ষিণ)</option>
                        <option value="South-West">South-West (দক্ষিণ-পশ্চিম)</option>
                        <option value="West">West (পশ্চিম)</option>
                        <option value="North-West">North-West (উত্তৰ-পশ্চিম)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated result display */}
                  {(() => {
                    const calc = calculateRelativeCoords(locRefDept, locDistance, locDirection);
                    const refObj = locationsList.find(l => l.id === locRefDept);
                    return (
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center justify-between">
                        <span>
                          🧭 <strong>Calculated:</strong> {locDistance}m {locDirection} of {refObj?.en || 'Dept'}
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          (X: {calc.x}%, Y: {calc.y}%)
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Mini Radar Map Canvas Preview */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-3">
                {(() => {
                  let pX = locX;
                  let pY = locY;
                  if (locInputMode === 'relative') {
                    const r = calculateRelativeCoords(locRefDept, locDistance, locDirection);
                    pX = r.x;
                    pY = r.y;
                  }
                  return (
                    <>
                      <div className="relative w-24 h-16 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex-shrink-0">
                        {/* Grid lines */}
                        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:8px_8px] opacity-40"></div>
                        {/* Live Pin */}
                        <div
                          style={{ left: `${pX}%`, top: `${pY}%` }}
                          className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/30 animate-ping"
                        />
                        <div
                          style={{ left: `${pX}%`, top: `${pY}%` }}
                          className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300"
                        />
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <div className="font-bold text-white flex items-center space-x-1">
                          <span>Live Map Placement Coordinates</span>
                        </div>
                        <div className="text-emerald-400 font-mono mt-0.5">
                          X: {pX}% | Y: {pY}%
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Will appear live on Interactive Campus Map.
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center space-x-1.5 transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>+ Create & Pin Place to Campus Map</span>
              </button>
            </form>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {locationsList.map(loc => (
                <div key={loc.id} className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between text-xs transition-colors">
                  <div>
                    <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <span>{loc.en}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        X: {loc.x ?? 50}%, Y: {loc.y ?? 50}%
                      </span>
                    </div>
                    <div className="text-slate-500 font-assamese text-[11px] mt-0.5">{loc.as}</div>
                    {loc.distanceMeters && loc.direction && (
                      <div className="text-[10px] text-indigo-600 font-medium mt-0.5 flex items-center space-x-1">
                        <Compass className="w-3 h-3 text-indigo-500" />
                        <span>{loc.distanceMeters}m {loc.direction} of {loc.refDept || 'Campus Core'}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Delete location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= SECTION 4: AI DISPATCH SETTINGS ================= */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl animate-fadeIn">
          <h4 className="font-extrabold text-slate-800 text-base mb-1">
            AI Triage & Auto-Dispatch Policy Configuration
          </h4>
          <p className="text-xs text-slate-500 mb-6">
            Configure whether AI appoints maintenance crews directly or awaits administrative approval before dispatching work orders.
          </p>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between mb-4">
            <div>
              <span className="font-bold text-sm text-slate-800 block">
                Direct AI Auto-Dispatch to Workers
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {settings.aiAutoDispatch
                  ? 'Active: AI automatically classifies issues and directly dispatches them to assigned workers.'
                  : 'Manual Approval: AI analyzes issues, but work orders remain pending until Admin clicks "Approve Dispatch".'}
              </p>
            </div>

            <button
              onClick={handleToggleDispatchMode}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                settings.aiAutoDispatch
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {settings.aiAutoDispatch ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  <span>Direct Auto-Dispatch (ON)</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>Admin Permission (REQUIRED)</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
            <strong>Campus Administrative Email:</strong> {settings.adminEmail || 'admin@example.invalid'} (Master recovery email).
          </div>

          {/* Security & Change Admin Password (Internal only) */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 mt-5">
            <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-sm mb-1">
              <Key className="w-4 h-4 text-indigo-600" />
              <span>Security & Change Master Administrator Password</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Update administrative master security password. (Public forgot-password option is disabled for Admin security).
            </p>

            <form onSubmit={handleChangeAdminPassword} className="space-y-3 text-xs max-w-md">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Current Password:</label>
                <input
                  type="password"
                  required
                  value={adminOldPassword}
                  onChange={(e) => setAdminOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">New Password:</label>
                <input
                  type="password"
                  required
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  placeholder="Enter new administrator password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Confirm New Password:</label>
                <input
                  type="password"
                  required
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password to verify"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              {adminPwdError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {adminPwdError}
                </div>
              )}

              <button
                type="submit"
                disabled={adminPwdLoading}
                className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {adminPwdLoading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= SECTION 5: LIVE RAW DATABASE VIEWER ================= */}
      {activeAdminTab === 'database' && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-5 gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">
                  Live Persistent Database Collections Inspector
                </h4>
                <p className="text-xs text-slate-400">
                  Real-time inspection of disk-backed JSON database (`backend/data/issues.json`).
                </p>
              </div>
            </div>

            <button
              onClick={loadRawDatabase}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Database</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {['issues', 'users', 'studentRoster', 'categories', 'locations', 'settings'].map(col => (
              <button
                key={col}
                onClick={() => setDbCollection(col)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dbCollection === col
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {col} ({Array.isArray(rawDbData?.[col]) ? rawDbData[col].length : 'Config'})
              </button>
            ))}
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap">
              {rawDbData ? JSON.stringify(rawDbData[dbCollection], null, 2) : 'Loading database...'}
            </pre>
          </div>

        </div>
      )}

      {/* ================= MODAL: STATUS UPDATE ================= */}
      {statusModalOpen && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl">
            <h4 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Update Work Order #{selectedIssue.ticketId}
            </h4>

            <form onSubmit={handleSaveStatus} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="investigating">Investigating (তদন্ত চলি আছে)</option>
                  <option value="in_progress">In Progress (মেৰামতি চলি আছে)</option>
                  <option value="assigned">Assigned to Crew (কাৰিকৰী দল প্ৰেৰিত)</option>
                  <option value="resolved">Resolved & Verified (সমাধান আৰু প্ৰমাণিত)</option>
                  <option value="closed">Closed (বন্ধ কৰা হ’ল)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assigned Officer / Crew
                </label>
                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  placeholder="e.g. Demo Electrician (WRK-ELEC01)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resolution / Technical Field Notes
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Enter details of action taken..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium font-assamese"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-indigo-600 text-white cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE WORKER ================= */}
      {workerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl">
            <h4 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Create New Worker / Maintenance Account
            </h4>

            <form onSubmit={handleCreateWorker} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Worker ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={workerUsername}
                  onChange={(e) => setWorkerUsername(e.target.value)}
                  placeholder="e.g. WRK-PLUMB02"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Worker Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  placeholder="e.g. Dhananjay Kalita"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Department / Trade
                </label>
                <select
                  value={workerDept}
                  onChange={(e) => setWorkerDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Electrical Maintenance">Electrical Maintenance</option>
                  <option value="Water Works & Sanitation">Water Works & Sanitation</option>
                  <option value="Civil Infrastructure">Civil Infrastructure</option>
                  <option value="Computer & Network Center">Computer & Network Center</option>
                  <option value="Campus Hygiene & Sanitation">Campus Hygiene & Sanitation</option>
                  <option value="Campus Security Unit">Campus Security Unit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile / Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={workerPhone}
                  onChange={(e) => setWorkerPhone(e.target.value)}
                  placeholder="9864012345"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Temporary Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={workerPassword}
                  onChange={(e) => setWorkerPassword(e.target.value)}
                  placeholder="worker@123"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setWorkerModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-amber-600 text-white cursor-pointer"
                >
                  Create Worker ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD ROSTER ENTRY ================= */}
      {rosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl">
            <h4 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Add Student to Admission Roster
            </h4>

            <form onSubmit={handleAddRoster} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Unique Admission Roll No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rosterRoll}
                  onChange={(e) => setRosterRoll(e.target.value)}
                  placeholder="e.g. ASU2026-115"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name (As in Admission Record) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rosterName}
                  onChange={(e) => setRosterName(e.target.value)}
                  placeholder="e.g. Manabendra Sarma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={rosterDept}
                  onChange={(e) => setRosterDept(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Student Phone
                </label>
                <input
                  type="tel"
                  value={rosterPhone}
                  onChange={(e) => setRosterPhone(e.target.value)}
                  placeholder="9876543220"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRosterModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-emerald-600 text-white cursor-pointer"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICIAL NOTICE ================= */}
      {noticeModalOpen && generatedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-2xl w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {t('officialNoticeModalTitle')}
                </h4>
                <p className="text-xs text-slate-500">
                  {t('officialNoticeModalDesc')}
                </p>
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setNoticeLangTab('as')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    noticeLangTab === 'as' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  অসমীয়া (AS)
                </button>
                <button
                  onClick={() => setNoticeLangTab('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    noticeLangTab === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English (EN)
                </button>
              </div>
            </div>

            <div className="p-6 bg-amber-50/40 border border-amber-200 rounded-2xl shadow-inner font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto">
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-900 font-assamese leading-relaxed">
                {noticeLangTab === 'as' ? generatedNotice.as : generatedNotice.en}
              </pre>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Notice</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyNotice}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-indigo-600" />
                  <span>{copied ? '✓ Copied!' : 'Copy Notice'}</span>
                </button>
                
                <button
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Sleek Custom Confirmation Modal (Zero Native Alerts) */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">
                {confirmModal.title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, open: false }))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                {lang === 'as' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(prev => ({ ...prev, open: false }));
                  if (action) action();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
