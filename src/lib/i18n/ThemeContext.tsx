"use client";

import { useState, useEffect, useCallback } from "react";
import { translations } from "./translations";

type Lang = "en" | "zh";

interface ThemeState {
  dark: boolean;
  lang: Lang;
  toggleDark: () => void;
  setLang: (lang: Lang) => void;
  t: typeof translations.en;
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
        if (typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
        }
      } else if (savedDark === "false") {
        setDark(false);
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("dark");
        }
      }
      
      if (savedLang === "en" || savedLang === "zh") {
        setLangState(savedLang);
      }
    }, []);

    const toggleDark = useCallback(() => {
      setDark((prev) => {
        const newDark = !prev;
        if (typeof document !== "undefined") {
          if (newDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        localStorage.setItem("open-purchase-dark", newDark ? "true" : "false");
        return newDark;
      });
    }, []);

    const setLang = useCallback((newLang: Lang) => {
      setLangState(newLang);
      localStorage.setItem("open-purchase-lang", newLang);
    }, []);

    const t = lang === "zh" ? translations.zh : translations.en;

    const contextValue: ThemeState = {
      dark,
      lang,
      toggleDark,
      setLang,
      t,
    };

    // Prevent flash of wrong theme
    if (!mounted) {
      return (
        <ThemeContext.Provider value={{ dark: defaultDark, lang: defaultLang, toggleDark: () => {}, setLang: () => {}, t: defaultLang === "zh" ? translations.zh : translations.en }}>
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
export { translations };
export type { Lang };
