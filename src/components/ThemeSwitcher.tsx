"use client";

import { useTheme } from '@/lib/i18n/ThemeContext';
import { Sun, Moon, Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang, dark, toggleDark } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDark}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {dark ? (
          <Sun size={18} className="text-yellow-500" />
        ) : (
          <Moon size={18} className="text-gray-600" />
        )}
      </button>

      {/* Language Toggle */}
      <div className="flex items-center gap-1">
        <Globe size={16} className="text-gray-500" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as 'en' | 'zh')}
          className="bg-transparent text-sm text-gray-700 dark:text-gray-300 border-none cursor-pointer focus:outline-none"
        >
          <option value="en">EN</option>
          <option value="zh">中文</option>
        </select>
      </div>
    </div>
  );
}
