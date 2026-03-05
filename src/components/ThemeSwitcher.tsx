"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 檢查 localStorage 中嘅主題設置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 12px',
        background: isDark ? '#374151' : '#f5f5f5',
        border: 'none',
        borderRadius: '12px',
        color: isDark ? '#fbbf24' : '#757575',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.15s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = isDark ? '#4b5563' : '#e5e7eb';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = isDark ? '#374151' : '#f5f5f5';
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{isDark ? '日間' : '夜間'}</span>
    </button>
  );
}
