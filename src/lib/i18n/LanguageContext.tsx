"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en, zh, Lang } from './translations';

type Translations = typeof en;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh'); // Default to Chinese
  
  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('open-purchase-lang') as Lang;
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      setLang(savedLang);
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'zh') {
        setLang('zh');
      } else {
        setLang('en');
      }
    }
  }, []);
  
  // Save language preference
  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('open-purchase-lang', newLang);
  };
  
  const t = lang === 'zh' ? zh : en;
  
  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
