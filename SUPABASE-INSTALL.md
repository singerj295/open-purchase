# Supabase 安裝指南

## 📋 步驟

### 1. 創建 Supabase 項目

1. 去 https://supabase.com
2. 登入/註冊
3. 點擊 "New Project"
4. 填寫項目資料：
   - Name: Open Purchase
   - Database Password: (記住密碼)
   - Region: 選擇最近嘅地區
5. 點擊 "Create new project"

### 2. 獲取 API Keys

1. 去 Settings → API
2. 複製以下 Key：
   - Project URL
   - anon/public key
   - service_role key (secret)

### 3. 設置環境變量

編輯 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. 運行 SQL Schema

1. 去 Supabase Dashboard → SQL Editor
2. 複製 `supabase-schema.sql` 內容
3. 貼上到 SQL Editor
4. 點擊 "Run"

### 5. 測試連接

```bash
cd /home/eeldon/.openclaw/workspace/open-purchase
npm run dev
```

訪問 http://localhost:3000/dashboard

---

## 📝 數據表結構

**Suppliers** - 供應商資料
- id, supplier_number, name, contact, phone, email, status

**Products** - 產品資料
- id, name, category, unit, sku, supplier_id

**Orders** - 訂單資料
- id, order_number, supplier_id, status, total_amount

**Order Items** - 訂單項目
- id, order_id, product_id, quantity, unit_price, total_price

**Inventory** - 庫存資料
- id, product_id, quantity, min_stock, max_stock

---

## ✅ 完成後

- ✅ Supabase 項目已創建
- ✅ 數據表已創建
- ✅ API Keys 已設置
- ✅ 可以開始開發功能

---

**維護者**: Nicole Chan 🌙
