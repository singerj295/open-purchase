"use client";

import { useTheme } from "@/lib/i18n/ThemeContext";
import { Sun, Moon, Globe } from "lucide-react";

export default function ThemeSwitcher() {
  const { dark, toggleDark, lang, setLang, t } = useTheme();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDark}
        style={{
          padding: "8px",
          borderRadius: "8px",
          border: "none",
          background: dark ? "#374151" : "#f3f4f6",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title={dark ? t.lightMode : t.darkMode}
      >
        {dark ? (
          <Sun size={18} color="#fbbf24" />
        ) : (
          <Moon size={18} color="#6b7280" />
        )}
      </button>

      {/* Language Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Globe size={16} color="#9ca3af" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "en" | "zh")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "14px",
            color: dark ? "#d1d5db" : "#374151",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="zh" style={{ color: "#374151" }}>中文</option>
          <option value="en" style={{ color: "#374151" }}>EN</option>
        </select>
      </div>
    </div>
  );
}
