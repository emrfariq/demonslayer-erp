# Demon Slayer Corps ERP — Project Flow & UI/UX Guide

> **For AI Reading This File:**  
> This document is a comprehensive guide for understanding the structure, data models, user roles, page flows, and design system of the **Demon Slayer Corps ERP** — a fictional Human Resource & Operations management system themed after the *Kimetsu no Yaiba (Demon Slayer)* universe.  
> Your goal reading this: understand how the app works so you can design or improve its UI/UX.

---

## 1. Project Overview

| Item | Detail |
|------|--------|
| **App Name** | Demon Slayer Corps ERP (Oyakata-sama's Dashboard) |
| **Theme** | Kimetsu no Yaiba — a Japanese anime/manga. Corps members (Demon Slayers) are managed like employees in a military organization. |
| **Purpose** | HR & Operations management: recruit hunters, dispatch missions, manage injuries (Butterfly Estate), and run payroll. |
| **Tech Stack** | Next.js 16 (App Router), TypeScript, Supabase (PostgreSQL + Auth), Tailwind CSS v4, Shadcn/UI components |
| **Deployment** | Dev: `npm run dev` on localhost:3000 |

---

## 2. User Roles & Access Hierarchy

The system has a strict role hierarchy stored as PostgreSQL ENUM (`hunter_rank`):

```
Oyakata (Super Admin)
  └── Hashira (Admin)
        └── Kinoe → Kinoto → Hinoe → Hinoto → Tsuchinoe → Tsuchinoto → Kanoe → Kanoto → Mizunoe → Mizunoto (Standard Hunters)
                                                                                                          Kakushi (Support Staff)
                                                                                                          Candidate (Applicant, not yet active)
```

### Role Permissions Matrix

| Feature | Oyakata | Hashira | Hunter (all ranks) | Kakushi | Candidate |
|---|:---:|:---:|:---:|:---:|:---:|
| View Dashboard | ✅ | ✅ | ✅ | ✅ | ❌ |
| View All Corps Members | ✅ | ✅ | ❌ | ❌ | ❌ |
| Recruit New Hunter | ✅ | ✅ | ❌ | ❌ | ❌ |
| View All Missions | ✅ | ✅ | Own Only | ❌ | ❌ |
| Dispatch Mission | ✅ | ✅ | ❌ | ❌ | ❌ |
| Complete Mission | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Butterfly Estate | ✅ | ✅ | ❌ | ✅ | ❌ |
| Admit to Medical | ✅ | ✅ | ❌ | ✅ | ❌ |
| View All Payroll | ✅ | ✅ | Own Only | ❌ | ❌ |
| Issue Deduction (Fine) | ✅ | ✅ | ❌ | ✅ | ❌ |
| Public Landing Page | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register (Final Selection) | Public | Public | — | — | — |

### Dev Fast Login Accounts

All dev accounts use password `password123`:

| Email | Role | Color Theme |
|---|---|---|
| `oyakata@corps.jp` | Oyakata (Super Admin) | Primary Blue |
| `kyojuro@corps.jp` | Hashira (Rengoku) | Fire Red/Orange |
| `tanjiro@corps.jp` | Mizunoto (Hunter) | Water Blue |
| `goto@corps.jp` | Kakushi | Thunder Yellow |

---

## 3. Database Schema

### Tables

#### `hunters` — Corps Members
```sql
id            UUID PRIMARY KEY
user_id       UUID → auth.users(id)   -- Links to login account
name          VARCHAR(255)
rank          ENUM(Mizunoto...Hashira, Oyakata, Kakushi, Candidate)
breathing_style VARCHAR(100)          -- e.g. "Water Breathing", "Flame Breathing"
status        ENUM(Active, In Recovery, Deceased, Retired)
joined_date   TIMESTAMP
```

#### `missions` — Kasugai Crow Dispatches
```sql
id              UUID PRIMARY KEY
title           VARCHAR(255)          -- e.g. "Mugen Train Investigation"
location        VARCHAR(255)          -- e.g. "Mugen Train"
threat_level    ENUM(Normal, Lower Moon, Upper Moon, Muzan)
status          ENUM(Pending, Ongoing, Completed, Failed)
reward_multiplier DECIMAL             -- 1.0 (Normal) → 10.0 (Muzan)
```

#### `mission_assignments` — Many-to-Many: Mission ↔ Hunter
```sql
mission_id  UUID → missions(id)
hunter_id   UUID → hunters(id)
assigned_at TIMESTAMP
PRIMARY KEY (mission_id, hunter_id)
```

#### `payrolls` — Monthly Compensation
```sql
id              UUID PRIMARY KEY
hunter_id       UUID → hunters(id)
month_year      VARCHAR(7)            -- Format: "YYYY-MM"
base_salary     DECIMAL               -- e.g. 10000 (Mizunoto)
hazard_pay_bonus DECIMAL              -- Added automatically when mission completes: 5000 × reward_multiplier
deductions      DECIMAL               -- Fines (broken sword, etc.)
-- Net Pay = base_salary + hazard_pay_bonus - deductions
```

#### `medical_records` — Butterfly Estate
```sql
id                    UUID PRIMARY KEY
hunter_id             UUID → hunters(id)
injury_severity       ENUM(Light, Severe, Critical)
admission_date        TIMESTAMP
estimated_recovery_days INT
cleared_date          TIMESTAMP NULL  -- null = still in recovery
```

---

## 4. Page Structure & Routes

### Public Routes (no login required)
```
/                   → Landing Page (public recruitment)
/login              → Corps Member login
/register           → Final Selection registration form (creates Candidate account)
```

### Protected Routes (login required)
```
/dashboard          → Stats overview (all roles)
/hunters            → Corps Members list (Oyakata, Hashira only)
/missions           → Mission management (Oyakata, Hashira; Hunters see own)
/medical            → Butterfly Estate (Oyakata, Hashira, Kakushi)
/payroll            → Payroll records (Oyakata, Hashira see all; Hunters see own)
```

---

## 5. Page-by-Page Flow

### `/ ` — Landing Page
- **Who sees it:** Public (unauthenticated users)
- **Purpose:** Recruitment poster. Invites civilians to apply for Final Selection.
- **CTAs:**
  - "Register for Final Selection" → `/register`
  - "Corps Member Login" → `/login`
- **Design:** Dark, cinematic hero section. Tagline: *"Destroy Demons. Protect Humanity."*

---

### `/login` — Corps Login
- **Who sees it:** Unauthenticated users (authenticated users are redirected to `/dashboard`)
- **Components:**
  - Email + Password form → calls `loginAction()` Server Action → `supabase.auth.signInWithPassword` → redirect to `/dashboard`
  - **Fast Login buttons (Dev Mode):** 4 colored buttons (Oyakata / Hashira / Hunter / Kakushi) that auto-fill and submit with `password123`
- **Design:** Card centered on screen. Corps seal aesthetic.

---

### `/register` — Final Selection (Public Registration)
- **Who sees it:** Public (civilians applying to join the Corps)
- **Flow:** Fill name, email, password → `registerAction()` → `supabase.auth.signUp` → insert into `hunters` with `rank: Mizunoto`, `status: Candidate`
- **After registration:** Candidate must be approved by a Hashira/Oyakata to become Active. *(Approval UI: not yet implemented — future feature)*
- **Design:** Themed as a "Final Selection" exam application. Dramatic, serious tone.

---

### `/dashboard` — Command Center
- **Who sees it:** All authenticated roles
- **Data shown:**
  - Total Corps Members (`hunters` count)
  - Active Missions (`missions` where `status = Ongoing`)
  - Hunters in Recovery (`medical_records` where `cleared_date IS NULL`)
- **Quick actions (Oyakata/Hashira):** Recruit Hunter button, Dispatch Mission button
- **Design:** 3-column stat cards. Grand header with title "Oyakata-sama's Dashboard".

---

### `/hunters` — Corps Members
- **Who sees it:** Oyakata, Hashira only
- **Data shown:** Table of all hunters — Name, Rank (badge), Breathing Style, Status
- **Actions:**
  - "Recruit Hunter" button → opens `RecruitDialog` modal → `recruitHunter()` action → creates hunter with `rank: Mizunoto`, `status: Active`
  - Each row: "Admit to Medical" action (if Active)
- **Design:** Data table with rank badges color-coded by tier. Empty state: "The Corps awaits brave souls."

---

### `/missions` — Kasugai Crow Dispatch
- **Who sees it:** Oyakata, Hashira (all); Hunters (only missions they're assigned to — *not yet filtered, future work*)
- **Data shown:** Table — Mission title, Location, Threat Level (badge), Assigned Hunters (badges), Status, Actions
- **Threat Level Badge Colors:**
  - `Normal` → muted gray
  - `Lower Moon` → fire orange/red
  - `Upper Moon` / `Muzan` → blood red
- **Actions (per row, if status = Ongoing):**
  - "Complete Mission" → `completeMission()` → marks mission `Completed` + auto-generates hazard pay on `payrolls` for all assigned hunters (`bonus = 5000 × reward_multiplier`)
  - "Report Injury" → `admitToMedical()` → creates medical record + sets hunter status to `In Recovery`
- **Header action:** "Dispatch Mission" → opens `DispatchMissionDialog` → select hunters from dropdown checkboxes → `dispatchMission()` → creates mission + assignments
- **Reward Multiplier Logic:**
  - Normal: 1.0×
  - Lower Moon: 2.5×
  - Upper Moon: 5.0×
  - Muzan: 10.0×

---

### `/medical` — Butterfly Estate
- **Who sees it:** Oyakata, Hashira, Kakushi
- **Data shown:** Table of medical records — Hunter name & rank, Injury Severity (badge), Admission Date, Recovery Days, Cleared Date (null = still recovering)
- **Severity Badge Colors:**
  - `Light` → green/muted
  - `Severe` → orange/fire
  - `Critical` → blood red
- **Future actions:** "Clear for Duty" button (sets `cleared_date` + restores hunter status to `Active`)

---

### `/payroll` — Compensation Records
- **Who sees it:** Oyakata, Hashira (all records); Kakushi (all records); Standard Hunters (own records only)
- **Data shown:** Table — Month/Year, Hunter Name & Rank, Base Salary, Hazard Pay, Deductions, **Net Total**
- **Net Total formula:** `base_salary + hazard_pay_bonus - deductions`
- **Actions (Oyakata, Hashira, Kakushi only):**
  - "Fine" / Issue Deduction → opens `DeductionDialog` → enter amount → `addDeduction()` → adds to `deductions` column
- **Design:** Amounts displayed in ¥ (Yen). Color coding: Hazard pay = green, Deductions = blood red.

---

## 6. Key Server Actions (`src/app/actions.ts`)

| Action | Trigger | What It Does |
|---|---|---|
| `loginAction(formData)` | Login form submit | `signInWithPassword` → redirect `/dashboard` |
| `registerAction(formData)` | Register form submit | `signUp` → insert hunter as `Candidate/Mizunoto` |
| `logoutAction()` | Logout button | `signOut` → redirect `/login` |
| `recruitHunter(formData)` | Recruit dialog | Insert hunter as `Active/Mizunoto` (no auth account) |
| `dispatchMission(formData, hunterIds[])` | Dispatch dialog | Create mission + create mission_assignments |
| `completeMission(missionId, multiplier)` | Mission table action | Set mission `Completed` + upsert payroll hazard pay for all assigned hunters |
| `admitToMedical(hunterId, severity, days)` | Mission table action | Insert medical_record + set hunter `In Recovery` |
| `addDeduction(payrollId, amount)` | Payroll table action | Add to `deductions` on existing payroll row |

---

## 7. Auth & Routing Flow

```
User visits URL
      ↓
proxy.ts (Next.js Proxy, replaces middleware.ts)
      ↓
Check Supabase session (supabase.auth.getUser())
      ↓
No session + protected route → redirect /login
Logged in + /login or /register → redirect /dashboard
      ↓
Page renders → fetches user profile from hunters table (by user_id)
      ↓
Navbar renders correct links based on profile.rank
      ↓
Page content filtered by role
```

---

## 8. Design System

### Color Palette (Demon Slayer Custom Colors)

| Token | Hex | Usage |
|---|---|---|
| `ds-green` | `#2C5D3F` | Ichimatsu pattern green (secondary, Corps identity) |
| `ds-black` | `#1A1A1A` | Background, foreground base |
| `ds-burgundy` | `#8A2C31` | Navbar sword icon, danger accents |
| `ds-water` | `#2A75D3` | Water Breathing (primary CTA, Tanjiro theme) |
| `ds-fire` | `#E25B45` | Flame Breathing (Rengoku, warnings, fines) |
| `ds-pink` | `#F4A7B9` | Butterfly Estate (Shinobu, medical theme) |
| `ds-thunder` | `#F4C23D` | Thunder Breathing (Zenitsu, Kakushi theme) |
| `ds-blood` | `#8A0303` | Demon blood (destructive, critical injuries) |
| `ds-plum` | `#3E1F47` | Muzan / dark villain theme |

### Typography
- **Heading Font:** `Cinzel` (Google Fonts) — Serif, formal, Japanese-inspired Latin script. Used for page titles, card headers.
- **Body Font:** `Geist Sans` — Clean, modern sans-serif. Used for data, labels, descriptions.

### Theme Mode
- Currently: **Light Mode** (Corps Day Mode)
- Dark mode CSS variables defined but not yet toggled.

### Component Library
- Base: **Shadcn/UI** (Card, Table, Badge, Dialog, Input, Button, Label, Select, Textarea)
- Dialogs use Base UI `render` prop pattern (not `asChild`)

---

## 9. Component Map

```
src/
├── app/
│   ├── page.tsx                    → Landing Page (public)
│   ├── layout.tsx                  → Root layout: fetches user+profile, renders Navbar
│   ├── (auth)/
│   │   ├── login/page.tsx          → Login form + Fast Login dev buttons
│   │   └── register/page.tsx       → Final Selection registration
│   ├── dashboard/page.tsx          → Stats command center
│   ├── hunters/page.tsx            → Corps Members table
│   ├── missions/page.tsx           → Missions table + dispatch
│   ├── medical/page.tsx            → Butterfly Estate table
│   ├── payroll/page.tsx            → Payroll table + deductions
│   ├── actions.ts                  → All Server Actions
│   └── api/seed/route.ts           → Dev route: creates dummy users via Supabase Admin API
├── components/
│   ├── layout/Navbar.tsx           → Role-aware navbar + logout
│   ├── RecruitDialog.tsx           → Modal: recruit new hunter
│   ├── DispatchMissionDialog.tsx   → Modal: create mission + select hunters
│   ├── MissionActions.tsx          → Inline action buttons: complete mission / report injury
│   └── DeductionDialog.tsx         → Modal: issue salary deduction/fine
├── lib/
│   ├── supabase/server.ts          → SSR Supabase client (uses cookies)
│   └── types.ts                    → TypeScript types (Hunter, Mission, etc.)
└── proxy.ts                        → Auth protection (replaces deprecated middleware.ts)
```

---

## 10. Pending / Future Features

These features are NOT yet implemented and are priority UI/UX areas:

1. **Candidate Approval Flow** — Hashira/Oyakata can review `Candidate` hunters and promote them to `Mizunoto` (Active). Needs a dedicated UI section in `/hunters` with a "Pending Candidates" tab.

2. **"Clear for Duty"** — Button on Butterfly Estate to discharge a recovered hunter (set `cleared_date`, reset `status → Active`).

3. **Mission Filter by Role** — Standard Hunters should only see missions they're assigned to on `/missions`.

4. **Rank Promotion** — UI to manually promote a hunter's rank (Mizunoto → Mizunoe → ... → Hashira).

5. **Dark Mode Toggle** — CSS variables for dark mode already exist but the toggle button is not implemented.

6. **Dashboard Enhancements** — Real-time stat for "Hunters in Recovery" (currently hardcoded 0), recent activity feed, mission completion trend chart.

7. **Profile Page** — Each hunter can view their own profile: rank, missions, payroll history, medical history.

---

## 11. Naming & Lore Glossary

| Term | Meaning in App |
|---|---|
| Oyakata-sama | Super Admin (Kagaya Ubuyashiki) |
| Hashira | Admin (Pillars of the Corps) |
| Kinoe → Mizunoto | Hunter ranks (10 tiers, Kinoe = highest, Mizunoto = entry-level) |
| Kakushi | Support Staff (cleanup crew, not fighters) |
| Candidate | New applicant who passed registration but not yet approved |
| Final Selection | The registration / onboarding process |
| Kasugai Crow | Dispatch system (missions are sent by crow) |
| Butterfly Estate | Medical facility run by Kanao/Shinobu |
| Breathing Style | Employee specialization/skill (e.g., Water Breathing, Flame Breathing) |
| Hazard Pay | Mission completion bonus, scales with threat level |
| Reward Multiplier | Scales with threat: Normal 1×, Lower Moon 2.5×, Upper Moon 5×, Muzan 10× |
