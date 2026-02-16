# LinkedIn Digital Sales Platform - 開發計劃

## 項目概覽
- **項目名稱**: LinkedIn All-in-One Digital Sales Platform
- **任務 ID**: 86ewm6zk4
- **階段**: MVP 開發
- **預計工期**: 4-6 週

---

## MVP 功能範圍

### 核心功能 (MVP)
1. 用戶認證系統 (Email/Google OAuth)
2. LinkedIn 帳戶連接 (Cookie 方式)
3. 基本搜索功能 (關鍵詞 + Filters)
4. 自動按讚 + 追蹤
5. 簡單儀表板
6. 活動日誌

### 略過 (後期加入)
- AI 評論生成 (Phase 2)
- 會面預約 (Phase 3)
- 團隊協作 (Phase 4)
- CRM 集成 (Phase 4)

---

## 技術架構

### 技術棧
| 層面 | 技術 |
|------|------|
| Frontend | Next.js 14 + React + TypeScript + Tailwind CSS |
| UI Components | Shadcn/ui + Radix UI |
| Backend | Node.js + NestJS |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js |
| State | React Query + Zustand |
| Hosting | Vercel (Frontend) + Railway (Backend) |

### 項目結構
```
linkedin-sales-platform/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router
│   │   │   │   ├── (auth)/     # 登入/註冊
│   │   │   │   ├── (dashboard)/ # 主儀表板
│   │   │   │   │   ├── accounts/
│   │   │   │   │   ├── prospects/
│   │   │   │   │   ├── automation/
│   │   │   │   │   └── settings/
│   │   │   │   └── api/        # API Routes
│   │   │   ├── components/     # UI Components
│   │   │   ├── lib/            # Utilities
│   │   │   └── types/          # TypeScript Types
│   │   └── package.json
│   │
│   └── api/                    # NestJS Backend
│       ├── src/
│       │   ├── auth/           # 認證模組
│       │   ├── accounts/       # 帳戶管理
│       │   ├── prospects/     # 潛在客戶
│       │   ├── automation/    # 自動化引擎
│       │   ├── linkedin/      # LinkedIn 集成
│       │   └── analytics/     # 分析模組
│       └── package.json
│
├── packages/
│   ├── database/               # Prisma Schema
│   └── shared/                 # Shared Types/Utils
│
└── turbo.json                  # Turborepo Config
```

---

## 數據庫設計 (Prisma Schema)

### Core Entities
```prisma
// User & Account
User {
  id, email, name, avatar, role, createdAt
}

LinkedInAccount {
  id, userId, cookie, status, riskLevel, 
  dailyLimit, usedToday, lastSync
}

// Prospect Management  
Prospect {
  id, userId, linkedinId, name, title, company,
  location, profileUrl, notes, tags, createdAt
}

ProspectActivity {
  id, prospectId, accountId, type, status,
  content, scheduledAt, executedAt
}

// Automation Rules
AutomationRule {
  id, userId, name, trigger, conditions,
  actions, enabled, schedule
}

// Content Intelligence
ContentTopic {
  id, userId, keywords[], searchInterval,
  lastCrawl, status
}

ContentArticle {
  id, topicId, title, url, author,
  engagement, summary, createdAt
}
```

---

## API Endpoints (MVP)

### Auth
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入
- `GET /api/auth/session` - 獲取 session

### Accounts
- `GET /api/accounts` - 獲取帳戶列表
- `POST /api/accounts/connect` - 連接 LinkedIn
- `DELETE /api/accounts/:id` - 刪除帳戶

### Prospects
- `GET /api/prospects` - 獲取潛在客戶列表
- `POST /api/prospects/search` - 搜索潛在客戶
- `POST /api/prospects/import` - 導入 CSV

### Automation
- `GET /api/automation/rules` - 獲取自動化規則
- `POST /api/automation/rules` - 創建規則
- `POST /api/automation/execute` - 執行自動化

### Analytics
- `GET /api/analytics/dashboard` - 儀表板數據
- `GET /api/analytics/activities` - 活動日誌

---

## 開發任務清單

### Week 1: 基礎設施
- [ ] 1.1 初始化 Turborepo 項目
- [ ] 1.2 設置 Prisma Schema + PostgreSQL
- [ ] 1.3 實現 NextAuth.js 認證
- [ ] 1.4 基礎 UI Layout + Shadcn 配置
- [ ] 1.5 用戶註冊/登入頁面

### Week 2: 帳戶管理
- [ ] 2.1 LinkedIn Cookie 輸入組件
- [ ] 2.2 帳戶狀態監控 API
- [ ] 2.3 帳戶列表頁面
- [ ] 2.4 帳戶風險評估邏輯

### Week 3: 潛在客戶
- [ ] 3.1 潛在客戶搜索 API (Mock LinkedIn)
- [ ] 3.2 客戶列表頁面 + Filters
- [ ] 3.3 客戶詳情頁面
- [ ] 3.4 CSV 導入功能

### Week 4: 自動化引擎
- [ ] 4.1 自動化規則 CRUD
- [ ] 4.2 執行引擎 (按讚/追蹤)
- [ ] 4.3 速率限制邏輯
- [ ] 4.4 任務隊列處理

### Week 5: 儀表板
- [ ] 5.1 Dashboard API
- [ ] 5.2 統計卡片組件
- [ ] 5.3 活動日誌頁面
- [ ] 5.4 基本 Charts

### Week 6: 完善 + 部署
- [ ] 6.1 錯誤處理 + Loading States
- [ ] 6.2 環境變量配置
- [ ] 6.3 Vercel 部署
- [ ] 6.4 Railway 部署
- [ ] 6.5 QA + Bug Fixes

---

## LinkedIn API 策略 (MVP)

### 方案: Mock + Proxy
由於 LinkedIn 官方 API 審批嚴格，MVP 使用：

1. **瀏覽器自動化 (Puppeteer/Playwright)**
   - 用戶提供 Cookie 後，後端模擬操作
   - 風險：高，易被檢測

2. **第三方 API (推薦)**
   - Phantom Buster API
   - Proxycurl API
   - 成本：按請求收費

3. **Mock 數據**
   - MVP 前期使用模擬數據開發 UI
   - 上線前切換到真實 API

---

## 風險與緩解

| 風險 | 緩解 |
|------|------|
| LinkedIn 帳戶被封 | 嚴格速率限制 + 行為模擬 |
| 開發延期 | 每日 Standup + 優先級排序 |
| API 成本 | 從 Mock 開始，按需切換 |

---

## 下一步

1. **批準此計劃** → 開始 Week 1 開發
2. **調整範圍** → 反饋需修改的任務
3. **資源確認** → 確定開發時間

---

*最後更新: 2026-02-15*
