"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en, zh, Lang } from './translations';

type Translations = typeof en;

interface ThemeContextType {
  dark: boolean;
  toggleDark: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');

  // Load saved preferences
  useEffect(() => {
    const savedDark = localStorage.getItem('open-purchase-dark');
    const savedLang = localStorage.getItem('open-purchase-lang') as Lang;

    if (savedDark === 'true') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }

    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      setLang(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      setLang(browserLang === 'zh' ? 'zh' : 'en');
    }
  }, []);

  // Toggle dark mode
  const toggleDark = () => {
    setDark(!dark);
    if (!dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('open-purchase-dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('open-purchase-dark', 'false');
    }
  };

  // Set language
  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('open-purchase-lang', newLang);
  };

  const t = lang === 'zh' ? zh : en;

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, lang, setLang: handleSetLang, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
