import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CSRF Token 管理工具
 * 使用同步 token 方式，適合 Next.js App Router
 */

// 生成安全的隨機 token
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // 後備方案
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// 簡單的內存存儲（生產環境建議使用 Redis 或加密 cookie）
interface CSRFTokenEntry {
  token: string;
  createdAt: number;
}

const csrfTokenStore = new Map<string, CSRFTokenEntry>();
const CSRF_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 小時過期

/**
 * 創建 CSRF token 並存儲
 */
export function createCSRFToken(sessionId: string): string {
  const token = generateCSRFToken();
  csrfTokenStore.set(sessionId, {
    token,
    createdAt: Date.now(),
  });
  return token;
}

/**
 * 驗證 CSRF token
 */
export function validateCSRFToken(sessionId: string, providedToken: string): boolean {
  const entry = csrfTokenStore.get(sessionId);
  
  if (!entry) {
    return false;
  }
  
  // 檢查是否過期
  if (Date.now() - entry.createdAt > CSRF_TOKEN_EXPIRY_MS) {
    csrfTokenStore.delete(sessionId);
    return false;
  }
  
  // 檢查 token 是否匹配
  const isValid = entry.token === providedToken;
  
  // 驗證成功後刪除 token（一次性使用）
  if (isValid) {
    csrfTokenStore.delete(sessionId);
  }
  
  return isValid;
}

/**
 * 清理過期的 CSRF token
 */
export function cleanupExpiredCSRFTokens() {
  const now = Date.now();
  for (const [sessionId, entry] of csrfTokenStore.entries()) {
    if (now - entry.createdAt > CSRF_TOKEN_EXPIRY_MS) {
      csrfTokenStore.delete(sessionId);
    }
  }
}

// CSRF header 名稱
export const CSRF_HEADER = 'x-csrf-token';
export const CSRF_COOKIE = 'csrf-token';

/**
 * CSRF 中間件工廠函數
 * 用於保護 API 路由
 */
export function createCSRFProtectedHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: { 
    skipMethods?: string[]; // 不需要 CSRF 保護的 HTTP 方法 (如 GET, HEAD, OPTIONS)
    sessionExtractor?: (request: NextRequest) => string | null; // 從請求中提取 session ID
  }
) {
  const skipMethods = options?.skipMethods ?? ['GET', 'HEAD', 'OPTIONS'];
  
  return async function CSRFProtectedHandler(request: NextRequest): Promise<NextResponse> {
    // GET, HEAD, OPTIONS 請求跳過 CSRF 檢查
    if (skipMethods.includes(request.method)) {
      return handler(request);
    }
    
    // 提取 session ID
    let sessionId: string | null = null;
    
    if (options?.sessionExtractor) {
      sessionId = options.sessionExtractor(request);
    } else {
      // 默認從 Authorization header 或 cookie 提取
      const authHeader = request.headers.get('authorization');
      const cookie = request.cookies.get('auth-token');
      
      if (authHeader) {
        sessionId = authHeader.replace('Bearer ', '');
      } else if (cookie) {
        sessionId = cookie.value;
      }
    }
    
    if (!sessionId) {
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'CSRF Error',
        message: '無法識別會話，請重新登入'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 從 header 獲取 CSRF token
    const csrfToken = request.headers.get(CSRF_HEADER);
    
    if (!csrfToken) {
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'CSRF Error',
        message: '缺少 CSRF token'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 驗證 CSRF token
    if (!validateCSRFToken(sessionId, csrfToken)) {
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'CSRF Error',
        message: 'CSRF token 無效或已過期'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 驗證通過，執行處理函數
    return handler(request);
  };
}

/**
 * 設置 CSRF 相關的響應 headers
 */
export function setCSRFCookies(response: NextResponse, csrfToken: string): void {
  // 設置 CSRF token cookie（HttpOnly = false，讓客戶端可以讀取）
  response.cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false, // 允許客戶端 JavaScript 讀取
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // 嚴格的 SameSite 設置
    maxAge: CSRF_TOKEN_EXPIRY_MS / 1000,
    path: '/',
  });
}

/**
 * 清除 CSRF cookie
 */
export function clearCSRFCookies(response: NextResponse): void {
  response.cookies.delete(CSRF_COOKIE);
}
