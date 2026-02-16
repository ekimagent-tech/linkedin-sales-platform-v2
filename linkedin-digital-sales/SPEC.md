# LinkedIn Digital Sales Platform - 詳細規格書

## 項目概述
完整的 LinkedIn 自動化銷售平台，支援多帳戶管理、潛在客戶探索、自動化互動、審批工作流、會面預約和數據分析。

---

## 1. 帳戶管理 (86ewmawk0)

### 功能需求
- **多帳戶支援**: 同時管理多個 LinkedIn 帳戶
- **認證方式**:
  - Cookie 輸入 (手動粘貼 Li_at cookie)
  - API 認證 (LinkedIn API token)
- **帳戶狀態監控**: 即時顯示在線/離線/風險狀態
- **風估評估**: 
  - 綠色: 安全 (使用次數 < 50%)
  - 黃色: 警告 (使用次數 50-80%)
  - 紅色: 風險 (使用次數 > 80%)
- **每日限制追蹤**: 追蹤每日操作次數

### 數據模型
```prisma
model LinkedInAccount {
  id            String    @id @default(cuid())
  name          String    // 帳戶顯示名稱
  email         String    // LinkedIn 登錄郵箱
  cookie        String    // Li_at cookie (加密存儲)
  apiToken      String?   // LinkedIn API token
  status        AccountStatus @default(ACTIVE)
  riskLevel     RiskLevel @default(GREEN)
  dailyLimit    Int       @default(100)
  dailyUsed     Int       @default(0)
  lastUsed      DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum AccountStatus {
  ACTIVE
  SUSPENDED
  BANNED
}

enum RiskLevel {
  GREEN
  YELLOW
  RED
}
```

### API 端點
- `POST /api/accounts` - 新增帳戶
- `GET /api/accounts` - 獲取帳戶列表
- `GET /api/accounts/:id` - 獲取帳戶詳情
- `PUT /api/accounts/:id` - 更新帳戶
- `DELETE /api/accounts/:id` - 刪除帳戶
- `POST /api/accounts/:id/verify` - 驗證帳戶有效性

---

## 2. 潛在客戶探索 (86ewmawkt)

### 功能需求
- **關鍵詞搜索**: 通過關鍵詞、行業、職位搜索潛在客戶
- **銷售導航**: Sales Navigator 整合
- **過濾器**: 
  - 地區/國家
  - 公司規模
  - 職位級別
  - 行業
  - 關係程度
- **排序**: 按相關性、最近活動、公司名稱
- **CSV 導入**: 批量導入潛在客戶

### 數據模型
```prisma
model Prospect {
  id              String    @id @default(cuid())
  linkedInId      String    @unique // LinkedIn ID
  firstName       String
  lastName        String
  headline        String?   // 職位頭銜
  company         String?
  companySize     String?
  location        String?
  industry        String?
  profileUrl      String
  photoUrl        String?
  connectionDegree String?  // 1st, 2nd, 3rd
  notes           String?
  tags            String[]  // 自定義標籤
  status          ProspectStatus @default(NEW)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum ProspectStatus {
  NEW
  CONTACTED
  REPLIED
  CONNECTED
  MEETING_SCHEDULED
  CONVERTED
  ARCHIVED
}
```

### API 端點
- `GET /api/prospects` - 搜索/列表
- `POST /api/prospects/import` - CSV 導入
- `GET /api/prospects/:id` - 詳情
- `PUT /api/prospects/:id` - 更新
- `DELETE /api/prospects/:id` - 刪除

---

## 3. 自動化互動 (86ewmawu5)

### 功能需求
- **自動追蹤**: 關注目標用戶
- **自動連接**: 發送連接請求 (帶/不帶個人訊息)
- **自動按讚**: 對動態按讚
- **自動評論**: 對貼文評論
- **私訊發送**: 自動發送私信
- **腳本管理**: 預設多種訊息模板
- **延遲發送**: 設定發送時間

### 數據模型
```prisma
model AutomationRule {
  id            String    @id @default(cuid())
  name          String
  type          AutomationType
  isActive      Boolean   @default(true)
  accountId     String
  account       LinkedInAccount @relation(fields: [accountId], references: [id])
  
  // 目標設置
  targetKeywords String[] // 目標關鍵詞
  targetCompanies String[] // 目標公司
  targetTitles    String[] // 目標職位
  
  // 動作設置
  actionType    ActionType
  messageTemplate String? // 訊息模板
  delayDays     Int       @default(0) // 延遲天數
  
  // 限制
  dailyLimit    Int       @default(20)
  totalLimit    Int?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum AutomationType {
  FOLLOW
  CONNECT
  LIKE
  COMMENT
  MESSAGE
}

enum ActionType {
  LIKE_POST
  SEND_MESSAGE
  SEND_CONNECTION
  FOLLOW_PROFILE
}
```

### API 端點
- `GET /api/automations` - 規則列表
- `POST /api/automations` - 創建規則
- `PUT /api/automations/:id` - 更新規則
- `DELETE /api/automations/:id` - 刪除規則
- `POST /api/automations/:id/toggle` - 啟用/停用

---

## 4. 審批工作流 (86ewmawwd)

### 功能需求
- **AI 生成草稿**: AI 根據客戶資料生成個人化訊息
- **用戶審批**: 審核 AI 生成的訊息
- **延遲發送**: 審批後進入延遲發送隊列
- **審批歷史**: 完整記錄審批流程

### 數據模型
```prisma
model MessageDraft {
  id            String    @id @default(cuid())
  prospectId    String
  prospect      Prospect  @relation(fields: [prospectId], references: [id])
  accountId     String
  account       LinkedInAccount @relation(fields: [accountId], references: [id])
  
  content       String    // AI 生成的訊息
  actionType    ActionType
  
  status        DraftStatus @default(DRAFT)
  scheduledAt   DateTime?  // 預設發送時間
  sentAt        DateTime?
  
  // 審批
  approvedBy    String?
  approvedAt    DateTime?
  rejectionReason String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum DraftStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
  SCHEDULED
  SENT
  FAILED
}
```

### API 端點
- `POST /api/drafts/generate` - AI 生成草稿
- `GET /api/drafts` - 草稿列表
- `PUT /api/drafts/:id/approve` - 審批通過
- `PUT /api/drafts/:id/reject` - 審批拒絕
- `PUT /api/drafts/:id/schedule` - 設定延遲發送
- `POST /api/drafts/:id/send` - 立即發送

---

## 5. 會面預約 (86ewmawzh)

### 功能需求
- **模板管理**: 預約邀請模板
- **日曆整合**: Google Calendar / Outlook 同步
- **可用時間**: 設定可用預約時段
- **時區支援**: 自動時區轉換
- **確認郵件**: 自動發送確認郵件

### 數據模型
```prisma
model MeetingTemplate {
  id            String    @id @default(cuid())
  name          String
  title         String    // 會議標題模板
  description   String?   // 會議描述
  duration      Int       // 分鐘
  isDefault     Boolean   @default(false)
  createdAt     DateTime  @default(now())
}

model Meeting {
  id            String    @id @default(cuid())
  prospectId    String
  prospect      Prospect  @relation(fields: [prospectId], references: [id])
  
  templateId    String
  template      MeetingTemplate @relation(fields: [templateId], references: [id])
  
  title         String
  description   String?
  startTime     DateTime
  endTime       DateTime
  timezone      String
  
  status        MeetingStatus @default(SCHEDULED)
  calendarEventId String?   // Google Calendar event ID
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum MeetingStatus {
  SCHEDULED
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

### API 端點
- `GET /api/meetings/templates` - 模板列表
- `POST /api/meetings/templates` - 創建模板
- `GET /api/meetings` - 會議列表
- `POST /api/meetings` - 創建會議
- `PUT /api/meetings/:id/confirm` - 確認
- `PUT /api/meetings/:id/cancel` - 取消
- `GET /api/meetings/availability` - 可用時段

---

## 6. 儀表板分析 (86ewmaxar)

### 功能需求
- **數據總覽**: 帳戶、潛在客戶、會議統計
- **圖表分析**: 
  - 每日/每週/每月活動趨勢
  - 轉化漏斗
  - 互動類型分佈
- **活動日誌**: 完整的操作記錄
- **導出報告**: CSV/PDF 導出

### 數據模型
```prisma
model ActivityLog {
  id            String    @id @default(cuid())
  accountId     String?
  account       LinkedInAccount? @relation(fields: [accountId], references: [id])
  
  prospectId    String?
  prospect      Prospect? @relation(fields: [prospectId], references: [id])
  
  action        String    // 動作類型
  details       Json?     // 詳細信息
  status        String    // success/failed
  
  createdAt     DateTime  @default(now())
}
```

### API 端點
- `GET /api/analytics/overview` - 總覽數據
- `GET /api/analytics/trends` - 趨勢數據
- `GET /api/analytics/funnel` - 轉化漏斗
- `GET /api/activity` - 活動日誌
- `GET /api/activity/export` - 導出

---

## 技術架構

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + Shadcn/ui
- **Auth**: NextAuth.js
- **Database**: Vercel Postgres / Neon (Production), SQLite (Dev)
- **ORM**: Prisma
- **Deployment**: Vercel

### 數據庫選擇
- **開發**: SQLite (本地)
- **生產**: Vercel Postgres (最簡單的 Vercel 部署)

### 環境變量
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
LINKEDIN_API_KEY=...
OPENAI_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## UI/UX 設計方向

### 配色方案
- 主色: #0A66C2 (LinkedIn Blue)
- 背景: #F3F2EF (LinkedIn Gray)
- 強調: #057642 (LinkedIn Green)
- 危險: #CC1016 (LinkedIn Red)

### 佈局
- 左側邊欄: 導航菜單 (固定)
- 頂部: 搜索 + 用戶菜單
- 主內容: 根據頁面變化

### 響應式
- 桌面: 完整側邊欄
- 平板: 折疊側邊欄
- 手機: 底部導航
