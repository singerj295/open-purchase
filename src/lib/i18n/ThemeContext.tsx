"use client";

import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Globe } from "lucide-react";

type Lang = "en" | "zh";

interface ThemeState {
  dark: boolean;
  lang: Lang;
  toggleDark: () => void;
  setLang: (lang: Lang) => void;
}

function createThemeContext(defaultDark: boolean, defaultLang: Lang) {
  const ThemeContext = require("react").createContext<ThemeState | undefined>(undefined);
  
  function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [dark, setDark] = useState(defaultDark);
    const [lang, setLangState] = useState(defaultLang);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      const savedDark = localStorage.getItem("open-purchase-dark");
      const savedLang = localStorage.getItem("open-purchase-lang") as Lang;
      
      if (savedDark === "true") {
        setDark(true);
        document.documentElement.classList.add("dark");
      } else if (savedDark === "false") {
        setDark(false);
        document.documentElement.classList.remove("dark");
      }
      
      if (savedLang === "en" || savedLang === "zh") {
        setLangState(savedLang);
      }
    }, []);

    const toggleDark = useCallback(() => {
      setDark((prev) => {
        const newDark = !prev;
        if (newDark) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("open-purchase-dark", "true");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("open-purchase-dark", "false");
        }
        return newDark;
      });
    }, []);

    const setLang = useCallback((newLang: Lang) => {
      setLangState(newLang);
      localStorage.setItem("open-purchase-lang", newLang);
    }, []);

    // Prevent flash of wrong theme
    if (!mounted) {
      return (
        <ThemeContext.Provider value={{ dark: defaultDark, lang: defaultLang, toggleDark: () => {}, setLang: () => {} }}>
          {children}
        </ThemeContext.Provider>
      );
    }

    return (
      <ThemeContext.Provider value={{ dark, lang, toggleDark, setLang }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  function useTheme() {
    const context = require("react").useContext(ThemeContext);
    if (context === undefined) {
      throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
  }

  return { ThemeProvider, useTheme, ThemeContext };
}

const { ThemeProvider, useTheme } = createThemeContext(false, "zh");

export { ThemeProvider, useTheme };

// Export translations for use in components
export const translations = {
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

export type { Lang };
