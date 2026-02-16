"use client";

import { useState, useEffect, useCallback } from "react";

type Lang = "en" | "zh";

const translations = {
  en: {
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    chinese: "中文",
    english: "English",
    dashboard: {
      title: "Dashboard",
      subtitle: "Welcome back",
      totalOrders: "Total Orders",
      pendingOrders: "Pending Orders",
      totalSuppliers: "Total Suppliers",
      lowStock: "Low Stock Items",
      recentOrders: "Recent Orders",
      newOrder: "New Order",
      viewAll: "View All",
    },
    nav: {
      dashboard: "Dashboard",
      orders: "Orders",
      suppliers: "Suppliers",
      recipes: "Recipes",
      inventory: "Inventory",
      analytics: "Analytics",
      settings: "Settings",
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      filter: "Filter",
      loading: "Loading...",
      noData: "No data available",
      success: "Success",
      error: "Error",
      confirm: "Confirm",
    },
  },
  zh: {
    darkMode: "深色模式",
    lightMode: "淺色模式",
    language: "語言",
    chinese: "中文",
    english: "English",
    dashboard: {
      title: "儀表板",
      subtitle: "歡迎回來",
      totalOrders: "總訂單數",
      pendingOrders: "待處理訂單",
      totalSuppliers: "供應商數量",
      lowStock: "低庫存物品",
      recentOrders: "最近訂單",
      newOrder: "新增訂單",
      viewAll: "查看全部",
    },
    nav: {
      dashboard: "儀表板",
      orders: "訂單",
      suppliers: "供應商",
      recipes: "食譜",
      inventory: "庫存",
      analytics: "分析",
      settings: "設定",
    },
    common: {
      save: "儲存",
      cancel: "取消",
      delete: "刪除",
      edit: "編輯",
      add: "新增",
      search: "搜尋",
      filter: "篩選",
      loading: "載入中...",
      noData: "暫無數據",
      success: "成功",
      error: "錯誤",
      confirm: "確認",
    },
  },
};

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
