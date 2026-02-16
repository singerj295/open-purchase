"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  
  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-gray-500" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as 'en' | 'zh')}
        className="bg-transparent text-sm text-gray-700 border-none cursor-pointer focus:outline-none hover:text-emerald-600"
      >
        <option value="en">EN</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
}
