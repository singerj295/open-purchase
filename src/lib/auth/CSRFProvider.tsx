"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CSRFContextType {
  csrfToken: string | null;
  refreshCSRFToken: () => Promise<void>;
  getCSRFToken: () => string | null;
}

const CSRFContext = createContext<CSRFContextType | null>(null);

/**
 * CSRF Token Provider
 * 管理客戶端的 CSRF token
 */
export function CSRFProvider({ children }: { children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 從 cookie 讀取現有的 CSRF token
  const getTokenFromCookie = useCallback((): string | null => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf-token') {
        return value;
      }
    }
    return null;
  }, []);

  // 刷新 CSRF token
  const refreshCSRFToken = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/csrf/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          setCsrfToken(data.token);
        }
      }
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
    }
  }, []);

  // 初始化時獲取 token
  useEffect(() => {
    const initCSRF = async () => {
      const existingToken = getTokenFromCookie();
      
      if (existingToken) {
        setCsrfToken(existingToken);
        setIsLoading(false);
      } else {
        // 沒有現有 token，獲取新的
        await refreshCSRFToken();
        setIsLoading(false);
      }
    };

    initCSRF();
  }, [getTokenFromCookie, refreshCSRFToken]);

  const getCSRFToken = useCallback((): string | null => {
    // 優先使用 state 中的 token
    if (csrfToken) return csrfToken;
    
    // 否則從 cookie 讀取
    return getTokenFromCookie();
  }, [csrfToken, getTokenFromCookie]);

  return (
    <CSRFContext.Provider value={{ csrfToken, refreshCSRFToken, getCSRFToken }}>
      {children}
    </CSRFContext.Provider>
  );
}

/**
 * 使用 CSRF token 的鉤子
 */
export function useCSRF(): CSRFContextType {
  const context = useContext(CSRFContext);
  if (!context) {
    throw new Error('useCSRF must be used within a CSRFProvider');
  }
  return context;
}

/**
 * 獲取用於 fetch 的 CSRF headers
 */
export function getCSRFHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  
  const cookies = document.cookie.split(';');
  let csrfToken: string | null = null;
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf-token') {
      csrfToken = value;
      break;
    }
  }
  
  if (!csrfToken) {
    return {};
  }
  
  return {
    'x-csrf-token': csrfToken,
  };
}

/**
 * 帶有 CSRF 保護的 fetch 封裝
 */
export async function csrfFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = getCSRFHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}
