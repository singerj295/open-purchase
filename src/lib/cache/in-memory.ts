/**
 * In-Memory Cache Service
 * 
 * 簡單嘅內存緩存，唔使額外服務
 * 適合開發/測試環境
 */

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

interface CacheConfig {
  defaultTTL: number; // 秒
  maxSize: number;    // 最大項目數
}

class CacheService {
  private cache: Map<string, CacheEntry<any>>;
  private config: CacheConfig;

  constructor(config: CacheConfig = { defaultTTL: 300, maxSize: 1000 }) {
    this.cache = new Map();
    this.config = config;

    // 定期清理過期項目 (每 5 分鐘)
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * 設置緩存
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // 檢查是否超過最大大小
    if (this.cache.size >= this.config.maxSize) {
      // 刪除最舊嘅項目
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const expiry = Date.now() + (ttl || this.config.defaultTTL) * 1000;
    this.cache.set(key, { value, expiry });
  }

  /**
   * 獲取緩存
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // 檢查是否過期
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * 刪除緩存
   */
  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  /**
   * 清空所有緩存
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * 檢查 key 是否存在
   */
  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 獲取或者設置 (如果存在就獲取，唔存在就設置)
   */
  async getOrSet<T>(
    key: string,
    getter: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const value = await getter();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * 清理過期項目
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 獲取統計信息
   */
  getStats(): { size: number; maxSize: number; keys: string[] } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

// ============================================
// 全局緩存實例
// ============================================

// 供應商緩存 (5 分鐘 TTL)
export const supplierCache = new CacheService({
  defaultTTL: 5 * 60,
  maxSize: 500
});

// 產品緩存 (5 分鐘 TTL)
export const productCache = new CacheService({
  defaultTTL: 5 * 60,
  maxSize: 1000
});

// 訂單緩存 (2 分鐘 TTL)
export const orderCache = new CacheService({
  defaultTTL: 2 * 60,
  maxSize: 200
});

// 庫存緩存 (1 分鐘 TTL - 經常變動)
export const inventoryCache = new CacheService({
  defaultTTL: 1 * 60,
  maxSize: 500
});

// ============================================
// 使用示例
// ============================================

/*
// 示例 1: 基本使用
import { productCache } from '@/lib/cache/in-memory';

// 設置緩存
await productCache.set('product-123', productData);

// 獲取緩存
const product = await productCache.get('product-123');

// 獲取或者設置
const supplier = await supplierCache.getOrSet(
  'supplier-123',
  async () => {
    // 如果緩存唔存在，執行呢個函數
    return await fetchSupplierFromDB('supplier-123');
  },
  5 * 60 // 5 分鐘 TTL
);

// 示例 2: 喺 API Route 使用
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // 使用緩存
  const supplier = await supplierCache.getOrSet(
    `supplier:${id}`,
    async () => {
      const { data } = await supabaseAdmin
        .from('Supplier')
        .select('*')
        .eq('id', id)
        .single();
      return data;
    },
    5 * 60
  );

  return Response.json({ data: supplier });
}

// 示例 3: 刪除緩存 (當數據更新時)
export async function updateSupplier(id: string, updates: any) {
  // 更新數據庫
  const { data } = await supabaseAdmin
    .from('Supplier')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  // 刪除緩存
  await supplierCache.delete(`supplier:${id}`);

  return { data };
}
*/

export { CacheService };
