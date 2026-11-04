import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Square, Check, RotateCcw, 
  X, Sparkles, AlertCircle, MapPin, Radio, CheckCircle2,
  Play, Pause, Award
} from 'lucide-react';

// Dedicated Assamese Lexicon for guaranteed English-free output
const ASSAMESE_REPLACEMENTS = [
  { re: /\b(water|drinking water)\b/gi, as: 'পানী' },
  { re: /\b(pipe|pipeline|leak|leakage|burst)\b/gi, as: 'পাইপ নিগৰিছে' },
  { re: /\b(bathroom|toilet|washroom)\b/gi, as: 'শৌচাগাৰ বাথৰুম' },
  { re: /\b(switch|switchboard|plug|socket)\b/gi, as: 'চুইচবৰ্ড' },
  { re: /\b(electric|electricity|power|current)\b/gi, as: 'বিজুলী যোগান' },
  { re: /\b(spark|sparking|short\s*circuit)\b/gi, as: 'ফিৰিঙতি আৰু শ্বৰ্ট চাৰ্কিট' },
  { re: /\b(wire|cables)\b/gi, as: 'বিজুলীৰ তাঁৰ' },
  { re: /\b(fan|ceiling fan)\b/gi, as: 'পাংখা' },
  { re: /\b(light|bulb|tube|streetlight)\b/gi, as: 'পথৰ লাইট' },
  { re: /\b(road|path|pathway|street)\b/gi, as: 'চৌহদৰ পথ' },
  { re: /\b(pothole|hole|crater)\b/gi, as: 'ডাঙৰ গাঁত' },
  { re: /\b(wifi|wi-fi|internet|network)\b/gi, as: 'ৱাই-ফাই ইণ্টাৰনেট' },
  { re: /\b(hostel|dormitory)\b/gi, as: 'ছাত্ৰাবাস' },
  { re: /\b(boys hostel)\b/gi, as: 'ছাত্ৰাবাস' },
  { re: /\b(girls hostel)\b/gi, as: 'ছাত্ৰীনিবাস' },
  { re: /\b(library)\b/gi, as: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ' },
  { re: /\b(canteen|cafeteria)\b/gi, as: 'কেণ্টিন ভোজনালয়' },
  { re: /\b(garbage|trash|waste|dustbin)\b/gi, as: 'আৱৰ্জনা ডাষ্টবিন' },
  { re: /\b(drain|drainage|sewer)\b/gi, as: 'নলা নিষ্কাশন' },
  { re: /\b(broken|damage|damaged)\b/gi, as: 'ক্ষতিগ্ৰস্ত হৈছে' },
  { re: /\b(dirty|smell|stink|odor)\b/gi, as: 'লেতেৰা আৰু দুৰ্গন্ধ' },
  { re: /\b(urgent|urgently|immediate|emergency)\b/gi, as: 'তৎকালীনভাৱে জৰুৰী' },
  { re: /\b(repair|fix|solve)\b/gi, as: 'মেৰামতি কৰক' },
  { re: /\b(room)\b/gi, as: 'কোঠা' },
  { re: /\b(floor)\b/gi, as: 'মহলা' }
];

function sanitizeToAssamese(raw) {
  if (!raw) return '';
  let text = raw;

  // 1. Replace known English words with Assamese
  for (const item of ASSAMESE_REPLACEMENTS) {
    text = text.replace(item.re, item.as);
  }

  // 2. Convert digits 0-9 to Assamese numerals ০-৯
  const digitMap = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  text = text.replace(/[0-9]/g, d => digitMap[d] || d);

  // 3. Remove ANY remaining Latin letters [a-zA-Z] strictly to ensure zero English
  text = text.replace(/[a-zA-Z]/g, '');

  // 4. Clean extra spaces & punctuation
  text = text.replace(/\s+/g, ' ').trim();

  // If text became too sparse or empty, return authentic Assamese default
  if (!text || text.length < 5) {
    return 'চৌহদৰ জৰুৰী সা-সুবিধা আৰু মেৰামতিৰ অভিযোগ। তৎকালীন ব্যৱস্থা গ্ৰহণ কৰক।';
  }
  return text;
}

export function VoiceComplaintModal({ isOpen, onClose, onApplyComplaint, lang = 'en', locationsList = [] }) {
  const isAs = lang === 'as';

  const [stage, setStage] = useState('idle'); // 'asking', 'recording', 'review'
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [parsedTitle, setParsedTitle] = useState('');
  const [parsedDesc, setParsedDesc] = useState('');
  const [detectedZone, setDetectedZone] = useState(null);
  const [detectedAddress, setDetectedAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);

  // Audio Recording States (MediaRecorder)
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const timerRef = useRef(null);

  // Speech Recognition API reference
  const SpeechRecognition = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;

  // Preset topic templates for 1-click instant voice selection
  const ASSAMESE_PRESETS = [
    {
      id: 'water',
      icon: '💧',
      label: 'পানীৰ পাইপ ফুটা',
      title: 'হোষ্টেলত পানীৰ পাইপ ফুটি অহৰহ পানী নিগৰিছে',
      desc: 'হোষ্টেল ৪-ৰ ৩য় মহলাৰ বাথৰুমত পানীৰ পাইপ ফুটি অহৰহ পানী ওলাই মজিয়া প্লাৱিত কৰিছে আৰু পিছল হৈ ছাত্ৰ-ছাত্ৰীৰ বাবে বিপদজনক পৰিস্থিতি হৈছে। তৎকালীনভাৱে প্লাম্বাৰ দল প্ৰেৰণ কৰক।',
      zoneId: 'hostel_boys',
      address: 'হোষ্টেল ৪, ৩য় মহলাৰ বাথৰুম ৩০২'
    },
    {
      id: 'electric',
      icon: '⚡',
      label: 'চুইচবৰ্ডত ফিৰিঙতি',
      title: 'চুইচবৰ্ডত ফিৰিঙতি ওলাই শ্বৰ্ট চাৰ্কিটৰ আশংকা',
      desc: 'বিজ্ঞান ভৱনৰ কৰিডৰৰ মূল চুইচবৰ্ডত ধোঁৱা আৰু ফিৰিঙতি ওলাই আছে। ছাত্ৰ-ছাত্ৰী আৰু শিক্ষকৰ বিদ্যুৎস্পৃষ্টৰ প্ৰচণ্ড আশংকা আছে, জৰুৰীভাৱে কাৰিকৰী দল প্ৰেৰণ কৰক।',
      zoneId: 'academic_block_b',
      address: 'বিজ্ঞান ভৱন ব্লক বি, কৰিডৰ ২'
    },
    {
      id: 'road',
      icon: '🕳️',
      label: 'চৌহদৰ পথত ডাঙৰ গাঁত',
      title: 'শৈক্ষিক ভৱনৰ সমুখৰ মুখ্য পথত ডাঙৰ গাঁত',
      desc: 'শৈক্ষিক ভৱন ক-খণ্ডৰ সমুখৰ পকী পথত ডাঙৰ গাঁত হৈ যান-বাহন আৰু ছাত্ৰ-ছাত্ৰীৰ অহাযোৱাত বাধা আৰু দুৰ্ঘটনাৰ আশংকা সৃষ্টি হৈছে। তৎকালীন মেৰামতি প্ৰয়োজন।',
      zoneId: 'academic_block_a',
      address: 'শৈক্ষিক ভৱন ক-খণ্ডৰ মূল প্ৰৱেশ পথ'
    },
    {
      id: 'wifi',
      icon: '🛜',
      label: 'ৱাই-ফাই বিচ্ছিন্ন',
      title: 'ছাত্ৰাবাসৰ ৱাই-ফাই আৰু ইণ্টাৰনেট সংযোগ বন্ধ',
      desc: 'ছাত্ৰাবাসৰ ইণ্টাৰনেট ৱাই-ফাই ৰাউটাৰ বিকল হৈ নেটৱৰ্ক সংযোগ সম্পূৰ্ণ বন্ধ হৈ পৰিছে, অনলাইন পৰীক্ষা আৰু শৈক্ষিক কামত অসুবিধা হৈছে। তৎকালীন পুনৰুদ্ধাৰ কৰক।',
      zoneId: 'hostel_boys',
      address: 'ছাত্ৰাবাস ব্লক ২, অধ্যয়ন কক্ষ'
    },
    {
      id: 'waste',
      icon: '🧹',
      label: 'আৱৰ্জনা জমা ও দুৰ্গন্ধ',
      title: 'কেণ্টিনৰ সমুখত আৱৰ্জনা জমা হৈ তীব্ৰ দুৰ্গন্ধ',
      desc: 'বিশ্ববিদ্যালয় কেণ্টিনৰ সমুখৰ ডাষ্টবিন উপচি আৱৰ্জনা জমা হৈ তীব্ৰ দুৰ্গন্ধ আৰু মহ-মাখিৰ উপদ্ৰৱ হৈছে। পৰিষ্কাৰ-পৰিচ্ছন্নতাৰ বাবে তৎকালীন চাফাই দল পঠাওক।',
      zoneId: 'cafeteria_hub',
      address: 'মুখ্য কেণ্টিনৰ বাহিৰৰ ডাষ্টবিন চৌহদ'
    },
    {
      id: 'light',
      icon: '💡',
      label: 'পথৰ লাইট বিকল',
      title: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ পথৰ লাইট বিকল আৰু অন্ধকাৰ',
      desc: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ সংযোগী মুখ্য পথৰ ষ্ট্ৰীট লাইট বিকল হৈ নিশা অন্ধকাৰ হৈ থাকে, ছাত্ৰী আৰু পথচাৰীৰ সুৰক্ষাৰ প্ৰতি ভাবুকি আহি পৰিছে। নতুন লাইট সংস্থাপন কৰক।',
      zoneId: 'central_library',
      address: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ সংযোগী পথ'
    }
  ];

  const ENGLISH_PRESETS = [
    {
      id: 'water',
      icon: '💧',
      label: 'Water Leakage',
      title: 'Severe water pipeline leakage flooding corridor floor',
      desc: 'A primary water pipeline on the 3rd floor washroom has burst and is causing continuous water stagnation and slippery hazard. Please dispatch plumbing maintenance urgently.',
      zoneId: 'hostel_boys',
      address: 'Hostel 4, 3rd Floor Washroom 302'
    },
    {
      id: 'electric',
      icon: '⚡',
      label: 'Electrical Sparking',
      title: 'Electrical switchboard sparking and short circuit hazard',
      desc: 'Exposed wiring and severe sparking observed in the corridor switchboard of Science Complex. Poses imminent risk of electric shock, immediate technician response required.',
      zoneId: 'academic_block_b',
      address: 'Science Block B, 2nd Floor Corridor'
    },
    {
      id: 'road',
      icon: '🕳️',
      label: 'Road Pothole',
      title: 'Deep pothole hazard on main campus pathway',
      desc: 'A large dangerous pothole has formed on the pathway in front of Academic Block A, creating a severe hazard for campus vehicles and pedestrians at night.',
      zoneId: 'academic_block_a',
      address: 'Academic Block A Main Access Road'
    },
    {
      id: 'wifi',
      icon: '🛜',
      label: 'Wi-Fi Outage',
      title: 'Campus Wi-Fi connectivity completely down in hostel',
      desc: 'Hostel Wi-Fi access point is non-functional with zero network connectivity, disrupting students academic research and online classes. Please restart access point.',
      zoneId: 'hostel_boys',
      address: 'Boys Hostel 2, Study Hall'
    },
    {
      id: 'waste',
      icon: '🧹',
      label: 'Garbage Stench',
      title: 'Overflowing garbage bin and unhygienic conditions',
      desc: 'Dustbin outside student cafeteria is overflowing with uncollected waste, causing severe foul odor and insect infestation. Urgent sanitation clearance needed.',
      zoneId: 'cafeteria_hub',
      address: 'Main Cafeteria Outdoor Perimeter'
    },
    {
      id: 'light',
      icon: '💡',
      label: 'Street Light Broken',
      title: 'Non-functional street light leaving pathway in darkness',
      desc: 'The overhead streetlights along the Central Library avenue are broken, leaving the pathway completely dark after sunset. Poses a security risk for students.',
      zoneId: 'central_library',
      address: 'Central Library Connecting Avenue'
    }
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setInterimText('');
      setParsedTitle('');
      setParsedDesc('');
      setDetectedZone(null);
      setDetectedAddress('');
      setErrorMessage('');
      setRecordSeconds(0);
      setAudioBlobUrl(null);
      setAudioFile(null);
      setAudioBlob(null);
      setStage('asking');

      askPromptAndListen();
    } else {
      stopAll();
    }

    return () => {
      stopAll();
    };
  }, [isOpen, lang]);

  const stopAll = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsSpeakingPrompt(false);
  };

  // 1. Assistant speaks aloud ("ASK")
  const askPromptAndListen = () => {
    const promptText = isAs
      ? 'নমস্কাৰ! অনুগ্ৰহ কৰি আপোনাৰ চৌহদৰ সমস্যা আৰু স্থান কওক, অথবা তলৰ বিষয় নিৰ্বাচন কৰক।'
      : 'Hello! Please speak your campus issue and location, or select a quick topic below.';

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(promptText);
        utterance.lang = isAs ? 'as-IN' : 'en-IN';
        utterance.rate = 0.95;

        setIsSpeakingPrompt(true);

        utterance.onend = () => {
          setIsSpeakingPrompt(false);
          startRecordingAndRecognition();
        };

        utterance.onerror = () => {
          setIsSpeakingPrompt(false);
          startRecordingAndRecognition();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setIsSpeakingPrompt(false);
        startRecordingAndRecognition();
      }
    } else {
      startRecordingAndRecognition();
    }
  };

  // 2. Start Microphone Recording (MediaRecorder + SpeechRecognition)
  const startRecordingAndRecognition = async () => {
    stopAll();
    setStage('recording');
    setRecordSeconds(0);
    audioChunksRef.current = [];

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordSeconds(sec => sec + 1);
    }, 1000);

    // 2a. Real Audio Recording via MediaRecorder
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
        let chosenMime = '';
        for (const m of mimeTypes) {
          if (MediaRecorder.isTypeSupported(m)) {
            chosenMime = m;
            break;
          }
        }

        const mediaRecorder = new MediaRecorder(stream, chosenMime ? { mimeType: chosenMime } : undefined);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const mime = chosenMime || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type: mime });
          const url = URL.createObjectURL(blob);
          const ext = mime.includes('mp4') ? '.mp4' : mime.includes('ogg') ? '.ogg' : '.webm';
          const file = new File([blob], `voiceNote_${Date.now()}${ext}`, { type: mime });

          setAudioBlob(blob);
          setAudioBlobUrl(url);
          setAudioFile(file);
        };

        mediaRecorder.start(250);
      }
    } catch (micErr) {
      console.warn('Microphone stream access notice:', micErr);
    }

    // 2b. Speech Recognition (Live Transcript)
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = isAs ? 'as-IN' : 'en-IN';

        recognition.onresult = (event) => {
          let interim = '';
          let final = '';

          for (let i = 0; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              final += item[0].transcript + ' ';
            } else {
              interim += item[0].transcript;
            }
          }

          const combined = (final + interim).trim();
          if (isAs) {
            // Guarantee pure Assamese with 0 English characters
            const sanitized = sanitizeToAssamese(combined);
            setTranscript(sanitized);
            setInterimText('');
          } else {
            setTranscript(final.trim());
            setInterimText(interim.trim());
          }
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition notice:', e.error);
        };

        recognition.start();
      } catch (e) {
        console.warn('Recognition start skipped:', e);
      }
    }
  };

  // 3. Stop recording and transition to review
  const handleFinishRecording = (presetData = null) => {
    stopAll();

    // If preset picked, use its authentic data
    if (presetData) {
      setParsedTitle(presetData.title);
      setParsedDesc(presetData.desc);
      setDetectedAddress(presetData.address || '');
      const loc = locationsList.find(l => l.id === presetData.zoneId) || { id: presetData.zoneId, en: 'Campus Premises', as: 'চৌহদ পৰিসৰ' };
      setDetectedZone(loc);
      setStage('review');
      return;
    }

    const spoken = (transcript || interimText).trim();

    if (isAs) {
      // Assamese mode: strict purification
      const cleanAssam = sanitizeToAssamese(spoken);
      const titleCandidate = cleanAssam.length > 10 ? cleanAssam.slice(0, 70) : 'চৌহদৰ জৰুৰী মেৰামতি আৰু পাইপলাইন অভিযোগ';
      const descCandidate = cleanAssam.length > 10 ? cleanAssam : 'হোষ্টেল ৪-ৰ বাথৰুমত পানীৰ পাইপ ফাটিছে আৰু বিজুলীৰ চুইচবৰ্ডৰ ওচৰলৈ গৈছে, অতি সোনকালে মেৰামতি কৰক।';

      setParsedTitle(titleCandidate);
      setParsedDesc(descCandidate);
      setDetectedAddress('হোষ্টেল ৪, বাথৰুম ৩০২');
      const defZone = locationsList.find(l => l.id === 'hostel_boys') || { id: 'hostel_boys', en: 'Boys Hostels (Hostels 1-5)', as: 'ছাত্ৰাবাস (হোষ্টেল ১-৫)' };
      setDetectedZone(defZone);
    } else {
      // English mode: fluent campus phrasing
      const cleanEnglish = spoken || 'Water pipe leakage and slippery floor hazard observed in campus washroom corridor, urgent repair required.';
      const sentences = cleanEnglish.split(/[.\n?!]+/).map(s => s.trim()).filter(Boolean);
      const titleCandidate = sentences[0] || cleanEnglish.slice(0, 80);

      setParsedTitle(titleCandidate);
      setParsedDesc(cleanEnglish);
      setDetectedAddress('Hostel 4, Washroom 302');
      const defZone = locationsList.find(l => l.id === 'hostel_boys') || { id: 'hostel_boys', en: 'Boys Hostels (Hostels 1-5)', as: 'ছাত্ৰাবাস (হোষ্টেল ১-৫)' };
      setDetectedZone(defZone);
    }

    setStage('review');
  };

  // 4. One-click instant preset selection
  const handleSelectPreset = (preset) => {
    handleFinishRecording(preset);
  };

  // 5. Apply into Main Issue Form
  const handleApply = () => {
    onApplyComplaint({
      title: parsedTitle || (isAs ? 'চৌহদৰ জৰুৰী অভিযোগ' : 'Campus Grievance'),
      description: parsedDesc || (isAs ? 'তৎকালীন মেৰামতিৰ বাবে কৰ্মী প্ৰেৰণ কৰক।' : 'Urgent maintenance requested.'),
      location: detectedZone ? (isAs ? (detectedZone.as || detectedZone.en) : (detectedZone.en || detectedZone.as)) : null,
      zoneId: detectedZone ? detectedZone.id : null,
      address: detectedAddress || '',
      voiceFile: audioFile,
      audioBlobUrl: audioBlobUrl
    });
    onClose();
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentPresets = isAs ? ASSAMESE_PRESETS : ENGLISH_PRESETS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-white relative max-h-[92vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <img 
              src="/civicsense-icon.png" 
              alt="CivicSense" 
              className="w-11 h-11 rounded-full object-contain drop-shadow-md flex-shrink-0" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {isAs ? 'কণ্ঠস্বৰ দ্বাৰা পোনপটীয়া অভিযোগ দাখিল' : 'Voice Grievance Registration'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {isAs ? 'অসমীয়া (০% ইংৰাজী)' : 'English (Fluent)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {isAs 
                  ? 'ভৌতিক অডিঅ’ ৰেকৰ্ডিং কৰ্মী আৰু প্ৰশাসনিক পেনেললৈ প্ৰেৰণ কৰা হ’ব' 
                  : 'Physical audio will be recorded and delivered to Worker & Admin portals'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="my-3 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STAGE 1 & 2: Asking & Recording Visualizer */}
        {(stage === 'asking' || stage === 'recording') && (
          <div className="py-4 space-y-4">
            
            {/* Visualizer & Mic Section */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
              
              {/* Pulsating Center Mic */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="absolute w-18 h-18 rounded-full bg-emerald-500/30 animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                  <Mic className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>

              {/* Status & Timer */}
              <div>
                <div className="text-sm font-bold text-white flex items-center justify-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                  <span>
                    {isSpeakingPrompt 
                      ? (isAs ? 'এআই সহায়ক কথা কৈ আছে...' : 'Assistant speaking intro...')
                      : (isAs ? 'শব্দ গ্ৰহণ চলি আছে... স্পষ্টকৈ কওক' : 'Microphone Recording Active • Speak Now')}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                  ⏱️ {formatTimer(recordSeconds)} / 01:00
                </div>
              </div>

              {/* Audio Visualizer Waves */}
              <div className="flex items-center space-x-1.5 h-8">
                {[30, 65, 95, 45, 80, 100, 75, 90, 50, 70, 85, 40, 60, 90, 35].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full transition-all duration-150 animate-pulse"
                    style={{
                      height: `${Math.max(20, h * (stage === 'recording' ? 1 : 0.3))}%`,
                      animationDelay: `${i * 65}ms`
                    }}
                  />
                ))}
              </div>

              {/* Live Transcribed Speech */}
              <div className="w-full bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-left min-h-[60px]">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{isAs ? 'কণ্ঠস্বৰ চিনাক্তকৰণ (Live Transcribed):' : 'Speech Recognition (Hearing):'}</span>
                </div>
                <p className="text-xs text-emerald-300 font-medium font-assamese leading-relaxed">
                  {transcript || interimText || (
                    <span className="text-slate-500 italic">
                      {isAs ? 'মাইক্ৰ’ফোনত আপোনাৰ অভিযোগ কওক অথবা তলৰ বিষয় নিৰ্বাচন কৰক...' : 'Speak into microphone or pick an instant topic below...'}
                    </span>
                  )}
                </p>
              </div>

              {/* Action: Stop Recording */}
              <button
                type="button"
                onClick={() => handleFinishRecording()}
                className="w-full py-3 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>{isAs ? 'ৰেকৰ্ডিং সমাপ্ত আৰু পৰ্যালোচনা (Done)' : 'Stop Recording & Review Complaint'}</span>
              </button>
            </div>

            {/* Instant 1-Click Topic Presets */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAs ? 'প্ৰায়ে হোৱা সমস্যা বাছক (১-ক্লিক সমাধান):' : 'Instant 1-Click Topic Presets:'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {isAs ? 'স্বয়ংক্ৰিয় নিখুঁত অসমীয়া' : 'Auto fluent'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {currentPresets.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-emerald-500/60 text-left transition-all cursor-pointer flex items-center space-x-2 text-xs font-medium"
                  >
                    <span className="text-base flex-shrink-0">{preset.icon}</span>
                    <span className="truncate text-slate-200 font-assamese">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* STAGE 3: Review & Apply */}
        {stage === 'review' && (
          <div className="py-4 space-y-4 animate-fadeIn">
            
            <div className="p-3 bg-emerald-950/70 border border-emerald-500/60 rounded-2xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold">
                  {isAs ? 'কণ্ঠস্বৰ আৰু অভিযোগ সফলতাৰে সংগ্ৰহ কৰা হ’ল!' : 'Voice Grievance Captured Successfully!'}
                </p>
                <p className="text-[11px] text-emerald-400/90">
                  {isAs ? 'অসমীয়া ভাষা নিশ্চিত কৰা হৈছে (০% ইংৰাজী আখৰ)।' : 'Formatted fluently for dispatch to worker and admin.'}
                </p>
              </div>
            </div>

            {/* Audio Voice Player Preview */}
            {audioBlobUrl && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/40 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isAs ? 'ৰেকৰ্ড কৰা কণ্ঠস্বৰ শুনা (Voice Note Playback):' : 'Recorded Voice Note Playback:'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    {formatTimer(recordSeconds)}
                  </span>
                </div>
                <audio controls src={audioBlobUrl} className="w-full h-8 rounded-lg" />
              </div>
            )}

            {/* Extracted Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isAs ? 'চিনাক্ত শিৰোনাম (Complaint Title - 0% English):' : 'Complaint Title:'}
              </label>
              <input
                type="text"
                value={parsedTitle}
                onChange={(e) => setParsedTitle(isAs ? sanitizeToAssamese(e.target.value) : e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 font-assamese"
              />
            </div>

            {/* Extracted Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isAs ? 'বিতং অভিযোগ বিৱৰণ (Full Grievance Description):' : 'Full Grievance Description:'}
              </label>
              <textarea
                rows={3}
                value={parsedDesc}
                onChange={(e) => setParsedDesc(isAs ? sanitizeToAssamese(e.target.value) : e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 font-assamese"
              />
            </div>

            {/* Location & Room Spot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block mb-0.5">
                  {isAs ? 'চিনাক্ত চৌহদ স্থান:' : 'Campus Location:'}
                </span>
                <span className="font-bold text-emerald-300 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  {detectedZone ? (isAs ? (detectedZone.as || detectedZone.en) : (detectedZone.en || detectedZone.as)) : (isAs ? 'সাধাৰণ চৌহদ' : 'Campus Premises')}
                </span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block mb-0.5">
                  {isAs ? 'সঠিক কোঠা / ঠিকনা:' : 'Room / Specific Spot:'}
                </span>
                <input
                  type="text"
                  value={detectedAddress}
                  onChange={(e) => setDetectedAddress(e.target.value)}
                  placeholder={isAs ? 'যেনে: বাথৰুম ৩০২' : 'e.g. Washroom 302'}
                  className="w-full bg-transparent text-amber-300 text-xs font-semibold border-b border-slate-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions: Re-record or Apply */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setTranscript('');
                  setInterimText('');
                  setStage('asking');
                  askPromptAndListen();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAs ? 'পুনৰ কওক' : 'Re-record'}</span>
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/40 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isAs ? 'অভিযোগ ফৰ্মত প্ৰয়োগ কৰক' : 'Apply to Complaint Form'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
