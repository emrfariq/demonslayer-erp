# 🗡️ Demon Slayer Corps ERP

> **"Destroy Demons. Protect Humanity."**  
> A Human Resource & Operations management system themed after Kimetsu no Yaiba.

Built with **Next.js 16**, **TypeScript**, **Supabase**, and **Tailwind CSS v4**.

---

## ✨ Features

- 🔐 **Role-Based Auth** — Oyakata (Super Admin), Hashira (Admin), Hunters (10 ranks), Kakushi, Candidate
- 👥 **Corps Management** — Recruit, view, and manage all corps members
- ⚔️ **Mission Dispatch** — Create missions, assign hunters, complete with auto hazard pay
- 🌸 **Butterfly Estate** — Track injuries and recovery (medical records)
- 💰 **Payroll** — Monthly compensation with hazard pay + deductions
- 🌐 **Public Landing Page** — Final Selection registration for new applicants

---

## 🚀 Getting Started (Contributor Setup)

### Prerequisites
- Node.js 18+
- A Supabase account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/emrfariq/demonslayer-erp.git
cd demonslayer-erp
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Option A — Team members (Recommended):** Ask the project owner to share their `.env.local`. You'll share the same database instance.  
> **Option B — Own Supabase:** Set up your own Supabase project — see steps below.

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗃️ Setting Up Your Own Supabase (Option B)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. In the **SQL Editor**, run these scripts **in order**:

   **Step 1 — Create the schema:**
   ```
   Copy & run: supabase/schema.sql
   ```

   **Step 2 — Add new enum values (run separately as a single statement):**
   ```sql
   ALTER TYPE hunter_rank ADD VALUE IF NOT EXISTS 'Oyakata';
   ```
   Then separately:
   ```sql
   ALTER TYPE hunter_rank ADD VALUE IF NOT EXISTS 'Kakushi';
   ```
   Then separately:
   ```sql
   ALTER TYPE hunter_status ADD VALUE IF NOT EXISTS 'Candidate';
   ```

   **Step 3 — Add user_id column:**
   ```sql
   ALTER TABLE hunters ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
   ```

   **Step 4 — Apply RLS policies:**
   ```
   Copy & run: supabase/update_roles.sql
   ```

3. Copy your API keys from **Project Settings → API** into `.env.local`

4. Seed dummy accounts by visiting: **`http://localhost:3000/api/seed`**

---

## 👤 Dev Login Accounts

After seeding, use the **Fast Login** buttons on `/login` (all use password `password123`):

| Role | Email |
|------|-------|
| 👑 Oyakata-sama (Super Admin) | `oyakata@corps.jp` |
| 🔥 Hashira — Rengoku (Admin) | `kyojuro@corps.jp` |
| 💧 Hunter — Tanjiro (Standard) | `tanjiro@corps.jp` |
| ⚡ Kakushi — Goto (Support) | `goto@corps.jp` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public landing page
│   ├── layout.tsx            # Root layout (auth-aware Navbar)
│   ├── (auth)/               # Login & Register pages
│   ├── dashboard/            # Stats command center
│   ├── hunters/              # Corps member management
│   ├── missions/             # Mission dispatch & tracking
│   ├── medical/              # Butterfly Estate (injuries)
│   ├── payroll/              # Compensation records
│   ├── actions.ts            # All Server Actions
│   └── api/seed/route.ts     # Dev seeding endpoint
├── components/
│   ├── layout/Navbar.tsx     # Role-aware navigation
│   ├── RecruitDialog.tsx
│   ├── DispatchMissionDialog.tsx
│   ├── MissionActions.tsx
│   └── DeductionDialog.tsx
├── lib/
│   ├── supabase/server.ts    # SSR Supabase client
│   └── types.ts              # TypeScript types
└── proxy.ts                  # Route protection (auth middleware)
```

> 📖 For full architecture and UI/UX design reference, read [`ai_documentation/flow.md`](./ai_documentation/flow.md)
