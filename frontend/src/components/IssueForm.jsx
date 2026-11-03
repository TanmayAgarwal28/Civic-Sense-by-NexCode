import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { submitIssue, preCheckTriage, fetchCategories, fetchLocations } from '../api.js';
import { AssameseKeyboardHelper } from './AssameseKeyboardHelper.jsx';
import { Sparkles, Image as ImageIcon, Mic, MapPin, Send, AlertCircle, Home, CheckCircle2, RefreshCw } from 'lucide-react';

export function IssueForm({ user, onIssueCreated, onDuplicateDetected }) {
  const { lang, t } = useLanguage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(''); // Dedicated Address field
  const [location, setLocation] = useState('Boys Hostels (Hostels 1-5)');
  const [zoneId, setZoneId] = useState('hostel_boys');
  const [category, setCategory] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState(user?.name || 'Student Member');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Dynamic Categories and Locations from backend
  const [categoriesList, setCategoriesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [preCheckLoading, setPreCheckLoading] = useState(false);
  const [preCheckData, setPreCheckData] = useState(null);
  const [showKeyboardHelper, setShowKeyboardHelper] = useState(false);
  const [activeInputFocus, setActiveInputFocus] = useState('title'); // 'title' or 'desc' or 'address'
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user?.name) {
      setReporterName(user.name);
    }
  }, [user]);

  // Load dynamic categories & locations
  useEffect(() => {
    const loadDynamicMeta = async () => {
      try {
        const [catRes, locRes] = await Promise.all([fetchCategories(), fetchLocations()]);
        if (catRes.data) setCategoriesList(catRes.data);
        if (locRes.data) {
          setLocationsList(locRes.data);
          if (locRes.data.length > 0) {
            setZoneId(locRes.data[0].id);
            setLocation(locRes.data[0].en);
          }
        }
      } catch (e) {
        console.warn('Failed to load dynamic categories/locations:', e);
      }
    };
    loadDynamicMeta();
  }, []);

  // Debounced AI Pre-Check
  useEffect(() => {
    if (title.length > 5 || description.length > 10) {
      const handler = setTimeout(() => {
        triggerPreCheck(title, description, location, address);
      }, 700);
      return () => clearTimeout(handler);
    }
  }, [title, description, location, address]);

  const triggerPreCheck = async (tText, dText, loc, addr) => {
    try {
      setPreCheckLoading(true);
      const fd = new FormData();
      fd.append('title', tText);
      fd.append('description', dText);
      fd.append('location', `${loc} ${addr}`);
      if (category) fd.append('category', category);
      if (imageFile) fd.append('image', imageFile);

      const res = await preCheckTriage(fd);
      if (res.success) {
        setPreCheckData(res.data);
      }
    } catch (err) {
      console.warn('Pre-check error:', err);
    } finally {
      setPreCheckLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const selectSamplePhoto = (type) => {
    const samples = {
      water: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      electric: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      cooler: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80'
    };
    setImagePreview(samples[type]);
    setImageFile({ originalname: `${type}_hazard_proof.jpg` });
  };

  const handleInsertChar = (char) => {
    if (activeInputFocus === 'title') {
      setTitle(prev => prev + char);
    } else if (activeInputFocus === 'address') {
      setAddress(prev => prev + char);
    } else {
      setDescription(prev => prev + char);
    }
  };

  const handleInsertPhrase = (phrase) => {
    if (activeInputFocus === 'title') {
      setTitle(phrase);
    } else if (activeInputFocus === 'address') {
      setAddress(phrase);
    } else {
      setDescription(prev => (prev ? prev + ' ' + phrase : phrase));
    }
  };

  const handleVoiceSimulation = () => {
    if (lang === 'as') {
      setTitle('হোষ্টেল ৪-ৰ ৩য় মহলাত পানীৰ পাইপ ফাটিছে');
      setDescription('হোষ্টেল ৪-ৰ ৩য় মহলাৰ বাথৰুমত পানীৰ পাইপ ফাটি পানী ওলাই আছে আৰু বিজুলীৰ ছুইটচৰ ওচৰলৈ গৈছে। অতি সোনকালে কাৰিকৰী দল প্ৰেৰণ কৰক।');
      setAddress('হোষ্টেল ৪, ৩য় মহলা, বাথৰুম নং ৩০২, পূব দিশ');
      setLocation('Boys Hostels (Hostels 1-5)');
      setZoneId('hostel_boys');
    } else {
      setTitle('Water pipe bursting near electrical switch in Hostel 4');
      setDescription('Water leaking continuously from washroom tap on 3rd floor of Boys Hostel 4, dangerously close to main switchboard.');
      setAddress('Boys Hostel 4, 3rd Floor, Washroom 302, East Wing');
      setLocation('Boys Hostels (Hostels 1-5)');
      setZoneId('hostel_boys');
    }
  };

  const handleZoneChange = (e) => {
    const selectedId = e.target.value;
    setZoneId(selectedId);
    const found = locationsList.find(l => l.id === selectedId);
    if (found) {
      setLocation(found.en);
    }
  };

  const handleSubmit = async (e, forceIgnore = false) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!title.trim() || !description.trim()) {
      setFormError(lang === 'as' ? 'অনুগ্ৰহ কৰি শিৰোনাম আৰু বিৱৰণ উল্লেখ কৰক।' : 'Please enter grievance title and description.');
      return;
    }

    if (user?.role === 'student' && user?.isActive === false) {
      setFormError(lang === 'as' ? 'আপোনাৰ ছাত্ৰ প্ৰফাইলৰ সুবিধা প্ৰশাসকে সাময়িকভাৱে বন্ধ কৰিছে।' : 'Your student portal access has been turned OFF by the administrator. Contact office to re-activate.');
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('address', address);
      fd.append('location', location || 'Campus Premises');
      fd.append('zoneId', zoneId);
      if (category) fd.append('category', category);
      fd.append('reporterId', user?.id || null);
      fd.append('reporterName', anonymous ? 'Anonymous' : (user?.name || reporterName));
      fd.append('reporterRole', user?.role || 'student');
      fd.append('anonymous', anonymous);
      if (forceIgnore) fd.append('ignoreDuplicate', 'true');

      if (imageFile instanceof File) {
        fd.append('image', imageFile);
      }

      const res = await submitIssue(fd);
      if (res.success) {
        setTitle('');
        setDescription('');
        setAddress('');
        setImageFile(null);
        setImagePreview(null);
        setPreCheckData(null);
        setFormError('');
        onIssueCreated(res.data);
      }
    } catch (err) {
      if (err.status === 409 && err.data?.duplicate) {
        onDuplicateDetected({
          duplicate: err.data.duplicate,
          pendingFormData: { title, description, address, location, zoneId, category, anonymous },
          onConfirmAnyway: () => handleSubmit(null, true)
        });
      } else {
        setFormError(err.message || 'Notice: Grievance could not be verified online.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
      
      {/* Form Top Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'as' ? 'দ্বিভাষিক এআই অভিযোজক' : 'Bilingual AI Campus Redressal'}</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {t('formHeading')}
            </h3>
            <p className="text-xs text-slate-200 mt-0.5">
              {t('formSubheading')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleVoiceSimulation}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all self-start"
            title="Simulate Voice Input / কণ্ঠস্বৰ দ্বাৰা দাখিল"
          >
            <Mic className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>{lang === 'as' ? 'কণ্ঠস্বৰ দ্বাৰা দাখিল (Simulate)' : 'Voice Note Simulation'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="p-5 sm:p-7 space-y-5">

        {/* Suspended Student Access Alert */}
        {user?.role === 'student' && user?.isActive === false && (
          <div className="p-4 bg-rose-50 border-2 border-rose-300 text-rose-800 rounded-2xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wide">
                {lang === 'as' ? 'ছাত্ৰ প্ৰফাইল স্থগিত (Access OFF)' : 'Student Access Suspended (OFF)'}
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                {lang === 'as' ? 'প্ৰশাসকৰ দ্বাৰা আপোনাৰ অভিযোগ দাখিলৰ সুবিধা সাময়িকভাৱে নিষ্ক্ৰিয় কৰা হৈছে।' : 'Your grievance submission privileges have been turned OFF by the Campus Administrator.'}
              </p>
            </div>
          </div>
        )}

        {/* Validation / Form Error */}
        {formError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span className="font-medium">{formError}</span>
          </div>
        )}
        
        {/* Toggle Assamese Virtual Keyboard Helper */}
        <div className="flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={() => setShowKeyboardHelper(!showKeyboardHelper)}
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1"
          >
            <span>{showKeyboardHelper ? '▲ অসমীয়া বৰ্ণ সহায়ক লুকুৱাওক (Hide Palette)' : '▼ অসমীয়া বৰ্ণ আৰু যুক্তাক্ষৰ সহায়ক খোলক (Open Assamese Palette)'}</span>
          </button>
          <span className="text-slate-400 text-[11px]">
            {lang === 'as' ? 'অসমীয়া আৰু ইংৰাজী দুয়োটা গ্ৰহণযোগ্য' : 'Accepts Assamese Unicode & English'}
          </span>
        </div>

        {showKeyboardHelper && (
          <AssameseKeyboardHelper
            onInsertChar={handleInsertChar}
            onInsertPhrase={handleInsertPhrase}
          />
        )}

        {/* Issue Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('issueTitleLabel')} <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setActiveInputFocus('title')}
            placeholder={t('issueTitlePlaceholder')}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium transition-all"
          />
        </div>

        {/* Issue Description Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('issueDescLabel')} <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setActiveInputFocus('desc')}
            placeholder={t('issueDescPlaceholder')}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
          />
        </div>

        {/* Dedicated Address / Detailed Location Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <span>Specific Campus Address / সঠিক ঠিকনা ও কোঠা নম্বৰ <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => setActiveInputFocus('address')}
            placeholder="e.g. Hostel 4, 3rd Floor, Room 302, East Wing / কলা ভৱন, ২য় মহলা, ৰুম ২০৪"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm font-medium"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Provide specific room number, floor, or nearby building pillar so workers can reach the spot instantly.
          </p>
        </div>

        {/* Location & Dynamic Category Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('zoneLabel')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={zoneId}
              onChange={handleZoneChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-semibold"
            >
              {locationsList.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {lang === 'as' ? loc.as : loc.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('categoryLabel')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-semibold"
            >
              <option value="">{t('autoCategoryOption')}</option>
              {categoriesList.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {lang === 'as' ? cat.as : cat.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multimodal Photo Upload with Preview */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('photoUploadLabel')}
          </label>
          <p className="text-[11px] text-slate-500 mb-2">
            {t('photoUploadHint')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="flex-1 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
              <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-600">Choose photo or drag file</span>
              <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            <div className="w-full sm:w-auto flex flex-col gap-1.5 text-[11px]">
              <span className="text-[10px] font-bold text-slate-500">Quick Sample Photos (ডেমো ফটো):</span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => selectSamplePhoto('water')}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 text-[10px] border border-slate-200"
                >
                  💧 Pipe Leak
                </button>
                <button
                  type="button"
                  onClick={() => selectSamplePhoto('pothole')}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 text-[10px] border border-slate-200"
                >
                  🕳️ Road Pothole
                </button>
                <button
                  type="button"
                  onClick={() => selectSamplePhoto('electric')}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 text-[10px] border border-slate-200"
                >
                  ⚡ Dark Street
                </button>
                <button
                  type="button"
                  onClick={() => selectSamplePhoto('cooler')}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 text-[10px] border border-slate-200"
                >
                  🥤 Water Cooler
                </button>
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-48 flex items-center justify-center">
              <img src={imagePreview} alt="Preview" className="object-cover max-h-48 w-full" />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-500/40">
                ✓ Photo Attached for AI Multimodal Inspection
              </div>
            </div>
          )}
        </div>

        {/* Real-time AI Pre-Check Panel */}
        {preCheckData && (
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 border border-indigo-800 shadow-md animate-fadeIn">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-800/60">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{t('aiPreCheckTitle')}</span>
              </div>
              {preCheckLoading && (
                <span className="text-[11px] text-indigo-300 animate-pulse">Analyzing...</span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-[10px]">{t('detectedCategory')}</div>
                <div className="font-bold text-emerald-300 mt-0.5 truncate">
                  {lang === 'as' ? preCheckData.classification?.categoryName?.as : preCheckData.classification?.categoryName?.en}
                </div>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-[10px]">{t('detectedPriority')}</div>
                <div className={`font-bold mt-0.5 uppercase ${
                  preCheckData.classification?.priority === 'critical' ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                }`}>
                  {preCheckData.classification?.priority} ({preCheckData.classification?.urgencyScore}/100)
                </div>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-[10px]">{t('assignedDept')}</div>
                <div className="font-bold text-sky-300 mt-0.5 truncate">
                  {lang === 'as' ? preCheckData.classification?.department?.as : preCheckData.classification?.department?.en}
                </div>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-[10px]">{t('estimatedSla')}</div>
                <div className="font-bold text-white mt-0.5">
                  Within {preCheckData.classification?.slaHours} Hours
                </div>
              </div>
            </div>

            {/* If Duplicate Found in Pre-check */}
            {preCheckData.duplicates?.hasDuplicates && (
              <div className="bg-amber-950/80 border border-amber-500/50 p-2.5 rounded-lg text-amber-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>Duplicate Warning:</strong> Matches #{preCheckData.duplicates.topDuplicate.ticketId} ({preCheckData.duplicates.topDuplicate.similarity}% semantic similarity).
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Anonymity Option */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
          <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <span className="font-semibold">{t('anonymousLabel')}</span>
          </label>

          <span className="text-slate-500 text-[11px]">
            Submitting as: <strong className="text-slate-800">{anonymous ? 'Anonymous' : (user?.name || reporterName)}</strong>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t('submittingBtn')}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t('submitBtn')}</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
}
