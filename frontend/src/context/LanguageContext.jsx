import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../i18n/translations.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('civicsense_lang') || 'as'; // Default to Assamese to showcase native capability!
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('civicsense_role') || 'student'; // 'student' or 'admin'
  });

  useEffect(() => {
    localStorage.setItem('civicsense_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('civicsense_role', role);
  }, [role]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'as' ? 'en' : 'as'));
  };

  const t = (key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, role, setRole, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
