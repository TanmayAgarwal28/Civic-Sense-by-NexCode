import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getIssueBilingual } from '../utils/bilingualTranslator.js';
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
  adminChangePassword,
  updateUserAdmin,
  deleteUserAdmin,
  updateRosterAdmin,
  deleteRosterAdmin,
  deleteDatabaseEntryAdmin
} from '../api.js';
import { 
  ShieldCheck, AlertTriangle, Clock, CheckCircle2, FileText, 
  Download, RefreshCw, Printer, Copy, UserCheck, Wrench, Sparkles, 
  Filter, Trash2, Users, Database, Plus, ToggleLeft, ToggleRight, 
  Settings as SettingsIcon, MapPin, Key, Compass, Navigation,
  Edit3, Eye, Search, Code, Check, ExternalLink, HardDrive, Shield
} from 'lucide-react';

export function AdminDashboard({ issues = [], analytics = {}, onRefresh, initialAdminTab = 'triage' }) {
  const { lang, t } = useLanguage();

  const [activeAdminTab, setActiveAdminTab] = useState(initialAdminTab); // 'triage', 'users', 'categories', 'settings', 'database'

  useEffect(() => {
    if (initialAdminTab) {
      setActiveAdminTab(initialAdminTab);
    }
  }, [initialAdminTab]);

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
    admin: {
      id: 'usr_admin_01',
      username: 'CampusAdminX1',
      name: 'Chief Campus Administrator',
      role: 'admin',
      email: 'admin@example.invalid',
      phone: '0000000000'
    },
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
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [dbViewMode, setDbViewMode] = useState('visual'); // 'visual' | 'json'
  const [dbUserRoleFilter, setDbUserRoleFilter] = useState('all'); // 'all' | 'student' | 'worker'

  // User & Roster Edit Modals
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editRosterModalOpen, setEditRosterModalOpen] = useState(false);
  const [editingRoster, setEditingRoster] = useState(null);

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
    if (initialAdminTab) {
      setActiveAdminTab(initialAdminTab);
    }
  }, [initialAdminTab]);

  useEffect(() => {
    if (activeAdminTab === 'database') {
      loadRawDatabase();
    }
  }, [activeAdminTab]);

  // Handle Edit User (Student or Worker)
  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      password: '' // leave blank unless admin wants to reset/change it
    });
    setEditUserModalOpen(true);
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const role = editingUser.role;
    
    // Optimistically update local state
    setUserData(prev => {
      if (role === 'student') {
        return {
          ...prev,
          students: prev.students.map(s => s.id === editingUser.id ? { ...s, ...editingUser } : s)
        };
      } else if (role === 'worker') {
        return {
          ...prev,
          workers: prev.workers.map(w => w.id === editingUser.id ? { ...w, ...editingUser } : w)
        };
      } else if (role === 'admin') {
        return {
          ...prev,
          admin: { ...prev.admin, ...editingUser }
        };
      }
      return prev;
    });

    // If currently logged in user is this admin, update localStorage session
    try {
      const current = JSON.parse(localStorage.getItem('civicsense_current_user') || '{}');
      if (current && current.id === editingUser.id) {
        localStorage.setItem('civicsense_current_user', JSON.stringify({
          ...current,
          name: editingUser.name,
          username: editingUser.username,
          email: editingUser.email,
          phone: editingUser.phone
        }));
      }
    } catch (e) {}

    setEditUserModalOpen(false);
    showToast(`${role === 'admin' ? 'Administrator ID & Password' : role === 'student' ? 'Student' : 'Worker'} profile updated successfully.`);

    try {
      await updateUserAdmin(editingUser.id, editingUser);
      loadAdminData();
      if (activeAdminTab === 'database') loadRawDatabase();
    } catch (err) {
      console.warn('Edit user error:', err);
    }
  };

  // Handle Delete User (Admin, Student or Worker)
  const handleDeleteUser = (user) => {
    setConfirmModal({
      open: true,
      title: `Delete ${user.role === 'admin' ? 'Administrator' : user.role === 'student' ? 'Student' : 'Worker'} Profile`,
      message: `Are you sure you want to permanently delete "${user.name}" (${user.rollNo || user.username}) from the database? This cannot be undone.`,
      confirmText: 'Delete Permanently',
      onConfirm: async () => {
        // Optimistic removal
        setUserData(prev => ({
          ...prev,
          students: prev.students.filter(s => s.id !== user.id),
          workers: prev.workers.filter(w => w.id !== user.id),
          admin: prev.admin?.id === user.id ? null : prev.admin
        }));
        showToast(`User ${user.name} removed permanently.`);

        try {
          await deleteUserAdmin(user.id);
          loadAdminData();
          if (activeAdminTab === 'database') loadRawDatabase();
        } catch (err) {
          console.warn('Delete user error:', err);
        }
      }
    });
  };

  // Handle Edit Roster Entry
  const handleEditRoster = (entry) => {
    setEditingRoster({ ...entry });
    setEditRosterModalOpen(true);
  };

  const handleSaveEditRoster = async (e) => {
    e.preventDefault();
    if (!editingRoster) return;

    setUserData(prev => ({
      ...prev,
      roster: prev.roster.map(r => r.rollNo === editingRoster.rollNo ? editingRoster : r)
    }));
    setEditRosterModalOpen(false);
    showToast(`Roster entry ${editingRoster.rollNo} updated.`);

    try {
      await updateRosterAdmin(editingRoster.rollNo, editingRoster);
      loadAdminData();
      if (activeAdminTab === 'database') loadRawDatabase();
    } catch (err) {
      console.warn('Edit roster error:', err);
    }
  };

  // Handle Delete Roster Entry
  const handleDeleteRoster = (entry) => {
    setConfirmModal({
      open: true,
      title: lang === 'as' ? 'প্ৰাক-নামভৰ্তি ৰষ্টাৰ তথ্য মচি পেলাওক' : 'Delete Pre-Admission Roster Entry',
      message: lang === 'as' ? `আপুনি নিশ্চিতনে যে ৰোল নম্বৰ ${entry.rollNo} (${entry.name}) ৰষ্টাৰৰ পৰা মচিব বিচাৰে?` : `Are you sure you want to delete ${entry.rollNo} (${entry.name}) from the official pre-admission roster?`,
      confirmText: lang === 'as' ? 'মচি পেলাওক' : 'Delete Roster',
      onConfirm: async () => {
        setUserData(prev => ({
          ...prev,
          roster: prev.roster.filter(r => r.rollNo !== entry.rollNo)
        }));
        showToast(`Roll No. ${entry.rollNo} deleted from roster.`);

        try {
          await deleteRosterAdmin(entry.rollNo);
          loadAdminData();
          if (activeAdminTab === 'database') loadRawDatabase();
        } catch (err) {
          console.warn('Delete roster error:', err);
        }
      }
    });
  };

  // Handle Delete Any Entry directly from Database Inspector
  const handleDeleteDbEntry = (collection, item, displayId) => {
    const recordId = item.id || item.ticketId || item.rollNo;
    setConfirmModal({
      open: true,
      title: lang === 'as' ? `[${collection}] ৰ পৰা তথ্য মচি পেলাওক` : `Delete Record from [${collection}]`,
      message: lang === 'as' ? `আপুনি নিশ্চিতনে যে "${displayId || recordId}" তথ্যটো "${collection}" তালিকাৰ পৰা স্থায়ীভাৱে মচিব বিচাৰে? ইয়াৰ দ্বাৰা backend/data/issues.json ফাইল পোনপটীয়াকৈ সলনি হ'ব।` : `Are you sure you want to permanently delete record "${displayId || recordId}" from database collection "${collection}"? This will modify backend/data/issues.json immediately.`,
      confirmText: lang === 'as' ? 'মচি পেলাওক' : 'Delete Record',
      onConfirm: async () => {
        showToast(`Record ${displayId || recordId} deleted from ${collection}.`);
        try {
          await deleteDatabaseEntryAdmin(collection, recordId);
          loadRawDatabase();
          loadAdminData();
          if (onRefresh) onRefresh();
        } catch (err) {
          console.warn('Delete DB record error:', err);
        }
      }
    });
  };

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
    const listToExport = (issues && issues.length > 0)
      ? issues
      : (rawDbData?.issues && rawDbData.issues.length > 0 ? rawDbData.issues : []);

    if (listToExport.length === 0) {
      showToast(lang === 'as' ? 'ৰপ্তানি কৰিবলৈ কোনো অভিযোগ পোৱা নগ’ল।' : 'No grievances available to export.');
      return;
    }

    const headers = [
      'Ticket ID',
      'Title',
      'Specific Address',
      'Campus Zone',
      'Category',
      'Priority',
      'SLA Hours',
      'Status',
      'Reporter Name',
      'Reporter Roll',
      'Assigned Technician',
      'Upvotes',
      'Created Date',
      'Resolution Notes'
    ];

    const rows = listToExport.map(i => [
      i.ticketId || i.id || 'N/A',
      `"${(i.title || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
      `"${(i.address || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
      `"${(i.location || i.zoneId || '').replace(/"/g, '""')}"`,
      `"${(i.categoryName || i.category || '').replace(/"/g, '""')}"`,
      (i.priority || 'medium').toUpperCase(),
      i.slaHours || 24,
      (i.status || 'reported').toUpperCase(),
      `"${(i.reporterName || 'Anonymous Student').replace(/"/g, '""')}"`,
      i.reporterRoll || 'N/A',
      `"${(i.assignedWorkerName || i.assignedWorkerId || 'Unassigned').replace(/"/g, '""')}"`,
      i.upvotes || 0,
      i.createdAt ? new Date(i.createdAt).toLocaleString() : 'N/A',
      `"${(i.resolutionNotes || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CivicSense_Campus_Grievances_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(lang === 'as' ? '✅ CSV প্ৰতিবেদন সফলতাৰে ডাউনলোড হ’ল!' : '✅ CSV Grievance Report downloaded successfully!');
  };

  const handleExportJson = () => {
    const dataToExport = rawDbData || { issues, users: userData };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CivicSense_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(lang === 'as' ? '✅ JSON তথ্যভঁৰাল সফলতাৰে সংৰক্ষিত হ’ল!' : '✅ JSON Database export completed successfully!');
  };

  const handleResetData = async () => {
    setConfirmModal({
      open: true,
      title: lang === 'as' ? 'তথ্য পুনৰ সংস্থাপন' : 'Reset Database',
      message: lang === 'as' ? 'আপুনি সকলো তথ্য ডেমো অৱস্থালৈ পুনৰ সংস্থাপন কৰিবলৈ নিশ্চিতনে?' : 'Are you sure you want to reset all campus grievances and users to original demo state?',
      confirmText: lang === 'as' ? 'পুনৰ সংস্থাপন' : 'Reset Demo Data',
      onConfirm: async () => {
        showToast(lang === 'as' ? 'তথ্যভঁৰাল ডেমো অৱস্থালৈ পুনৰ সংস্থাপন কৰা হ’ল।' : 'Database reset to pristine demo state.');
        try {
          await resetDemoData();
        } catch (err) {}
        loadAdminData();
        if (onRefresh) onRefresh();
      }
    });
  };

  // Live dynamic SLA Calculation directly from live tickets
  const liveSlaMetrics = (() => {
    const list = (issues && issues.length > 0) ? issues : (rawDbData?.issues || []);
    if (list.length === 0) return { rate: 100, onTime: 0, breached: 0, total: 0 };
    const now = Date.now();
    let onTime = 0;
    let breached = 0;

    list.forEach(i => {
      const created = i.createdAt ? new Date(i.createdAt).getTime() : now;
      const slaHours = Number(i.slaHours) || (i.priority === 'critical' ? 2 : i.priority === 'high' ? 6 : i.priority === 'low' ? 48 : 24);
      const deadline = i.slaDeadline ? new Date(i.slaDeadline).getTime() : created + (slaHours * 3600 * 1000);

      if (i.status === 'resolved' || i.status === 'closed') {
        const resTime = i.resolvedAt ? new Date(i.resolvedAt).getTime() : (created + (slaHours * 0.4 * 3600 * 1000));
        if (resTime <= deadline) onTime++;
        else breached++;
      } else if (now > deadline) {
        breached++;
      } else {
        onTime++;
      }
    });

    const rate = Math.round((onTime / list.length) * 100);
    return { rate, onTime, breached, total: list.length };
  })();

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
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-indigo-600/30 text-indigo-400 rounded-2xl border border-indigo-500/30 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                  {t('adminPortalBadge')}
                </span>
                <span className="text-xs text-slate-400">
                  {t('adminAccessBadge')}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">
                {t('adminHeading')}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {t('adminDescription')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              title="Download CSV Spreadsheet of all grievances"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('exportCsvBtn')}</span>
            </button>
            <button
              onClick={handleExportJson}
              title="Download full JSON database snapshot"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all cursor-pointer shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('dbExportJson')}</span>
            </button>
            <button
              onClick={handleResetData}
              title="Reset data back to initial state"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('resetDemoDataBtn')}</span>
            </button>
          </div>
        </div>

        {/* Live SLA Target Monitor Widget */}
        <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="4"
                  className={liveSlaMetrics.rate >= 85 ? "text-emerald-500" : liveSlaMetrics.rate >= 60 ? "text-amber-500" : "text-rose-500"}
                  strokeDasharray={138}
                  strokeDashoffset={138 * (1 - Math.min(100, Math.max(0, liveSlaMetrics.rate)) / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className={`absolute text-xs font-extrabold ${liveSlaMetrics.rate >= 85 ? 'text-emerald-400' : liveSlaMetrics.rate >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {liveSlaMetrics.rate}%
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-300">{t('slaTargetLabel')}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  liveSlaMetrics.rate >= 85 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {liveSlaMetrics.rate >= 85 ? (lang === 'as' ? 'উত্তম স্থিতি' : 'Optimal Target') : (lang === 'as' ? 'তদাৰকী প্ৰয়োজন' : 'Attention Needed')}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{t('slaOnTime')}: <strong className="text-emerald-400 font-mono">{liveSlaMetrics.onTime}</strong></span>
                <span>•</span>
                <span>{t('slaBreached')}: <strong className="text-rose-400 font-mono">{liveSlaMetrics.breached}</strong></span>
                <span>•</span>
                <span>{lang === 'as' ? 'মুঠ মূল্যাঙ্কিত' : 'Total Evaluated'}: <strong className="text-white font-mono">{liveSlaMetrics.total}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              {lang === 'as'
                ? 'প্ৰত্যেক অভিযোগৰ নিৰ্ধাৰিত সময়সীমা (২ ঘণ্টা / ৬ ঘণ্টা / ২৪ ঘণ্টা) অনুসৰি পোনপটীয়াকৈ গণনা কৰা হৈছে।'
                : 'Live calculation updated automatically against dynamic SLA deadlines (2h / 6h / 24h).'}
            </span>
          </div>
        </div>

        {/* Admin Navigation Tabs - Horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800 text-xs overflow-x-auto pb-1 scrollbar-thin flex-nowrap">
          <button
            onClick={() => setActiveAdminTab('triage')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer flex-shrink-0 ${
              activeAdminTab === 'triage' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('adminTabTriage')} ({issues.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer flex-shrink-0 ${
              activeAdminTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('adminTabUsers')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('categories')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer flex-shrink-0 ${
              activeAdminTab === 'categories' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('adminTabCategories')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer flex-shrink-0 ${
              activeAdminTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>{t('adminTabSettings')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('database')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer flex-shrink-0 ${
              activeAdminTab === 'database' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('adminTabDatabase')}</span>
          </button>
        </div>

      </div>

      {/* ================= SECTION 1: GRIEVANCES & WORK ORDERS ================= */}
      {activeAdminTab === 'triage' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <h4 className="font-extrabold text-slate-800 text-sm">
                {lang === 'as' ? 'চৌহদৰ কাৰ্য্যসূচী আৰু বিভাগীয় দায়িত্ব' : 'Campus Work Orders & Dispatches'}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 font-mono">
                {filteredIssues.length}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center space-x-1 text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'as' ? 'ফিল্টাৰ:' : 'Filter:'}</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-700 cursor-pointer"
              >
                <option value="all">{lang === 'as' ? 'সকলো স্থিতি' : 'All Statuses'}</option>
                <option value="reported">{lang === 'as' ? 'নথিভুক্ত অভিযোগ' : 'Reported'}</option>
                <option value="in_progress">{lang === 'as' ? 'মেৰামতি চলি থকা' : 'In Progress'}</option>
                <option value="resolved">{lang === 'as' ? 'সমাধান আৰু প্ৰমাণিত' : 'Resolved & Verified'}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{lang === 'as' ? 'টিকট নম্বৰ' : 'Ticket ID'}</th>
                  <th className="px-4 py-3">{lang === 'as' ? 'শিৰোনাম আৰু নিৰ্দিষ্ট স্থান' : 'Title & Specific Address'}</th>
                  <th className="px-4 py-3">{lang === 'as' ? 'বিভাগ / কৰ্মী' : 'Department / Assigned'}</th>
                  <th className="px-4 py-3">{lang === 'as' ? 'অগ্ৰাধিকাৰ / সময়সীমা' : 'Priority / SLA'}</th>
                  <th className="px-4 py-3">{lang === 'as' ? 'স্থিতি' : 'Status'}</th>
                  <th className="px-4 py-3 text-right">{lang === 'as' ? 'প্ৰশাসনিক ব্যৱস্থা' : 'Admin Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400 text-xs">
                      {lang === 'as' ? 'কোনো কাৰ্য্যসূচী অথবা অভিযোগ পোৱা নগ’ল।' : 'No work orders or grievances found matching filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => {
                    const bi = getIssueBilingual(issue);
                    return (
                      <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                        
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                          #{issue.ticketId}
                        </td>

                        <td className="px-4 py-3.5 max-w-xs sm:max-w-md">
                          <div className="font-bold text-slate-900 line-clamp-1 font-assamese text-sm">
                            {lang === 'as' ? bi.titleAs : bi.titleEn}
                          </div>
                          {issue.address && (
                            <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center">
                              <MapPin className="w-3 h-3 mr-1 text-amber-600 flex-shrink-0" />
                              <span className="truncate">{issue.address}</span>
                            </div>
                          )}
                          <div className="text-[10px] text-slate-400 mt-0.5">{issue.location}</div>
                        </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-indigo-700">
                          {typeof issue.department === 'object' 
                            ? (lang === 'as' ? issue.department?.as || issue.department?.en : issue.department?.en)
                            : (issue.department || issue.category)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {issue.assignedWorkerName || issue.assignedOfficer || (lang === 'as' ? 'অনিৰ্ধাৰিত' : 'Unassigned')}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          issue.priority === 'critical' ? 'bg-rose-100 text-rose-800' : issue.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
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
                          {issue.status === 'resolved' ? (lang === 'as' ? 'সমাধান সম্পন্ন' : 'Resolved') :
                           issue.status === 'in_progress' ? (lang === 'as' ? 'কাম চলি আছে' : 'In Progress') :
                           (lang === 'as' ? 'নথিভুক্ত' : 'Reported')}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        {issue.adminApprovalStatus === 'pending_approval' && (
                          <button
                            onClick={() => handleApproveDispatch(issue.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                          >
                            {lang === 'as' ? 'অনুমোদন' : 'Approve'}
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenStatusModal(issue)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                        >
                          {lang === 'as' ? 'স্থিতি সলনি' : 'Update'}
                        </button>

                        <button
                          onClick={() => handleGenerateNotice(issue)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-pointer"
                        >
                          {lang === 'as' ? 'চৰকাৰী জাননী' : 'Notice'}
                        </button>

                        <button
                          onClick={() => handleDeleteIssue(issue.id, issue.ticketId)}
                          className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors inline-flex items-center cursor-pointer"
                          title="Delete work order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                }))}
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
                {lang === 'as' ? 'চৌহদ ব্যৱহাৰকাৰী আৰু প্ৰৱেশাধিকাৰ নিয়ন্ত্ৰণ কেন্দ্ৰ' : 'Campus User & Access Control Center'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'as' ? 'ছাত্ৰ প্ৰৱেশ অনুমতি অন/অফ, নামভৰ্তিৰ ৰোল পৰীক্ষণ, আৰু কাৰিকৰী কৰ্মীৰ একাউণ্ট ব্যৱস্থাপনা।' : 'Toggle student account access on/off, pre-approve admission numbers, and issue worker credentials.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setRosterModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1 cursor-pointer transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'as' ? '+ নামভৰ্তি ৰোল নম্বৰ যোগ' : '+ Add Admission Roll No.'}</span>
              </button>

              <button
                onClick={() => setWorkerModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center space-x-1 cursor-pointer transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'as' ? '+ কৰ্মী একাউণ্ট যোগ' : '+ Create Worker Account'}</span>
              </button>
            </div>
          </div>

          {/* Administrator profile card */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 border border-indigo-700/60 shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xl flex-shrink-0">
                🛡️
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-extrabold text-white text-base">
                    {userData.admin?.name || (lang === 'as' ? 'মুখ্য প্ৰশাসক' : 'Chief Campus Administrator')}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                    {t('adminMasterProfile')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs text-indigo-200">
                  <div>
                    {t('adminLoginId')}: <code className="bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700/60 font-mono font-bold text-amber-300">{userData.admin?.username || 'CampusAdminX1'}</code>
                  </div>
                  <span>•</span>
                  <div>
                    {t('adminPasswordLabel')}: <span className="font-mono text-indigo-300">•••••••• ({t('adminEditableBadge')})</span>
                  </div>
                  <span>•</span>
                  <div className="text-slate-300">
                    {userData.admin?.email || 'admin@example.invalid'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditUser(userData.admin || { id: 'usr_admin_01', username: 'CampusAdminX1', role: 'admin', name: 'Chief Campus Administrator', email: 'admin@example.invalid', phone: '0000000000' })}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/40 flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-200" />
                <span>{t('editAdminBtn')}</span>
              </button>
            </div>
          </div>

          {/* Student List with Edit, ON/OFF Switch & Delete */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>{t('regStudentsHeading')} ({userData.students.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">{t('regStudentsSubheading')}</span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'ৰোল নং / আইডি' : 'Roll No. / ID'}</th>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'ছাত্ৰৰ নাম' : 'Student Name'}</th>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'বিভাগ' : 'Department'}</th>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'ফোন' : 'Phone'}</th>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'স্থিতি' : 'Status'}</th>
                    <th className="px-4 py-2.5 text-right">{lang === 'as' ? 'কাৰ্য্যকলাপ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {userData.students.map(stu => (
                    <tr key={stu.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{stu.rollNo || stu.username}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{stu.name}</td>
                      <td className="px-4 py-3">{stu.department || (lang === 'as' ? 'সাধাৰণ' : 'General')}</td>
                      <td className="px-4 py-3">{stu.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stu.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {stu.isActive !== false ? (lang === 'as' ? 'সক্ৰিয়' : 'Active') : (lang === 'as' ? 'স্থগিত' : 'Suspended')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* Edit Student */}
                          <button
                            onClick={() => handleEditUser(stu)}
                            title="Edit student profile"
                            className="p-1.5 rounded-lg text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px] font-bold">{lang === 'as' ? 'সম্পাদনা' : 'Edit'}</span>
                          </button>

                          {/* Access Switch */}
                          <button
                            onClick={() => handleToggleStudent(stu.id)}
                            title={stu.isActive !== false ? 'Suspend student account' : 'Restore student account'}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all inline-flex items-center space-x-1 cursor-pointer ${
                              stu.isActive !== false
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-rose-600 text-white hover:bg-rose-700'
                            }`}
                          >
                            {stu.isActive !== false ? (
                              <>
                                <ToggleRight className="w-3.5 h-3.5" />
                                <span>{lang === 'as' ? 'অন' : 'ON'}</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-3.5 h-3.5" />
                                <span>{lang === 'as' ? 'বন্ধ' : 'OFF'}</span>
                              </>
                            )}
                          </button>

                          {/* Delete Student */}
                          <button
                            onClick={() => handleDeleteUser(stu)}
                            title="Permanently delete student account"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workers List with Edit & Delete */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>{t('workerHeading')} ({userData.workers.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">{t('workerSubheading')}</span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'কৰ্মী আইডি' : 'Worker ID'}</th>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'নাম' : 'Name'}</th>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'দায়িত্বপ্ৰাপ্ত বিভাগ' : 'Assigned Department'}</th>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'ফোন নম্বৰ' : 'Phone Number'}</th>
                    <th className="px-4 py-2.5">{lang === 'as' ? 'স্থিতি' : 'Account Status'}</th>
                    <th className="px-4 py-2.5 text-right">{lang === 'as' ? 'কাৰ্য্যকলাপ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {userData.workers.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-amber-800">{w.username}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{w.name}</td>
                      <td className="px-4 py-3 text-indigo-700 font-medium">{w.department}</td>
                      <td className="px-4 py-3">{w.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {lang === 'as' ? 'সক্ৰিয় কৰ্মী' : 'Active Crew'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* Edit Worker */}
                          <button
                            onClick={() => handleEditUser(w)}
                            title="Edit technician profile"
                            className="p-1.5 rounded-lg text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px] font-bold">{lang === 'as' ? 'সম্পাদনা' : 'Edit'}</span>
                          </button>

                          {/* Delete Worker */}
                          <button
                            onClick={() => handleDeleteUser(w)}
                            title="Permanently delete worker account"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* University Pre-Admission Roster with Edit & Delete */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>{t('rosterHeading')} ({userData.roster?.length || 0})</span>
              <span className="text-[11px] text-slate-400 font-normal">{t('rosterSubheading')}</span>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {userData.roster?.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="font-mono font-bold text-slate-900">{item.rollNo}</span>
                    <div className="text-slate-800 font-semibold truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.department}</div>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.isClaimed ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.isClaimed ? (lang === 'as' ? 'পঞ্জীয়ন সম্পন্ন' : 'Claimed / Registered') : (lang === 'as' ? 'উপলব্ধ' : 'Available')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditRoster(item)}
                      title="Edit admission entry"
                      className="p-1.5 rounded-lg text-indigo-700 hover:bg-indigo-50 border border-indigo-200 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoster(item)}
                      title="Delete from roster"
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
              {lang === 'as' ? 'কেম্পাছ অভিযোগৰ বিভাগসমূহ' : 'Campus Grievance Categories'} ({categoriesList.length})
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'as' ? 'অভিযোগ বিভাগ যোগ বা অপসাৰণ কৰক। AI-য়ে স্বয়ংক্ৰিয় শ্ৰেণীবিভাজনৰ বাবে ব্যৱহাৰ কৰে।' : 'Add or remove issue categories. AI uses these for auto-classification.'}
            </p>

            <form onSubmit={handleAddCategory} className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs">
              <span className="font-bold text-slate-700 block">
                {lang === 'as' ? 'নতুন বিভাগ যোগ কৰক:' : 'Add New Category:'}
              </span>
              <input
                type="text"
                required
                value={newCatEn}
                onChange={(e) => setNewCatEn(e.target.value)}
                placeholder={lang === 'as' ? 'ইংৰাজীত বিভাগৰ নাম (যেনে Solar Energy)' : 'Category Name in English (e.g. Solar Energy)'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
              />
              <input
                type="text"
                required
                value={newCatAs}
                onChange={(e) => setNewCatAs(e.target.value)}
                placeholder={lang === 'as' ? 'অসমীয়াত বিভাগৰ নাম (যেনে সৌৰ শক্তি)' : 'Category Name in Assamese (e.g. সৌৰ শক্তি)'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-assamese"
              />
              <input
                type="text"
                value={newCatDept}
                onChange={(e) => setNewCatDept(e.target.value)}
                placeholder={lang === 'as' ? 'ডিফল্ট প্ৰেৰণ বিভাগ' : 'Default Routing Department'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                {lang === 'as' ? '+ বিভাগ সংৰক্ষণ কৰক' : '+ Save Category'}
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
                    title={lang === 'as' ? 'বিভাগ মচি পেলাওক' : 'Delete category'}
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
                <span>{lang === 'as' ? 'কেম্পাছ স্থান আৰু মেপ স্থানাংক নিৰ্ধাৰণ' : 'Campus Facilities & Geo-Spatial Map Placement'} ({locationsList.length})</span>
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'as'
                ? 'ইন্টৰেক্টিভ মেপত স্থান যোগ কৰক: পোনপটীয়া X/Y অক্ষ স্থানাংক বা নিকটৱৰ্তী বিভাগৰ পৰা দূৰত্ব আৰু দিশ উল্লেখ কৰক।'
                : 'Add campus buildings, departments, or sectors to the interactive map by specifying X/Y axis coordinates or distance & direction from any existing department.'}
            </p>

            <form onSubmit={handleAddLocation} className="space-y-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-extrabold text-slate-800 flex items-center space-x-1">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'as' ? 'কেম্পাছ মেপত নতুন স্থান পিন কৰক' : 'Pin New Place on Campus Map'}</span>
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
                    {lang === 'as' ? '📍 পোনপটীয়া স্থানাংক (X/Y)' : '📍 Direct Coordinates (X/Y)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocInputMode('relative')}
                    className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-all cursor-pointer ${
                      locInputMode === 'relative' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {lang === 'as' ? '🧭 বিভাগৰ পৰা (দূৰত্ব/দিশ)' : '🧭 From Department (Distance/Dir)'}
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'as' ? 'স্থানৰ নাম (ইংৰাজী):' : 'Place Name (English):'}</label>
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
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'as' ? 'স্থানৰ নাম (অসমীয়া):' : 'Place Name (অসমীয়া):'}</label>
                  <input
                    type="text"
                    required
                    value={newLocAs}
                    onChange={(e) => setNewLocAs(e.target.value)}
                    placeholder="যেনে নেন’প্ৰযুক্তি গৱেষণা কেন্দ্ৰ"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-assamese"
                  />
                </div>
              </div>

              {/* Mode A: Direct Coordinates Sliders */}
              {locInputMode === 'coords' ? (
                <div className="space-y-3 p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>{lang === 'as' ? 'X-অক্ষ (পশ্চিমৰ পৰা পূবলৈ):' : 'X-Axis (West to East):'}</span>
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
                      <span>{lang === 'as' ? 'পশ্চিম কেম্পাছ (8%)' : 'West Campus (8%)'}</span>
                      <span>{lang === 'as' ? 'কেন্দ্ৰ (50%)' : 'Center (50%)'}</span>
                      <span>{lang === 'as' ? 'পূব কেম্পাছ (92%)' : 'East Campus (92%)'}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>{lang === 'as' ? 'Y-অক্ষ (উত্তৰৰ পৰা দক্ষিণলৈ):' : 'Y-Axis (North to South):'}</span>
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
                      <span>{lang === 'as' ? 'উত্তৰ কেম্পাছ (8%)' : 'North Campus (8%)'}</span>
                      <span>{lang === 'as' ? 'কেন্দ্ৰ (50%)' : 'Center (50%)'}</span>
                      <span>{lang === 'as' ? 'দক্ষিণ কেম্পাছ (92%)' : 'South Campus (92%)'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Mode B: Relative Distance & Direction from Department */
                <div className="space-y-3 p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'as' ? 'প্ৰসংগ বিভাগ / ভৱন:' : 'Reference Department / Building:'}</label>
                    <select
                      value={locRefDept}
                      onChange={(e) => setLocRefDept(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      {locationsList.map(l => (
                        <option key={l.id} value={l.id}>{lang === 'as' ? l.as : l.en} (X: {l.x ?? 50}%, Y: {l.y ?? 50}%)</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'as' ? 'দূৰত্ব (মিটাৰত):' : 'Distance (in meters):'}</label>
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
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'as' ? 'বিভাগৰ পৰা দিশ:' : 'Direction from Dept:'}</label>
                      <select
                        value={locDirection}
                        onChange={(e) => setLocDirection(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="North">{lang === 'as' ? 'উত্তৰ (North)' : 'North (উত্তৰ)'}</option>
                        <option value="North-East">{lang === 'as' ? 'উত্তৰ-পূব (North-East)' : 'North-East (উত্তৰ-পূব)'}</option>
                        <option value="East">{lang === 'as' ? 'পূব (East)' : 'East (পূব)'}</option>
                        <option value="South-East">{lang === 'as' ? 'দক্ষিণ-পূব (South-East)' : 'South-East (দক্ষিণ-পূব)'}</option>
                        <option value="South">{lang === 'as' ? 'দক্ষিণ (South)' : 'South (দক্ষিণ)'}</option>
                        <option value="South-West">{lang === 'as' ? 'দক্ষিণ-পশ্চিম (South-West)' : 'South-West (দক্ষিণ-পশ্চিম)'}</option>
                        <option value="West">{lang === 'as' ? 'পশ্চিম (West)' : 'West (পশ্চিম)'}</option>
                        <option value="North-West">{lang === 'as' ? 'উত্তৰ-পশ্চিম (North-West)' : 'North-West (উত্তৰ-পশ্চিম)'}</option>
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
                          🧭 <strong>{lang === 'as' ? 'গণনা কৰা অৱস্থান:' : 'Calculated:'}</strong> {locDistance}m {locDirection} of {refObj ? (lang === 'as' ? refObj.as : refObj.en) : 'Dept'}
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
                          <span>{lang === 'as' ? 'মেপ স্থানাংক পূৰ্বপ্ৰদৰ্শন' : 'Live Map Placement Coordinates'}</span>
                        </div>
                        <div className="text-emerald-400 font-mono mt-0.5">
                          X: {pX}% | Y: {pY}%
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lang === 'as' ? 'কেম্পাছৰ ইন্টৰেক্টিভ মেপত পোনপটীয়াকৈ প্ৰদৰ্শিত হ’ব।' : 'Will appear live on Interactive Campus Map.'}
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
                <span>{lang === 'as' ? '+ কেম্পাছ মেপত স্থান পিন কৰক' : '+ Create & Pin Place to Campus Map'}</span>
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
                    title={lang === 'as' ? 'স্থান মচি পেলাওক' : 'Delete location'}
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
            {lang === 'as' ? 'AI ট্ৰায়াজ আৰু স্বয়ংক্ৰিয় প্ৰেৰণ নীতি কনফিগাৰেচন' : 'AI Triage & Auto-Dispatch Policy Configuration'}
          </h4>
          <p className="text-xs text-slate-500 mb-6">
            {lang === 'as'
              ? 'নিৰ্ধাৰণ কৰক যে AI-য়ে কৰ্মীলৈ পোনে পোনে কাৰ্য্য আদেশ প্ৰেৰণ কৰিব নে প্ৰশাসকৰ অনুমোদনৰ বাবে অপেক্ষা কৰিব।'
              : 'Configure whether AI appoints maintenance crews directly or awaits administrative approval before dispatching work orders.'}
          </p>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="font-bold text-sm text-slate-800 block">
                {lang === 'as' ? 'কৰ্মীলৈ প্ৰত্যক্ষ AI স্বয়ংক্ৰিয় প্ৰেৰণ' : 'Direct AI Auto-Dispatch to Workers'}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {settings.aiAutoDispatch
                  ? (lang === 'as' ? 'সক্ৰিয়: AI-য়ে স্বয়ংক্ৰিয়ভাৱে শ্ৰেণীবিভাজন কৰি দায়িত্বপ্ৰাপ্ত কৰ্মীলৈ প্ৰেৰণ কৰে।' : 'Active: AI automatically classifies issues and directly dispatches them to assigned workers.')
                  : (lang === 'as' ? 'মেনুৱেল অনুমোদন: AI-য়ে বিশ্লেষণ কৰে, কিন্তু প্ৰশাসকে "অনুমোদন" নকৰালৈকে কাৰ্য্য আদেশ অমীমাংসিত থাকে।' : 'Manual Approval: AI analyzes issues, but work orders remain pending until Admin clicks "Approve Dispatch".')}
              </p>
            </div>

            <button
              onClick={handleToggleDispatchMode}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0 ${
                settings.aiAutoDispatch
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {settings.aiAutoDispatch ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  <span>{lang === 'as' ? 'স্বয়ংক্ৰিয় প্ৰেৰণ (অন)' : 'Direct Auto-Dispatch (ON)'}</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>{lang === 'as' ? 'প্ৰশাসকৰ অনুমতি (প্ৰয়োজন)' : 'Admin Permission (REQUIRED)'}</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
            <strong>{lang === 'as' ? 'কেম্পাছ প্ৰশাসনিক ইমেইল:' : 'Campus Administrative Email:'}</strong> {settings.adminEmail || 'admin@example.invalid'} ({lang === 'as' ? 'মূল উদ্ধাৰ ইমেইল' : 'Master recovery email'}).
          </div>

          {/* Security & Change Admin Password (Internal only) */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 mt-5">
            <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-sm mb-1">
              <Key className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'as' ? 'সুৰক্ষা আৰু প্ৰধান প্ৰশাসকৰ পাছৱৰ্ড পৰিৱৰ্তন' : 'Security & Change Master Administrator Password'}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'as' ? 'প্ৰশাসনিক মূল সুৰক্ষা পাছৱৰ্ড সলনি কৰক।' : 'Update administrative master security password. (Public forgot-password option is disabled for Admin security).'}
            </p>

            <form onSubmit={handleChangeAdminPassword} className="space-y-3 text-xs max-w-md">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'as' ? 'বৰ্তমান পাছৱৰ্ড:' : 'Current Password:'}</label>
                <input
                  type="password"
                  required
                  value={adminOldPassword}
                  onChange={(e) => setAdminOldPassword(e.target.value)}
                  placeholder={lang === 'as' ? 'বৰ্তমান পাছৱৰ্ড দিয়ক' : 'Enter current password'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'as' ? 'নতুন পাছৱৰ্ড:' : 'New Password:'}</label>
                <input
                  type="password"
                  required
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  placeholder={lang === 'as' ? 'নতুন পাছৱৰ্ড দিয়ক' : 'Enter new administrator password'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'as' ? 'নতুন পাছৱৰ্ড নিশ্চিত কৰক:' : 'Confirm New Password:'}</label>
                <input
                  type="password"
                  required
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.target.value)}
                  placeholder={lang === 'as' ? 'নতুন পাছৱৰ্ড পুনৰ লিখক' : 'Re-enter new password to verify'}
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
                {adminPwdLoading ? (lang === 'as' ? 'পাছৱৰ্ড সলনি হৈ আছে...' : 'Updating Password...') : (lang === 'as' ? 'নতুন পাছৱৰ্ড সংৰক্ষণ কৰক' : 'Save New Password')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= SECTION 5: LIVE RAW DATABASE VIEWER & MANAGER ================= */}
      {activeAdminTab === 'database' && (
        <div className="bg-slate-950 text-white rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl animate-fadeIn space-y-6">
          
          {/* Header & Path Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-800 gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-inner flex-shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-extrabold text-base text-white">
                    {t('dbConsoleTitle')}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{t('dbLiveStorage')}</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                  <span>{t('dbPhysicalFile')}:</span>
                  <code className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[11px]">
                    backend/data/issues.json
                  </code>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{t('dbPersistNotice')}</span>
                </div>
              </div>
            </div>

            {/* Controls & Export Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Toggle */}
              <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
                <button
                  onClick={() => setDbViewMode('visual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    dbViewMode === 'visual'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('dbViewInteractive')}</span>
                </button>
                <button
                  onClick={() => setDbViewMode('json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    dbViewMode === 'json'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{t('dbViewJson')}</span>
                </button>
              </div>

              {/* Refresh Database */}
              <button
                onClick={loadRawDatabase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('dbReloadBtn')}</span>
              </button>

              {/* 1-Click Export CSV (Grievances) */}
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5 cursor-pointer transition-all"
                title={lang === 'as' ? 'CSV প্ৰতিবেদন ডাউনলোড কৰক' : 'Download CSV Report'}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'as' ? 'CSV ৰপ্তানি' : 'Export CSV'}</span>
              </button>

              {/* 1-Click Export JSON (Full Database) */}
              <button
                onClick={handleExportJson}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1.5 cursor-pointer transition-all"
                title={lang === 'as' ? 'সম্পূৰ্ণ JSON ডাটাবেচ বেকআপ' : 'Full Database Backup JSON'}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>{lang === 'as' ? 'JSON বেকআপ' : 'Backup JSON'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div 
              onClick={() => { setDbCollection('issues'); setDbSearchQuery(''); }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                dbCollection === 'issues' ? 'bg-indigo-950/50 border-indigo-500/50 ring-1 ring-indigo-500/30' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{t('dbStatGrievances')}</span>
                <span>📋</span>
              </div>
              <div className="text-xl font-black text-white mt-1">
                {rawDbData?.issues?.length || 0}
              </div>
              <div className="text-[10px] text-indigo-400 mt-0.5">{t('dbStatWorkOrders')}</div>
            </div>

            <div 
              onClick={() => { setDbCollection('users'); setDbUserRoleFilter('all'); setDbSearchQuery(''); }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                dbCollection === 'users' && dbUserRoleFilter === 'all' ? 'bg-emerald-950/50 border-emerald-500/50 ring-1 ring-emerald-500/30' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{t('dbStatAllUsers')}</span>
                <span>👥</span>
              </div>
              <div className="text-xl font-black text-white mt-1">
                {rawDbData?.users?.length || 0}
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">{t('dbStatProfiles')}</div>
            </div>

            <div 
              onClick={() => { setDbCollection('users'); setDbUserRoleFilter('student'); setDbSearchQuery(''); }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                dbCollection === 'users' && dbUserRoleFilter === 'student' ? 'bg-cyan-950/50 border-cyan-500/50 ring-1 ring-cyan-500/30' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{t('dbStatStudents')}</span>
                <span>🎓</span>
              </div>
              <div className="text-xl font-black text-white mt-1">
                {(rawDbData?.users || []).filter(u => u.role === 'student').length}
              </div>
              <div className="text-[10px] text-cyan-400 mt-0.5">{t('dbStatVerified')}</div>
            </div>

            <div 
              onClick={() => { setDbCollection('users'); setDbUserRoleFilter('worker'); setDbSearchQuery(''); }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                dbCollection === 'users' && dbUserRoleFilter === 'worker' ? 'bg-amber-950/50 border-amber-500/50 ring-1 ring-amber-500/30' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{t('dbStatWorkers')}</span>
                <span>🔧</span>
              </div>
              <div className="text-xl font-black text-white mt-1">
                {(rawDbData?.users || []).filter(u => u.role === 'worker').length}
              </div>
              <div className="text-[10px] text-amber-400 mt-0.5">{t('dbStatTechnicians')}</div>
            </div>

            <div 
              onClick={() => { setDbCollection('studentRoster'); setDbSearchQuery(''); }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                dbCollection === 'studentRoster' ? 'bg-purple-950/50 border-purple-500/50 ring-1 ring-purple-500/30' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{t('dbStatRoster')}</span>
                <span>📜</span>
              </div>
              <div className="text-xl font-black text-white mt-1">
                {rawDbData?.studentRoster?.length || 0}
              </div>
              <div className="text-[10px] text-purple-400 mt-0.5">{t('dbStatPreAdmission')}</div>
            </div>

            <div 
              onClick={() => { setDbCollection('categories'); setDbSearchQuery(''); }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                dbCollection === 'categories' ? 'bg-rose-950/50 border-rose-500/50 ring-1 ring-rose-500/30' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>{t('dbStatCategories')}</span>
                <span>🏷️</span>
              </div>
              <div className="text-xl font-black text-white mt-1">
                {rawDbData?.categories?.length || 0}
              </div>
              <div className="text-[10px] text-rose-400 mt-0.5">{t('dbStatTaxonomy')}</div>
            </div>
          </div>

          {/* Collection Tab Bar & Search Toolbar */}
          <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Collection Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'issues', label: t('dbColIssues'), icon: '📋', count: rawDbData?.issues?.length },
                { id: 'users', label: t('dbColUsers'), icon: '👥', count: rawDbData?.users?.length },
                { id: 'studentRoster', label: t('dbColRoster'), icon: '📜', count: rawDbData?.studentRoster?.length },
                { id: 'categories', label: t('dbColCategories'), icon: '🏷️', count: rawDbData?.categories?.length },
                { id: 'locations', label: t('dbColLocations'), icon: '📍', count: rawDbData?.locations?.length },
                { id: 'settings', label: t('dbColSettings'), icon: '⚙️', count: 'Config' }
              ].map(col => (
                <button
                  key={col.id}
                  onClick={() => { setDbCollection(col.id); setDbSearchQuery(''); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    dbCollection === col.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{col.icon}</span>
                  <span>{col.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    dbCollection === col.id ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {col.count !== undefined ? col.count : '—'}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            {dbCollection !== 'settings' && (
              <div className="relative min-w-[200px] sm:min-w-[260px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={dbSearchQuery}
                  onChange={(e) => setDbSearchQuery(e.target.value)}
                  placeholder={lang === 'as' ? `${dbCollection} সংগ্ৰহত সন্ধান কৰক...` : `Search in ${dbCollection}...`}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                {dbSearchQuery && (
                  <button 
                    onClick={() => setDbSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sub-filters for Users */}
          {dbCollection === 'users' && dbViewMode === 'visual' && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-bold">{t('dbFilterRole')}:</span>
              {[
                { id: 'all', label: t('dbRoleAll') },
                { id: 'student', label: t('dbRoleStudent') },
                { id: 'worker', label: t('dbRoleWorker') }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setDbUserRoleFilter(r.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    dbUserRoleFilter === r.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* VISUAL MODE: Cards & Tables with DELETE BUTTON on every entry */}
          {dbViewMode === 'visual' ? (
            <div className="space-y-3">
              {/* === COLLECTION: ISSUES === */}
              {dbCollection === 'issues' && (() => {
                const list = (rawDbData?.issues || []).filter(item => {
                  if (!dbSearchQuery) return true;
                  const q = dbSearchQuery.toLowerCase();
                  return (
                    item.ticketId?.toLowerCase().includes(q) ||
                    item.title?.toLowerCase().includes(q) ||
                    item.location?.toLowerCase().includes(q) ||
                    item.status?.toLowerCase().includes(q) ||
                    item.address?.toLowerCase().includes(q)
                  );
                });

                if (list.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                      {t('dbNoRecords')}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
                    {list.map(issue => {
                      const bi = getIssueBilingual(issue);
                      return (
                      <div key={issue.id} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                              #{issue.ticketId}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              issue.status === 'resolved' ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700' :
                              issue.status === 'in_progress' ? 'bg-amber-900/80 text-amber-300 border border-amber-700' :
                              'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {issue.status === 'resolved' ? (lang === 'as' ? 'সমাধান হ’ল' : 'Resolved') :
                               issue.status === 'in_progress' ? (lang === 'as' ? 'চলি আছে' : 'In Progress') :
                               (lang === 'as' ? 'দাখিল কৰা হ’ল' : issue.status)}
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-white line-clamp-1 mb-1 font-assamese">
                            {lang === 'as' ? bi.titleAs : bi.titleEn}
                          </h5>

                          <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed font-assamese">
                            {lang === 'as' ? bi.descriptionAs : bi.descriptionEn}
                          </p>

                          <div className="text-[11px] text-slate-400 space-y-0.5 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                            <div className="truncate">📍 <strong className="text-slate-300">{lang === 'as' ? 'স্থান:' : 'Zone:'}</strong> {issue.location || 'Campus'}</div>
                            {issue.address && <div className="truncate text-amber-300">🏠 <strong className="text-slate-300">{lang === 'as' ? 'ঠিকনা:' : 'Address:'}</strong> {issue.address}</div>}
                            <div>🕒 <strong className="text-slate-300">{lang === 'as' ? 'তাৰিখ:' : 'Date:'}</strong> {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Recent'}</div>
                          </div>
                        </div>

                        {/* Action buttons for this specific entry */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setNewStatus(issue.status || 'in_progress');
                              setAssignedOfficer(issue.assignedOfficer || '');
                              setStatusModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{lang === 'as' ? 'স্থিতি সলনি কৰক' : 'Update Status'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteDbEntry('issues', issue, issue.ticketId)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>{t('dbDeleteBtn')}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                );
              })()}

              {/* === COLLECTION: USERS === */}
              {dbCollection === 'users' && (() => {
                let list = rawDbData?.users || [];
                if (dbUserRoleFilter !== 'all') {
                  list = list.filter(u => u.role === dbUserRoleFilter);
                }
                if (dbSearchQuery) {
                  const q = dbSearchQuery.toLowerCase();
                  list = list.filter(u => 
                    u.name?.toLowerCase().includes(q) ||
                    u.username?.toLowerCase().includes(q) ||
                    u.rollNo?.toLowerCase().includes(q) ||
                    u.department?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q)
                  );
                }

                if (list.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                      {t('dbNoRecords')}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
                    {list.map(user => (
                      <div key={user.id} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              user.role === 'admin' ? 'bg-indigo-950 text-indigo-300 border border-indigo-700' :
                              user.role === 'worker' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                              'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            }`}>
                              {user.role === 'admin' ? (lang === 'as' ? 'প্ৰধান এডমিন' : 'Admin') :
                               user.role === 'worker' ? (lang === 'as' ? 'কৰ্মী' : 'Worker') :
                               (lang === 'as' ? 'শিক্ষাৰ্থী' : 'Student')}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.isActive !== false ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                            }`}>
                              {user.isActive !== false ? t('statusActive') : t('statusSuspended')}
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-white truncate mb-0.5">
                            {user.name}
                          </h5>
                          <div className="font-mono text-xs text-slate-400 mb-2">
                            {lang === 'as' ? 'আইডি:' : 'ID:'} <strong className="text-slate-200">{user.username || user.rollNo}</strong>
                          </div>

                          <div className="text-[11px] text-slate-400 space-y-0.5 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            <div className="truncate">🏢 <strong className="text-slate-300">{lang === 'as' ? 'বিভাগ:' : 'Dept:'}</strong> {user.department || 'General'}</div>
                            <div className="truncate">📞 <strong className="text-slate-300">{lang === 'as' ? 'ফোন:' : 'Phone:'}</strong> {user.phone || '—'}</div>
                            <div className="truncate">✉️ <strong className="text-slate-300">{lang === 'as' ? 'ইমেইল:' : 'Email:'}</strong> {user.email || '—'}</div>
                            <div>🔑 <strong className="text-slate-300">{lang === 'as' ? 'পাছৱৰ্ড:' : 'Password:'}</strong> <span className="font-mono text-slate-500">••••••••</span></div>
                          </div>
                        </div>

                        {/* Actions on this entry */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{user.role === 'admin' ? (lang === 'as' ? 'এডমিন আইডি আৰু পাছৱৰ্ড সলনি' : 'Edit Admin ID & Password') : (lang === 'as' ? 'প্ৰফাইল সম্পাদনা' : 'Edit Profile')}</span>
                          </button>

                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all cursor-pointer flex items-center space-x-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>{t('dbDeleteBtn')}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* === COLLECTION: STUDENT ROSTER === */}
              {dbCollection === 'studentRoster' && (() => {
                let list = rawDbData?.studentRoster || [];
                if (dbSearchQuery) {
                  const q = dbSearchQuery.toLowerCase();
                  list = list.filter(r => 
                    r.rollNo?.toLowerCase().includes(q) ||
                    r.name?.toLowerCase().includes(q) ||
                    r.department?.toLowerCase().includes(q)
                  );
                }

                if (list.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                      {t('dbNoRecords')}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
                    {list.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                              {item.rollNo}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.isClaimed ? 'bg-slate-800 text-slate-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {item.isClaimed ? t('statusClaimed') : t('statusUnclaimed')}
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-white truncate mb-1">
                            {item.name}
                          </h5>

                          <div className="text-[11px] text-slate-400 space-y-0.5 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                            <div className="truncate">🏛️ <strong className="text-slate-300">{lang === 'as' ? 'বিভাগ:' : 'Dept:'}</strong> {item.department || 'General Academic'}</div>
                            <div className="truncate">📞 <strong className="text-slate-300">{lang === 'as' ? 'ফোন:' : 'Phone:'}</strong> {item.phone || '—'}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleEditRoster(item)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{lang === 'as' ? 'ৰোষ্টাৰ সম্পাদনা' : 'Edit Roster'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteRoster(item)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>{t('dbDeleteBtn')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* === COLLECTION: CATEGORIES === */}
              {dbCollection === 'categories' && (() => {
                let list = rawDbData?.categories || [];
                if (dbSearchQuery) {
                  const q = dbSearchQuery.toLowerCase();
                  list = list.filter(c => 
                    c.en?.toLowerCase().includes(q) ||
                    c.as?.toLowerCase().includes(q) ||
                    c.defaultDept?.toLowerCase().includes(q)
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
                    {list.map(cat => (
                      <div key={cat.id} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between">
                        <div>
                          <div className="font-mono text-[10px] text-slate-500 mb-1">ID: {cat.id}</div>
                          <h5 className="font-bold text-sm text-white mb-0.5">{cat.en}</h5>
                          <div className="text-xs text-emerald-400 font-assamese mb-2">{cat.as}</div>
                          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                            🏢 {lang === 'as' ? 'দায়িত্বপ্ৰাপ্ত বিভাগ:' : 'Assigned Dept:'} <strong className="text-slate-200">{cat.defaultDept}</strong>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end mt-3">
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>{lang === 'as' ? 'বিভাগ মচি পেলাওক' : 'Delete Category'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* === COLLECTION: LOCATIONS === */}
              {dbCollection === 'locations' && (() => {
                let list = rawDbData?.locations || [];
                if (dbSearchQuery) {
                  const q = dbSearchQuery.toLowerCase();
                  list = list.filter(l => 
                    l.en?.toLowerCase().includes(q) ||
                    l.as?.toLowerCase().includes(q) ||
                    l.refDept?.toLowerCase().includes(q)
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
                    {list.map(loc => (
                      <div key={loc.id} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-mono text-[10px] text-slate-500">ID: {loc.id}</span>
                            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                              X: {loc.x}%, Y: {loc.y}%
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-white mb-0.5">{loc.en}</h5>
                          <div className="text-xs text-emerald-400 font-assamese mb-2">{loc.as}</div>
                          {loc.refDept && (
                            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                              📍 {lang === 'as' ? 'আপেক্ষিক অৱস্থান:' : 'Relative:'} {loc.distanceMeters}m {loc.direction} from {loc.refDept}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end mt-3">
                          <button
                            onClick={() => handleDeleteLocation(loc.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>{lang === 'as' ? 'স্থান মচি পেলাওক' : 'Delete Location'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* === COLLECTION: SETTINGS === */}
              {dbCollection === 'settings' && (
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 max-w-xl space-y-4">
                  <h5 className="font-bold text-sm text-white">{lang === 'as' ? 'ছিষ্টেম ছেটিংছ আৰু নীতিসমূহ' : 'System Settings & Policies'}</h5>
                  
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-white">{lang === 'as' ? 'কৰ্মীলৈ AI স্বয়ংক্ৰিয় প্ৰেৰণ' : 'AI Auto-Dispatch to Workers'}</div>
                      <div className="text-[11px] text-slate-400">{lang === 'as' ? 'ডাটাবেচ ডিস্কৰ বৰ্তমান ছেটিংছ' : 'Current setting in database disk'}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      rawDbData?.settings?.aiAutoDispatch ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'
                    }`}>
                      {rawDbData?.settings?.aiAutoDispatch ? (lang === 'as' ? 'স্বয়ংক্ৰিয় প্ৰেৰণ সক্ৰিয়' : 'Auto-Dispatch ON') : (lang === 'as' ? 'অনুমোদন প্ৰয়োজন' : 'Approval Required')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-xs text-white mb-1">{lang === 'as' ? 'কেম্পাছৰ নাম' : 'Campus Name'}</div>
                    <div className="text-xs text-slate-300 font-mono">
                      EN: {rawDbData?.settings?.campusName?.en || 'Assam State University'}
                    </div>
                    <div className="text-xs text-emerald-400 font-assamese mt-0.5">
                      AS: {rawDbData?.settings?.campusName?.as || 'অসম ৰাজ্যিক বিশ্ববিদ্যালয়'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-xs text-white mb-1">{lang === 'as' ? 'প্ৰশাসনিক মূল ইমেইল' : 'Administrative Master Email'}</div>
                    <div className="text-xs text-slate-300 font-mono">
                      {rawDbData?.settings?.adminEmail || 'admin@example.invalid'}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* RAW JSON SYNTAX VIEWER */
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 max-h-[550px] overflow-y-auto font-mono text-xs text-emerald-300 leading-relaxed shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                <span>{lang === 'as' ? 'প্ৰদৰ্শিত সংগ্ৰহ:' : 'Showing collection:'} <strong className="text-white">{dbCollection}</strong></span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(rawDbData?.[dbCollection], null, 2));
                    showToast(lang === 'as' ? 'JSON ক্লিপব’ৰ্ডত কপি হ’ল!' : 'JSON copied to clipboard!');
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold cursor-pointer"
                >
                  {lang === 'as' ? 'JSON কপি কৰক' : 'Copy JSON'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap">
                {rawDbData ? JSON.stringify(rawDbData[dbCollection], null, 2) : (lang === 'as' ? 'ডাটাবেচ লোড হৈ আছে...' : 'Loading database...')}
              </pre>
            </div>
          )}

        </div>
      )}

      {/* ================= MODAL: STATUS UPDATE ================= */}
      {statusModalOpen && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              {lang === 'as' ? `কাৰ্য্য আদেশ #${selectedIssue.ticketId} স্থিতি সলনি` : `Update Work Order #${selectedIssue.ticketId}`}
            </h4>

            <form onSubmit={handleSaveStatus} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'নতুন স্থিতি' : 'New Status'}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="investigating">{lang === 'as' ? 'তদন্ত চলি আছে' : 'Investigating'}</option>
                  <option value="in_progress">{lang === 'as' ? 'মেৰামতি চলি আছে' : 'In Progress'}</option>
                  <option value="assigned">{lang === 'as' ? 'কাৰিকৰী দল প্ৰেৰিত' : 'Assigned to Crew'}</option>
                  <option value="resolved">{lang === 'as' ? 'সমাধান আৰু প্ৰমাণিত' : 'Resolved & Verified'}</option>
                  <option value="closed">{lang === 'as' ? 'বন্ধ কৰা হ’ল' : 'Closed'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'দায়িত্বপ্ৰাপ্ত কাৰিকৰী বিষয়া / কৰ্মী' : 'Assigned Officer / Crew'}
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
                  {lang === 'as' ? 'সমাধান / কাৰিকৰী ফিল্ড টোকা' : 'Resolution / Technical Field Notes'}
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder={lang === 'as' ? 'পদক্ষেপৰ সবিশেষ লিখক...' : 'Enter details of action taken...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium font-assamese"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 cursor-pointer"
                >
                  {lang === 'as' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-indigo-600 text-white cursor-pointer"
                >
                  {lang === 'as' ? 'পৰিৱৰ্তন সংৰক্ষণ কৰক' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE WORKER ================= */}
      {workerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              {lang === 'as' ? 'নতুন মেৰামতি কৰ্মী / কাৰিকৰ একাউণ্ট সৃষ্টি কৰক' : 'Create New Worker / Maintenance Account'}
            </h4>

            <form onSubmit={handleCreateWorker} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'কৰ্মী আইডি' : 'Worker ID'} <span className="text-rose-500">*</span>
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
                  {lang === 'as' ? 'কৰ্মীৰ সম্পূৰ্ণ নাম' : 'Worker Full Name'} <span className="text-rose-500">*</span>
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
                  {lang === 'as' ? 'দায়িত্বপ্ৰাপ্ত বিভাগ / কাৰ্য্যক্ষেত্ৰ' : 'Department / Trade'}
                </label>
                <select
                  value={workerDept}
                  onChange={(e) => setWorkerDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Electrical Maintenance">{lang === 'as' ? 'বৈদ্যুতিক মেৰামতি (Electrical)' : 'Electrical Maintenance'}</option>
                  <option value="Water Works & Sanitation">{lang === 'as' ? 'পানী যোগান আৰু অনাময় (Water & Sanitation)' : 'Water Works & Sanitation'}</option>
                  <option value="Civil Infrastructure">{lang === 'as' ? 'অসামৰিক আন্তঃগাঁথনি (Civil Infrastructure)' : 'Civil Infrastructure'}</option>
                  <option value="Computer & Network Center">{lang === 'as' ? 'কম্পিউটাৰ আৰু নেটৱৰ্ক কেন্দ্ৰ (IT & Network)' : 'Computer & Network Center'}</option>
                  <option value="Campus Hygiene & Sanitation">{lang === 'as' ? 'কেম্পাছ স্বচ্ছতা আৰু পৰিষ্কাৰ (Hygiene)' : 'Campus Hygiene & Sanitation'}</option>
                  <option value="Campus Security Unit">{lang === 'as' ? 'কেম্পাছ সুৰক্ষা বাহিনী (Security)' : 'Campus Security Unit'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'মোবাইল / ফোন নম্বৰ' : 'Mobile / Phone Number'} <span className="text-rose-500">*</span>
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
                  {lang === 'as' ? 'অস্থায়ী পাছৱৰ্ড' : 'Temporary Password'} <span className="text-rose-500">*</span>
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
                  {lang === 'as' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-amber-600 text-white cursor-pointer"
                >
                  {lang === 'as' ? 'কৰ্মী আইডি সৃষ্টি কৰক' : 'Create Worker ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD ROSTER ENTRY ================= */}
      {rosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              {lang === 'as' ? 'ভৰ্তি ৰোষ্টাৰত ছাত্ৰ-ছাত্ৰী যোগ কৰক' : 'Add Student to Admission Roster'}
            </h4>

            <form onSubmit={handleAddRoster} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'ভৰ্তি ৰোল নম্বৰ' : 'Unique Admission Roll No.'} <span className="text-rose-500">*</span>
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
                  {lang === 'as' ? 'সম্পূৰ্ণ নাম (ভৰ্তি নথি অনুসৰি)' : 'Full Name (As in Admission Record)'} <span className="text-rose-500">*</span>
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
                  {lang === 'as' ? 'শৈক্ষিক বিভাগ' : 'Department'}
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
                  {lang === 'as' ? 'শিক্ষাৰ্থীৰ ফোন নম্বৰ' : 'Student Phone'}
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
                  {lang === 'as' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-emerald-600 text-white cursor-pointer"
                >
                  {lang === 'as' ? 'ৰোষ্টাৰত সংৰক্ষণ কৰক' : 'Save to Roster'}
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
                <span>{lang === 'as' ? 'জাননী প্ৰিণ্ট কৰক' : 'Print Notice'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyNotice}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-indigo-600" />
                  <span>{copied ? (lang === 'as' ? '✓ কপি হ’ল!' : '✓ Copied!') : (lang === 'as' ? 'জাননী কপি কৰক' : 'Copy Notice')}</span>
                </button>
                
                <button
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                >
                  {lang === 'as' ? 'বন্ধ কৰক' : 'Close'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT USER (ADMIN, STUDENT OR WORKER) ================= */}
      {editUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h4 className="text-base font-extrabold text-slate-900">
                  {lang === 'as'
                    ? (editingUser.role === 'student' ? 'শিক্ষাৰ্থী প্ৰফাইল সম্পাদনা' : editingUser.role === 'admin' ? 'প্ৰধান প্ৰশাসকৰ তথ্য সম্পাদনা' : 'কাৰিকৰী কৰ্মী প্ৰফাইল সম্পাদনা')
                    : (`Edit ${editingUser.role === 'student' ? 'Student' : editingUser.role === 'admin' ? 'Administrator' : 'Worker'} Profile`)}
                </h4>
              </div>
              <button
                onClick={() => setEditUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'সম্পূৰ্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'as'
                      ? (editingUser.role === 'student' ? 'ভৰ্তি ৰোল নম্বৰ' : editingUser.role === 'admin' ? 'এডমিন ইউজাৰনেম / আইডি' : 'কৰ্মী আইডি')
                      : (editingUser.role === 'student' ? 'Admission Roll No.' : editingUser.role === 'admin' ? 'Admin Username / ID' : 'Worker ID')}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.role === 'student' ? (editingUser.rollNo || editingUser.username || '') : (editingUser.username || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingUser.role === 'student') {
                        setEditingUser({ ...editingUser, rollNo: val, username: val });
                      } else {
                        setEditingUser({ ...editingUser, username: val });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'as'
                      ? (editingUser.role === 'admin' ? 'প্ৰশাসনিক পদবী' : 'বিভাগ')
                      : (editingUser.role === 'admin' ? 'Administrative Title' : 'Department')}
                  </label>
                  <input
                    type="text"
                    value={editingUser.department || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'as' ? 'ফোন নম্বৰ' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'as' ? 'ইমেইল ঠিকনা' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    placeholder="user@campus.edu.in"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as'
                    ? (editingUser.role === 'admin' ? 'নতুন এডমিন পাছৱৰ্ড (অপৰিৱৰ্তিত ৰাখিবলৈ খালী এৰক)' : 'পাছৱৰ্ড সলনি কৰক (অপৰিৱৰ্তিত ৰাখিবলৈ খালী এৰক)')
                    : (editingUser.role === 'admin' ? 'Change Admin Password (Leave blank to keep existing)' : 'Reset Password (Leave blank to keep existing)')}
                </label>
                <input
                  type="text"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  placeholder={editingUser.role === 'admin' ? (lang === 'as' ? 'নতুন এডমিন পাছৱৰ্ড লিখক' : 'Enter new admin password') : (lang === 'as' ? 'নতুন পাছৱৰ্ড লিখক' : 'Enter new password if changing')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-mono"
                />
              </div>

              {editingUser.role === 'student' && (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="edit_is_active"
                    checked={editingUser.isActive !== false}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <label htmlFor="edit_is_active" className="font-bold text-slate-700 cursor-pointer">
                    {lang === 'as' ? 'প’ৰ্টেল প্ৰৱেশাধিকাৰ সক্ৰিয় (Active Account)' : 'Portal Access Enabled (Active Account)'}
                  </label>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setEditUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {lang === 'as' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {lang === 'as' ? 'প্ৰফাইল সংৰক্ষণ কৰক' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ROSTER ENTRY ================= */}
      {editRosterModalOpen && editingRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-purple-600" />
                <h4 className="text-base font-extrabold text-slate-900">
                  {lang === 'as' ? 'ভৰ্তি ৰোষ্টাৰ প্ৰৱিষ্টি সম্পাদনা' : 'Edit Pre-Admission Roster Entry'}
                </h4>
              </div>
              <button
                onClick={() => setEditRosterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditRoster} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'ভৰ্তি ৰোল নম্বৰ' : 'Admission Roll No.'}
                </label>
                <input
                  type="text"
                  disabled
                  value={editingRoster.rollNo || ''}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-100 font-mono font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'শিক্ষাৰ্থীৰ সম্পূৰ্ণ নাম' : 'Student Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={editingRoster.name || ''}
                  onChange={(e) => setEditingRoster({ ...editingRoster, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'শৈক্ষিক বিভাগ' : 'Academic Department'}
                </label>
                <input
                  type="text"
                  required
                  value={editingRoster.department || ''}
                  onChange={(e) => setEditingRoster({ ...editingRoster, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'ফোন নম্বৰ' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={editingRoster.phone || ''}
                  onChange={(e) => setEditingRoster({ ...editingRoster, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="edit_roster_claimed"
                  checked={editingRoster.isClaimed === true}
                  onChange={(e) => setEditingRoster({ ...editingRoster, isClaimed: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <label htmlFor="edit_roster_claimed" className="font-bold text-slate-700 cursor-pointer">
                  {lang === 'as' ? 'পঞ্জীয়ন সম্পন্ন বুলি চিহ্নিত (Claimed Account)' : 'Marked as Claimed / Registered'}
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setEditRosterModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {lang === 'as' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30 transition-all cursor-pointer"
                >
                  {lang === 'as' ? 'ৰোষ্টাৰ সংৰক্ষণ কৰক' : 'Save Roster Entry'}
                </button>
              </div>
            </form>
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
                {confirmModal.confirmText || (lang === 'as' ? 'নিশ্চিত কৰক' : 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
