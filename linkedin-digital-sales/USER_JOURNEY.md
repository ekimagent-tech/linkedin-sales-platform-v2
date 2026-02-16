# LinkedIn Digital Sales Platform - User Journey Guide

## Overview

This platform automates LinkedIn sales activities using **browser automation (Playwright DevTools)** instead of LinkedIn API. This approach provides:
- Higher success rate (real browser sessions)
- Bypasses API rate limits
- Natural human-like behavior
- Full Sales Navigator support

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                        │
│  (Dashboard, Forms, Activity Logs, Analytics)             │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   API Layer (Next.js)                       │
│  /api/accounts, /api/prospects, /api/automations, etc.     │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              Browser Automation Engine                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Playwright Browser Controller                      │   │
│  │  - Launches Chromium with LinkedIn cookies         │   │
│  │  - Uses DevTools Protocol for automation            │   │
│  │  - Session pooling for multiple accounts            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │   LinkedIn Website    │
              │   (Real Browser)      │
              └───────────────────────┘
```

---

## Step 1: Initial Setup & Configuration

### 1.1 Account Connection

**Prerequisite:** Get your LinkedIn `li_at` cookie

1. Log in to LinkedIn in your browser
2. Press F12 → Application → Cookies → `https://www.linkedin.com`
3. Copy the `li_at` cookie value

**In the App:**
1. Navigate to **Accounts** page
2. Click **Add Account**
3. Enter:
   - Display Name: "My Sales Account"
   - Email: your LinkedIn email
   - Li_at Cookie: paste the cookie value
4. Click **Save**
5. System will verify the cookie and show status (Active/Suspended/Banned)

### 1.2 Browser Environment Setup

The automation runs on the **Ekim Ubuntu Worker** container:

| Component | Port | Purpose |
|-----------|------|---------|
| SSH | 2222 | Remote access |
| Code Server | 8443 | Development |
| Chrome DevTools | 9222 | Browser automation relay |

**Environment Variables Required:**
```env
# Browser Automation
CHROME_DEBUG_PORT=9222
CHROME_BINARY_PATH=/usr/bin/chromium
WORKER_HOST=ekim-ubuntu-worker:9222

# LinkedIn
LINKEDIN_SESSION_POOL_SIZE=5
```

---

## Step 2: Prospect Discovery Workflow

### 2.1 Search for Prospects

**Manual Search:**
1. Go to **Prospects** → **Search**
2. Enter keywords (e.g., "VP Sales", "Marketing Manager")
3. Set filters:
   - Location: Hong Kong / United States
   - Company Size: 51-200 employees
   - Connection Degree: 1st, 2nd
4. Click **Search**
5. Results load via browser automation (real LinkedIn search)

**Import from CSV:**
1. Prepare CSV with columns: `firstName,lastName,company,profileUrl`
2. Go to **Prospects** → **Import**
3. Upload CSV file
4. System adds prospects to database

### 2.2 Prospect Management

1. View prospect list with status tags
2. Click prospect to view details
3. Add notes, tags, or change status manually
4. Status flow: NEW → CONTACTED → REPLIED → CONNECTED → MEETING_SCHEDULED → CONVERTED

---

## Step 3: Automation Rules

### 3.1 Automation Rule Types

The platform supports **5 types** of automation rules:

| # | Rule Type | Description | LinkedIn Action |
|---|-----------|-------------|-----------------|
| 1 | **DIRECT_FOLLOW** | Follow specific profiles | Click "Follow" button |
| 2 | **DIRECT_CONNECT** | Send connection request to targeted profiles | Click "Connect" button |
| 3 | **NETWORK_EXPAND** | Find 1st/2nd connections of target accounts → check role → connect if relevant | Multi-step automation |
| 4 | **POST_ENGAGE** | Find new posts from connections → AI generates engaging reply | Like + Comment with AI |
| 5 | **POST_REPLY** | Reply to specific posts/threads | Comment with AI |

### 3.2 Creating Automation Rules

1. Navigate to **Automation** page
2. Click **Create Rule**
3. Configure:

| Field | Description | Example |
|-------|-------------|---------|
| Rule Name | Descriptive name | "Tech VP Network Expand" |
| Account | LinkedIn account to use | "Sales Account 1" |
| Rule Type | Type from table above | NETWORK_EXPAND |
| Target Keywords | Filter by job title | ["VP", "Director", "CTO", "Head of"] |
| Target Companies | Filter by company | ["Google", "Meta", "Amazon"] |
| Daily Limit | Max actions/day | 20 |
| Delay Between Actions | Seconds between actions | 30-120 (random) |
| Trigger Time | When to run | "09:00-12:00, 14:00-18:00" |
| Status | Active/Paused | Active |

### 3.3 Detailed Automation Templates

---

#### Template 1: Network Expansion (1st/2nd Connection Search)

**Use Case:** Find relevant professionals through your network and connect with them.

**Configuration:**
```
Rule Name: Network Expand - SaaS Decision Makers
Rule Type: NETWORK_EXPAND
Account: [Select LinkedIn Account]

Source Settings:
├── Target Profiles (Seed Accounts):
│   └── Add profiles of relevant people (e.g., industry leaders)
├── Connection Degree: 1st, 2nd
└── Include "Also viewed" suggestions: Yes

Filtering Criteria:
├── Job Title Keywords: ["VP", "Director", "Manager", "Head of", "CFO", "CTO"]
├── Exclude Keywords: ["Recruiter", "HR", "Talent"]
├── Company Size: [Any / Startup / Enterprise]
└── Location: [Any / Hong Kong / US / UK]

Action Settings:
├── Action: CONNECT
├── Personalize Message: Yes (template below)
├── Skip if Already Connected: Yes
└── Skip if Pending: Yes

Message Template:
"""
Hi {{firstName}},

I noticed we're both connected to {{mutualConnection}} and I was impressed by your role as {{headline}}.

I'd love to connect and learn more about your work at {{company}}.

Best regards
"""
```

**Workflow:**
1. Navigate to seed profile → Click "Connections" 
2. Scan 1st/2nd degree connections
3. Filter by job title/company keywords
4. Open profile → Extract headline & company
5. If matches criteria → Click "Connect"
6. Log with LinkedIn profile URL

---

#### Template 2: Post Engagement (AI-Powered)

**Use Case:** Find new posts from your connections and engage with intelligent, personalized replies.

**Configuration:**
```
Rule Name: AI Engage - Industry Posts
Rule Type: POST_ENGAGE
Account: [Select LinkedIn Account]

Source Settings:
├── Search Scope: My Connections' Posts
├── Time Range: Past 24 hours
├── Content Keywords: ["AI", "Automation", "SaaS", "Digital Transformation"]
└── Exclude: ["Job post", "Promotion", "Meme"]

Engagement Rules:
├── Always Like: Yes
├── Comment: Yes (AI-generated)
├── Minimum Engagement: >10 likes
└── Max Posts Per Day: 10

AI Comment Settings:
├── System Prompt:
│   """You are a professional sales executive. Write a 
│   thoughtful, value-adding comment on LinkedIn posts.
│   Requirements:
│   - Be specific to the post content
│   - Add insight or question (no generic "Great post!")
│   - Keep under 200 characters
│   - Avoid obvious sales pitches"""
├── Tone: Professional, Curious, Value-adding
├── Language: Match post language
└── Include Emoji: Optional
```

**Workflow:**
1. Go to LinkedIn Home feed
2. Filter posts from connections only
3. Scan for posts matching keywords
4. Extract post content & author profile
5. **For each post:**
   - Click "Like" (always)
   - Generate AI comment using system prompt + post content
   - Post comment
6. Log with LinkedIn post URL

---

#### Template 3: Direct Connect (Traditional)

**Use Case:** Connect with specific prospects from your prospect list.

**Configuration:**
```
Rule Name: Direct Connect - Warm Prospects
Rule Type: DIRECT_CONNECT
Account: [Select LinkedIn Account]

Target:
├── Source: Prospect List
├── Status Filter: NEW
├── Tags: ["warm", "target-account"]
└── Min Profile Completion: 80%

Action Settings:
├── Action: CONNECT
├── Personalize: Yes
├── Message Template:
│   """
│   Hi {{firstName}},
│   
│   I came across your profile and was impressed by your work 
│   at {{company}}. Would love to connect and explore potential 
│   synergies.
│   
│   Best
│   """
└── Skip if Already Connected: Yes
```

---

#### Template 4: Post Reply (Thread Engagement)

**Use Case:** Reply to specific posts or threads to build visibility.

**Configuration:**
```
Rule Name: Reply to Industry News
Rule Type: POST_REPLY
Account: [Select LinkedIn Account]

Target:
├── Search Query: "AI news" OR "Tech trends"
├── Source: LinkedIn Search / Company Posts
├── Time Range: Past 7 days
└── Min Engagement: >50 likes

Action Settings:
├── Action: COMMENT
├── Comment Type: AI-generated (template below)

Message Template:
"""
Great insight, {{authorFirstName}}! 

{{#if question_asked}}
Regarding your question about {{topic}}...
{{else}}
This resonates with what we're seeing in {{industry}}...
{{/if}}

Would love to discuss further.
"""
```

---

### 3.4 Rule Scheduling & Trigger Times

| Setting | Options | Description |
|---------|---------|-------------|
| Trigger Time | Cron expression or time range | When rule can fire |
| Day of Week | Mon-Sun | Which days active |
| Timezone | UTC / HKT | For time calculations |
| Max Runs | 1-10 per day | Firing limit per day |

**Examples:**
- `"09:00-12:00, 14:00-18:00"` → Business hours only
- `"09:00-10:00"` → Morning batch
- `"*/4 * * *"` → Every 4 hours
- `"0 9 * * 1-5"` → 9am weekdays

### 3.5 Rule Status Management

| Status | Color | Meaning |
|--------|-------|---------|
| DRAFT | Gray | Rule created, not active |
| ACTIVE | Green | Running per schedule |
| PAUSED | Yellow | Temporarily stopped |
| ERROR | Red | Failed, needs attention |
| COMPLETED | Blue | One-time rule finished |

### 3.6 Automation Logs

Each action creates a detailed log entry:

| Field | Description |
|-------|-------------|
| Log ID | Unique identifier |
| Timestamp | When action executed |
| Rule ID | Which rule triggered |
| Account | LinkedIn account used |
| Action Type | CONNECT/LIKE/COMMENT |
| Target URL | LinkedIn profile/post URL |
| Status | SUCCESS / FAILED / SKIPPED |
| Details | JSON with response |
| LinkedIn Reference | Direct link to profile/post |

**Log Entry Example:**
```json
{
  "id": "log_20260216_001",
  "timestamp": "2026-02-16T09:30:00Z",
  "rule": "Network Expand - SaaS",
  "account": "Sales Account 1",
  "action": "CONNECT",
  "target": {
    "name": "John Smith",
    "profileUrl": "https://www.linkedin.com/in/johnsmith/",
    "headline": "VP of Engineering at TechCorp",
    "connectionDegree": "2nd"
  },
  "status": "SUCCESS",
  "linkedinRef": "https://www.linkedin.com/in/johnsmith/",
  "message": "Connection request sent",
  "delay": 45
}
```

**Viewing Logs:**
1. Go to **Automation** → **Logs**
2. Filter by: Rule, Account, Status, Date Range
3. Click LinkedIn Reference URL to view target profile/post
4. Export to CSV for reporting

---

### 3.7 Message Templates

Create reusable message templates:

1. Go to **Settings** → **Templates**
2. Add template with variables:
   ```
   Hi {{firstName}},

   I came across your profile and was impressed by your work at {{company}}. 
   Would love to connect and learn more about your team's initiatives.

   Best regards
   ```
3. Use `{{field}}` for personalization

---

## Step 4: Approval Workflow

### 4.1 AI Message Generation

1. Select prospects in list
2. Click **Generate Messages**
3. AI analyzes prospect profile
4. Generates personalized message drafts

### 4.2 Review & Approve

1. Go to **Drafts** page
2. Review each AI-generated message
3. Options:
   - **Approve**: Send immediately or schedule
   - **Edit**: Modify before sending
   - **Reject**: Discard
4. Add scheduled time if needed

### 4.3 Sending

**Immediate:**
- Click **Send Now** after approval

**Scheduled:**
- System sends at scheduled time via automation engine

---

## Step 5: Meeting Scheduling

### 5.1 Calendar Integration

1. Go to **Settings** → **Calendar**
2. Connect Google Calendar or Outlook
3. Set available time slots

### 5.2 Creating Meetings

1. Select approved prospect
2. Click **Schedule Meeting**
3. Choose template (15min, 30min, 60min)
4. Select date/time
5. System sends invitation via LinkedIn

### 5.3 Meeting Management

- **Confirm**: Prospect confirms
- **Reschedule**: Change time
- **Cancel**: Cancel meeting

---

## Step 6: Monitoring & Analytics

### 6.1 Dashboard

View key metrics:
- Total accounts & status
- Prospects by stage
- Automation activity today
- Success/failure rates

### 6.2 Activity Log

1. Go to **Activity** page
2. See all actions with timestamps
3. Filter by account, action type, date
4. Export to CSV

### 6.3 Alerts

System alerts for:
- Account risk level changes (green→yellow→red)
- Automation failures
- Daily limit warnings

---

## Browser Automation Technical Details

### How It Works

The platform uses **Playwright** with Chrome DevTools Protocol:

```typescript
// Example: Connect automation
import { chromium } from 'playwright';

async function runAutomation(account: LinkedInAccount) {
  // Launch browser with account's cookie
  const browser = await chromium.connectOverCDP(
    `ws://${process.env.WORKER_HOST}:9222`
  );
  
  // Create new context with cookie
  const context = await browser.newContext({
    storageState: {
      cookies: [{ name: 'li_at', value: account.cookie, domain: '.linkedin.com' }]
    }
  });
  
  const page = await context.newPage();
  
  // Navigate and perform action
  await page.goto('https://www.linkedin.com/in/prospect-id');
  await page.click('button[aria-label="Connect"]');
  
  // Clean up
  await context.close();
}
```

### Session Management

| Feature | Implementation |
|---------|----------------|
| Cookie Storage | Encrypted in database |
| Session Pool | 5 concurrent browser contexts |
| Rate Limiting | Per-account daily limits |
| Random Delays | 30-120s between actions |
| Error Handling | Retry 3x, then mark failed |

### Error Recovery

1. **Cookie Expired**: Alert user, mark account as "needs re-auth"
2. **LinkedIn Rate Limited**: Pause automation, retry after 1 hour
3. **Action Failed**: Log error, move to next action
4. **Browser Crash**: Restart browser, resume queue

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cookie invalid" | li_at expired | Get new cookie from LinkedIn |
| "Action blocked" | Rate limit hit | Reduce daily limit, increase delay |
| "Account suspended" | Too many actions | Pause automation, wait 24h |
| "Browser not connecting" | Worker offline | Check Ubuntu Worker status |

### Checking Worker Status

```bash
# SSH into worker
ssh -p 2222 node@worker-host

# Check Chrome DevTools
curl http://localhost:9222/json/version
```

---

## Quick Start Checklist

- [ ] Deploy Ekim Ubuntu Worker (port 9222 for DevTools)
- [ ] Get LinkedIn li_at cookie
- [ ] Add account in platform
- [ ] Create prospect list (search or import)
- [ ] Create automation rule
- [ ] Enable and monitor

---

---

## Step 4: AI Draft Post Workflow [NOT YET DEVELOPED]

### Overview
This feature allows AI to generate post drafts for your review before posting to LinkedIn.

### Planned Workflow
1. **Content Topic Selection**: Choose topics/themes for the post
2. **AI Generation**: AI generates post content based on topic + your profile
3. **Draft Review**: You review and edit the AI-generated draft
4. **Approval**: Approve to queue for posting
5. **Scheduling**: Set publish date/time
6. **Posting**: Browser automation publishes to LinkedIn

### Configuration Fields (Planned)
```
Post Draft Settings:
├── Topic: [Industry insights, Product launch, Company news, Thought leadership]
├── Tone: [Professional, Casual, Educational, Inspirational]
├── Length: [Short (<100 words), Medium (100-200), Long (200-300)]
├── Include Hashtags: Yes/No
├── Hashtag Suggestions: [List]
├── Reference Links: [URLs to include]
└── CTA: [Question, Link click, Comment request]

AI System Prompt:
"""
You are a LinkedIn content creator specializing in [industry].
Write engaging posts that:
- Hook readers in first line
- Provide value/insights
- End with engagement question
- Use appropriate hashtags
- Match the specified tone
"""
```

### Status: NOT YET IMPLEMENTED
This feature needs to be built. Priority: Medium

---

## Missing Features Summary

| Feature | Status | Priority |
|---------|--------|----------|
| Browser Automation Engine | Not built | High |
| AI Post Draft Workflow | Not built | Medium |
| Network Expand Template | Needs implementation | High |
| Post Engage Template | Needs implementation | High |
| LinkedIn Log References | Needs implementation | High |
| Trigger Time Scheduling | Needs implementation | High |

---

## Next Steps

1. **Build Browser Automation Engine** - Core requirement
2. **Implement Network Expand Template** - User requested
3. **Implement Post Engage Template** - User requested
4. **Add detailed logging with LinkedIn URLs** - User requested
5. **Build AI Draft Post Workflow** - Future enhancement

### Dependencies
- Ekim Ubuntu Worker (port 9222 for DevTools) - ✅ Ready
- Playwright installed in project - ❌ Not installed
- Chrome with remote debugging - ✅ Ready
- Database schema for automation logs - ✅ Ready
