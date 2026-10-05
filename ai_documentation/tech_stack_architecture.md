# 🏗️ Demon Slayer ERP: Tech Stack & Database Architecture

## 1. Project Overview
Project Name: Oyakata-sama's Dashboard (Demon Slayer Corps ERP)
Description: A web-based Enterprise Resource Planning (ERP) system themed around the Demon Slayer anime. The user acts as Oyakata-sama, managing the entire organization from recruitment, dispatching missions, payroll, to medical leaves.

## 2. Tech Stack Recommendations (For AI Implementation)
*   **Framework:** Next.js 14+ (App Router) with TypeScript.
    *   *Why:* Fast, SEO-friendly (if needed later), and strict typing is crucial for complex ERP data.
*   **Styling:** Tailwind CSS + Shadcn UI.
    *   *Why:* Rapid UI development. Shadcn provides accessible, customizable components (tables, dialogs, forms) that can easily be styled with the Demon Slayer design system.
*   **State Management:** Zustand (for global states like user session, theme toggle) & TanStack Query (for server-state management, caching, and real-time mission updates).
*   **Form Validation:** React Hook Form + Zod.
    *   *Why:* Strict validation for creating hunters, missions, and payrolls.
*   **Database & Authentication (BaaS):** Supabase (PostgreSQL).
    *   *Why:* Provides instant backend, real-time database subscriptions (vital for mission tracking), and easy authentication.

## 3. Database Schema (Core Tables Draft)
*AI Instruction: Use this to generate Prisma schemas or Supabase SQL tables.*

1.  **`hunters` (Corps Members)**
    *   `id` (UUID, Primary Key)
    *   `name` (String)
    *   `rank` (Enum: Mizunoto to Hashira)
    *   `breathing_style` (String)
    *   `status` (Enum: Active, In Recovery, Deceased, Retired)
    *   `joined_date` (DateTime)

2.  **`missions` (Kasugai Crow Dispatch)**
    *   `id` (UUID, Primary Key)
    *   `title` (String)
    *   `location` (String)
    *   `threat_level` (Enum: Normal, Lower Moon, Upper Moon, Muzan)
    *   `status` (Enum: Pending, Ongoing, Completed, Failed)
    *   `reward_multiplier` (Float)

3.  **`mission_assignments` (Relational Table)**
    *   `mission_id` (FK to missions)
    *   `hunter_id` (FK to hunters)

4.  **`payrolls` (Compensation)**
    *   `id` (UUID, Primary Key)
    *   `hunter_id` (FK to hunters)
    *   `month_year` (String)
    *   `base_salary` (Decimal)
    *   `hazard_pay_bonus` (Decimal)
    *   `deductions` (Decimal) - *e.g., broken swords*

5.  **`medical_records` (Butterfly Estate)**
    *   `id` (UUID, Primary Key)
    *   `hunter_id` (FK to hunters)
    *   `injury_severity` (Enum: Light, Severe, Critical)
    *   `admission_date` (DateTime)
    *   `estimated_recovery_days` (Int)