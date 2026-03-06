'use client';

import { useState, useEffect } from 'react';

export function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem('theme');
    setIsDark(theme === 'dark' || theme === null);
  }, []);

  return mounted ? isDark : false; // SSR 安全
}
