# 🍽️ Open Purchase

**開源餐飲採購管理系統** - Open Source Restaurant Procurement Made Simple

## 📖 專案概述

Open Purchase 是一個開源餐飲採購管理系統，幫助餐廳簡化採購流程、追蹤庫存、分析成本。

## 🎯 目標

借鑒 AirPurchase 的成功經驗，創建一個開源、可自定義的餐飲採購解決方案。

## 🛠️ 技術棧

| 層面 | 技術 |
|------|------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind CSS |
| **UI Components** | shadcn/ui + Lucide Icons |
| **Charts** | Recharts |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL + Prisma ORM |
| **AI** | Claude API (成本分析、智能推薦) |
| **部署** | Vercel |
| **整合** | WhatsApp (Twilio) |

## 📦 核心功能

### 1. 採購管理 (Procurement)
- [x] 供應商管理 (CRUD)
- [x] 商品管理 (CRUD)
- [x] 訂單管理 (CRUD)
- [ ] 訂單審批流程
- [ ] 自動補貨提醒

### 2. 庫存追蹤 (Inventory)
- [x] 實時庫存監控
- [ ] 庫存調撥
- [ ] 浪費追蹤
- [ ] 保質期管理
- [ ] 多店庫存同步

### 3. 數據分析 (Analytics)
- [x] 採購趨勢圖表
- [x] 成本分析
- [ ] COGS 報表
- [ ] 供應商比較
- [ ] AI 智能洞察

### 4. 整合 (Integrations)
- [x] WhatsApp 訂單通知
- [ ] POS 整合
- [ ] 會計軟體整合 (Xero, QuickBooks)
- [ ] 支付整合 (AirWallex)

## 🚀 快速開始

### 前置要求

- Node.js 18+
- PostgreSQL (本地或雲端)
- Claude API Key (AI 功能)

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/yourusername/open-purchase.git
cd open-purchase

# 2. 安裝依賴
npm install

# 3. 設置環境變數
cp .env.example .env
# 編輯 .env 文件

# 4. 初始化資料庫
npx prisma migrate dev

# 5. 啟動開發服務器
npm run dev
```

### 環境變數

```env
DATABASE_URL="postgresql://..."
ANTHROPIC_API_KEY="sk-ant-api03-..."
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
```

## 📁 專案結構

```
open-purchase/
├── prisma/
│   └── schema.prisma      # 資料庫模型
├── src/
│   ├── app/
│   │   ├── (dashboard)/   # Dashboard 頁面
│   │   ├── api/           # API 路由
│   │   └── layout.tsx     # 全局布局
│   ├── components/        # React 元件
│   │   ├── ui/            # 基礎 UI 元件
│   │   └── dashboard/     # Dashboard 元件
│   └── lib/               # 工具函數
├── public/                # 靜態資源
└── package.json
```

## 🔌 API 端點

| 端點 | 方法 | 描述 |
|------|------|------|
| `/api/suppliers` | GET/POST | 供應商管理 |
| `/api/products` | GET/POST | 商品管理 |
| `/api/orders` | GET/POST | 訂單管理 |
| `/api/inventory` | GET/POST | 庫存管理 |
| `/api/ai/*` | POST | AI 分析功能 |

## 🎨 設計系統

### 色彩方案

| 顏色 | 名稱 | HEX |
|------|------|-----|
| 🟢 Primary | Emerald | #10B981 |
| 🔵 Secondary | Blue | #3B82F6 |
| 🟣 Accent | Purple | #8B5CF6 |
| ⚠️ Warning | Amber | #F59E0B |
| 🔴 Error | Red | #EF4444 |

### 圖標

使用 Lucide React 圖標庫。

## 🤖 AI 功能

### 成本分析
- 自動分析食材成本趨勢
- 提供成本優化建議
- 預測未來採購需求

### 智能推薦
- 供應商推薦
- 價格比較
- 採購時機建議

## 📱 WhatsApp 整合

使用 Twilio API 實現：
- 自動發送訂單給供應商
- 訂單狀態更新通知
- 庫存警報推送

## 🧪 測試

```bash
# 單元測試
npm run test

# E2E 測試
npm run test:e2e
```

## 📄 授權

MIT License - 詳見 LICENSE 文件。

## 🙏 參考

- [AirPurchase](https://www.airpurchase.com) - 靈感來源
- [shadcn/ui](https://ui.shadcn.com) - UI 設計參考
- [Prisma](https://prisma.io) - 資料庫工具
