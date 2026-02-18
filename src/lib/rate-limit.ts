import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import RateLimit from 'express-rate-limit';

// 默認速率限制配置
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 分鐘窗口
const DEFAULT_MAX_REQUESTS = 100; // 每分鐘最多 100 個請求

// 敏感端點的更嚴格限制
const SENSITIVE_ENDPOINTS: Record<string, { windowMs: number; maxRequests: number }> = {
  '/api/v1': { windowMs: 60 * 1000, maxRequests: 30 }, // API 每分鐘 30 次
};

// 創建速率限制器工廠
export function createRateLimiter(options?: {
  windowMs?: number;
  maxRequests?: number;
  keyPrefix?: string;
}) {
  const windowMs = options?.windowMs || DEFAULT_WINDOW_MS;
  const maxRequests = options?.maxRequests || DEFAULT_MAX_REQUESTS;
  const keyPrefix = options?.keyPrefix || 'rl';

  // 使用 Map 存儲計數（生產環境推薦使用 Redis）
  const store = new Map<string, { count: number; resetTime: number }>();

  return {
    check: (request: NextRequest): { success: boolean; remaining: number; resetTime: number } => {
      // Get IP from headers (Next.js 16 doesn't have request.ip)
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
        || request.headers.get('x-real-ip') 
        || request.headers.get('cf-connecting-ip')
        || 'unknown';
      const key = `${keyPrefix}:${ip}`;
      const now = Date.now();
      
      let entry = store.get(key);
      
      if (!entry || now > entry.resetTime) {
        // 新窗口
        store.set(key, {
          count: 1,
          resetTime: now + windowMs,
        });
        return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs };
      }
      
      if (entry.count >= maxRequests) {
        return { success: false, remaining: 0, resetTime: entry.resetTime };
      }
      
      entry.count++;
      return { success: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
    },
    
    // 清理過期條目
    cleanup: () => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) {
          store.delete(key);
        }
      }
    },
    
    // 返回限制值供 headers 使用
    limit: maxRequests,
    windowMs,
  };
}

// 默認速率限制器（通用 API）
const defaultLimiter = createRateLimiter();

// 敏感端點速率限制器
const sensitiveLimiter = createRateLimiter({
  windowMs: SENSITIVE_ENDPOINTS['/api/v1'].windowMs,
  maxRequests: SENSITIVE_ENDPOINTS['/api/v1'].maxRequests,
  keyPrefix: 'rl-sensitive',
});

// 創建速率限制處理器
export function createRateLimitedHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: { sensitiveEndpoint?: boolean }
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    const limiter = options?.sensitiveEndpoint ? sensitiveLimiter : defaultLimiter;
    const { success, remaining, resetTime } = limiter.check(request);
    
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(limiter.limit));
    headers.set('X-RateLimit-Window', String(limiter.windowMs / 1000) + 's');
    
    if (!success) {
      headers.set('X-RateLimit-Remaining', '0');
      headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
      headers.set('Retry-After', String(Math.ceil((resetTime - Date.now()) / 1000)));
      
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'Too Many Requests',
        message: '速率限制已超出，請稍後再試'
      }), {
        status: 429,
        headers,
      });
    }
    
    headers.set('X-RateLimit-Remaining', String(remaining));
    
    const response = await handler(request);
    
    // 複製 headers 到響應
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value);
    }
    
    return response;
  };
}

// 導出自訂義 express-rate-limit 樣式的類（兼容未來擴展）
export { RateLimit };

// 獲取當前限制配置的輔助函數
export function getRateLimitConfig(endpoint: string) {
  for (const [prefix, config] of Object.entries(SENSITIVE_ENDPOINTS)) {
    if (endpoint.startsWith(prefix)) {
      return config;
    }
  }
  return { windowMs: DEFAULT_WINDOW_MS, maxRequests: DEFAULT_MAX_REQUESTS };
}
