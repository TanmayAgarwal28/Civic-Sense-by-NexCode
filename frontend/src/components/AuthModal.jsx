import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { loginUser, registerStudent, resetPasswordWithVerification } from '../api.js';
import { 
  X, UserCheck, ShieldCheck, Wrench, GraduationCap, 
  Key, Lock, Mail, Phone, CheckCircle2, AlertCircle, ArrowRight,
  Eye, EyeOff
} from 'lucide-react';

export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const { lang, t } = useLanguage();

  const [activeRole, setActiveRole] = useState('student'); // 'student', 'worker', 'admin'
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'register', 'forgot'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password visibility toggles ("see button")
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Student Register form state
  const [regRollNo, setRegRollNo] = useState('');
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Forgot Password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotWorkerId, setForgotWorkerId] = useState('');
  const [forgotRollNo, setForgotRollNo] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setLoading(true);
      const res = await loginUser({
        username: loginUsername.trim(),
        password: loginPassword,
        role: activeRole
      });

      if (res.success) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setLoading(true);
      const res = await registerStudent({
        rollNo: regRollNo.trim(),
        name: regName.trim(),
        password: regPassword,
        phone: regPhone.trim(),
        email: regEmail.trim()
      });

      if (res.success) {
        setSuccessMsg(lang === 'as' ? 'পঞ্জীয়ন সফলতাৰে সম্পন্ন হ’ল! এতিয়া লগইন কৰা হৈছে...' : 'Student verified & registered successfully! Logging in...');
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setLoading(true);
      const res = await resetPasswordWithVerification({
        role: activeRole,
        email: forgotEmail.trim(),
        workerId: forgotWorkerId.trim(),
        rollNo: forgotRollNo.trim(),
        phone: forgotPhone.trim(),
        newPassword
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setActiveTab('login');
          setLoginPassword(newPassword);
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-300 max-w-lg w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-scaleUp">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with CivicSense Brand Logo */}
        <div className="mb-5 flex items-center space-x-3.5">
          <img 
            src="/civicsense-icon.png" 
            alt="CivicSense Emblem" 
            className="w-11 h-11 rounded-full object-contain drop-shadow-md flex-shrink-0" 
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {lang === 'as' ? 'চিভিকচেন্স পৰ্টেল' : 'CivicSense'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {lang === 'as' ? 'সুৰক্ষিত প্ৰৱেশ' : 'Secure Login'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {lang === 'as' ? 'অসম ৰাজ্যিক বিশ্ববিদ্যালয় • চৌহদ প্ৰৱেশাধিকাৰ' : 'Assam State University • Campus Redressal Portal'}
            </p>
          </div>
        </div>

        {/* 3 Role Selection Pills */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => { setActiveRole('student'); setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
              activeRole === 'student'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'as' ? 'ছাত্ৰ-ছাত্ৰী' : 'Student'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('worker'); setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
              activeRole === 'worker'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>{lang === 'as' ? 'কৰ্মী / টেকনিচিয়ান' : 'Worker'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('admin'); setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
              activeRole === 'admin'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'as' ? 'প্ৰশাসক' : 'Admin'}</span>
          </button>
        </div>

        {/* Sub-tab selection (Sign In / Register / Forgot Password) */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-4 pb-1 text-xs">
          <div className="flex space-x-3">
            <button
              onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`pb-1 font-bold border-b-2 transition-all ${
                activeTab === 'login'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'as' ? 'লগইন' : 'Sign In'}
            </button>

            {/* Students can create their ID; Workers are created only by Admin */}
            {activeRole === 'student' && (
              <button
                onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`pb-1 font-bold border-b-2 transition-all ${
                  activeTab === 'register'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang === 'as' ? 'নতুন ছাত্ৰ পঞ্জীয়ন' : 'Create Student ID'}
              </button>
            )}
          </div>

          {activeRole !== 'admin' && (
            <button
              onClick={() => { setActiveTab('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`pb-1 font-semibold text-[11px] transition-all ${
                activeTab === 'forgot'
                  ? 'text-rose-600 font-bold border-b-2 border-rose-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {lang === 'as' ? 'পাছৱৰ্ড পাহৰিলে?' : 'Forgot Password?'}
            </button>
          )}
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= TAB 1: LOGIN ================= */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {activeRole === 'admin' && (lang === 'as' ? 'প্ৰশাসক আই-ডি' : 'Admin ID / Username')}
                {activeRole === 'worker' && (lang === 'as' ? 'কৰ্মী পৰিচয় নম্বৰ (যেনে WRK-ELEC01)' : 'Worker ID (e.g. WRK-ELEC01)')}
                {activeRole === 'student' && (lang === 'as' ? 'নামভৰ্তি ৰোল নম্বৰ' : 'Admission Roll No. / Student ID')}
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder={
                  activeRole === 'admin'
                    ? (lang === 'as' ? 'প্ৰশাসক আই-ডি দিয়ক' : 'Enter Admin ID')
                    : activeRole === 'worker'
                    ? (lang === 'as' ? 'কৰ্মী আই-ডি দিয়ক' : 'Enter Worker ID')
                    : (lang === 'as' ? 'যেনে ASU2026-101' : 'e.g. ASU2026-101')
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  {lang === 'as' ? 'গোপন পাছৱৰ্ড' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(prev => !prev)}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-1 cursor-pointer select-none"
                  tabIndex={-1}
                >
                  {showLoginPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{lang === 'as' ? 'লুকুৱাওক' : 'Hide'}</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'as' ? 'পাছৱৰ্ড চাওক' : 'Show'}</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <span>
                {loading
                  ? (lang === 'as' ? 'যাচাই কৰা হৈছে...' : 'Verifying...')
                  : (lang === 'as'
                      ? `${activeRole === 'admin' ? 'প্ৰশাসক' : activeRole === 'worker' ? 'কৰ্মী' : 'ছাত্ৰ'} হিচাপে প্ৰৱেশ কৰক`
                      : `Sign In as ${activeRole.toUpperCase()}`)}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* ================= TAB 2: STUDENT REGISTRATION (PRE-ADMISSION VERIFICATION) ================= */}
        {activeTab === 'register' && activeRole === 'student' && (
          <form onSubmit={handleRegisterStudent} className="space-y-3 text-xs">
            
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
              <strong>{lang === 'as' ? 'চৌহদ নামভৰ্তি সত্যাপন:' : 'Campus Admission Verification:'}</strong>{' '}
              {lang === 'as' 
                ? 'প্ৰশাসকে পঞ্জীয়ন কৰা চৰকাৰী নামভৰ্তি ৰোল নম্বৰ আৰু সম্পূৰ্ণ নাম প্ৰৱিষ্ট কৰক। ৰষ্টাৰৰ সৈতে মিল থাকিলে আপোনাৰ আইডি সক্ৰিয় হ’ব!' 
                : 'Enter the official Admission Roll No. and Full Name registered by campus admin. If they match the roster, your student ID will be activated!'}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'নামভৰ্তি ৰোল নং' : 'Admission Roll No.'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regRollNo}
                  onChange={(e) => setRegRollNo(e.target.value)}
                  placeholder="e.g. ASU2026-106"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'সম্পূৰ্ণ নাম (নামভৰ্তি অনুসৰি)' : 'Full Name (As in Admission)'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={lang === 'as' ? 'যেনে: প্ৰাৰ্থীৰ নাম' : 'e.g. Demo Applicant'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  {lang === 'as' ? 'একাউণ্টৰ পাছৱৰ্ড সৃষ্টি কৰক' : 'Create Account Password'} <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowRegPassword(prev => !prev)}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-1 cursor-pointer select-none"
                  tabIndex={-1}
                >
                  {showRegPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{lang === 'as' ? 'লুকুৱাওক' : 'Hide'}</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'as' ? 'পাছৱৰ্ড চাওক' : 'Show'}</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder={lang === 'as' ? 'সুৰক্ষিত পাছৱৰ্ড বাছনি কৰক' : 'Choose a secure password'}
                  className="w-full pl-3 py-2 pr-10 rounded-xl border border-slate-300 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'ম’বাইল / ফোন নং' : 'Mobile / Phone No.'}
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0000000000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'ছাত্ৰ ইমেইল' : 'Student Email'}
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rohan@student.campus.edu.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 mt-2"
            >
              <span>{loading ? (lang === 'as' ? 'সত্যাপন কৰা হৈছে...' : 'Verifying Admission...') : (lang === 'as' ? 'নামভৰ্তি পৰীক্ষা কৰি আইডি সৃষ্টি কৰক' : 'Verify Admission & Create Student ID')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* ================= TAB 3: FORGOT PASSWORD ================= */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-3.5 text-xs">
            
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
              {activeRole === 'admin' && (lang === 'as' ? 'প্ৰশাসক পুনৰুদ্ধাৰ: চৰকাৰী বিশ্ববিদ্যালয় প্ৰশাসন ইমেইল দিয়ক।' : 'Admin Recovery: Enter the official university administration email address.')}
              {activeRole === 'worker' && (lang === 'as' ? 'কৰ্মী পুনৰুদ্ধাৰ: আপোনাৰ কৰ্মী পৰিচয় নম্বৰ আৰু পঞ্জীভুক্ত ম’বাইল নম্বৰ দিয়ক।' : 'Worker Recovery: Enter your assigned Worker ID and registered mobile number.')}
              {activeRole === 'student' && (lang === 'as' ? 'ছাত্ৰ পুনৰুদ্ধাৰ: আপোনাৰ নামভৰ্তি ৰোল নম্বৰ আৰু পঞ্জীভুক্ত ম’বাইল নম্বৰ দিয়ক।' : 'Student Recovery: Enter your unique Admission Roll No. and registered mobile number.')}
            </div>

            {/* Admin Verification Field */}
            {activeRole === 'admin' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'as' ? 'চৰকাৰী বিশ্ববিদ্যালয় প্ৰশাসন ইমেইল' : 'Official Campus Administrative Email'}
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@example.invalid"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>
            )}

            {/* Worker Verification Fields */}
            {activeRole === 'worker' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'as' ? 'কৰ্মী পৰিচয় নম্বৰ' : 'Worker ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotWorkerId}
                    onChange={(e) => setForgotWorkerId(e.target.value)}
                    placeholder="WRK-ELEC01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'as' ? 'পঞ্জীভুক্ত ম’বাইল নং' : 'Registered Mobile No.'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="0000000000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Student Verification Fields */}
            {activeRole === 'student' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'as' ? 'নামভৰ্তি ৰোল নং' : 'Admission Roll No.'}
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotRollNo}
                    onChange={(e) => setForgotRollNo(e.target.value)}
                    placeholder="ASU2026-101"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'as' ? 'পঞ্জীভুক্ত ম’বাইল নং' : 'Registered Mobile No.'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="0000000000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>
            )}

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  {lang === 'as' ? 'নতুন পাছৱৰ্ড প্ৰৱিষ্ট কৰক' : 'Enter New Password'} <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(prev => !prev)}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-1 cursor-pointer select-none"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{lang === 'as' ? 'লুকুৱাওক' : 'Hide'}</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'as' ? 'পাছৱৰ্ড চাওক' : 'Show'}</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={lang === 'as' ? 'নূন্যতম ৪ টা আখৰ' : 'Minimum 4 characters'}
                  className="w-full pl-3 py-2 pr-10 rounded-xl border border-slate-300 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <span>{loading ? (lang === 'as' ? 'যাচাই কৰি আপডেট কৰা হৈছে...' : 'Verifying & Updating...') : (lang === 'as' ? 'পাছৱৰ্ড সলনি কৰক' : 'Reset Password')}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
