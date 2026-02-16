"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Lang = "en" | "zh";

const translations = {
  en: {
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    chinese: "中文",
    english: "English",
  },
  zh: {
    darkMode: "深色模式",
    lightMode: "淺色模式",
    language: "語言",
    chinese: "中文",
    english: "English",
  },
};

interface ThemeContextType {
  dark: boolean;
  lang: Lang;
  toggleDark: () => void;
  setLang: (lang: Lang) => void;
  t: typeof translations.en;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [lang, setLangState] = useState<Lang>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const savedDark = localStorage.getItem('open-purchase-dark');
    const savedLang = localStorage.getItem('open-purchase-lang') as Lang;
    
    if (savedDark === 'true') {
      setDark(true);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('dark');
      }
    } else if (savedDark === 'false') {
      setDark(false);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
      }
    }
    
    if (savedLang === 'en' || savedLang === 'zh') {
      setLangState(savedLang);
    }
  }, []);

  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const newDark = !prev;
      if (typeof document !== 'undefined') {
        if (newDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      localStorage.setItem('open-purchase-dark', newDark ? 'true' : 'false');
      return newDark;
    });
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('open-purchase-lang', newLang);
  }, []);

  const t = lang === 'zh' ? translations.zh : translations.en;

  const contextValue: ThemeContextType = {
    dark,
    lang,
    toggleDark,
    setLang,
    t,
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ dark: false, lang: "zh", toggleDark: () => {}, setLang: () => {}, t: translations.zh }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
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

export { translations };
export type { Lang };
