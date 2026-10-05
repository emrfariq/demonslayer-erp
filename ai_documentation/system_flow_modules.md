# ⚙️ Demon Slayer ERP: System Flow & Business Logic

## 1. Global User Role
*   **Oyakata-sama (Super Admin):** Has full access to all modules, read/write permissions for every table.

## 2. Module Interactivity & Logic (AI Instructions)
*AI Instruction: Implement these logic triggers when building the API routes or Supabase Edge Functions.*

### A. Recruitment -> Member Management
*   **Trigger:** When a candidate's status in the "Final Selection" module is updated to `Passed`.
*   **Action:** Automatically create a new record in the `hunters` table with rank `Mizunoto` and status `Active`.

### B. Assignment (Missions) -> Medical & Payroll
*   **Trigger:** When Oyakata-sama marks a mission as `Completed`.
*   **Action 1 (Payroll):** Calculate `hazard_pay_bonus` based on the mission's `threat_level` and add it to the assigned hunters' upcoming payroll.
*   **Action 2 (Medical - Optional Dialog):** Prompt the admin: "Did any hunters sustain injuries?". If yes, redirect to Medical Module to log injuries.
*   **Action 3 (Evaluation):** Add +1 to the hunter's "Missions Completed" counter. If a hunter reaches a specific threshold (e.g., 50 missions or 1 Kizuki defeated), trigger an alert in the Evaluation Module for a potential Hashira promotion.

### C. Medical -> Assignment (Blocker)
*   **Trigger:** When a hunter is added to `medical_records` with an active admission.
*   **Action:** The hunter's global `status` changes to `In Recovery`. The system must **disable/grey out** this hunter in the Assignment Module so they cannot be dispatched on new missions until cleared by the Butterfly Estate.

### D. Inventory -> Payroll (Deductions)
*   **Trigger:** If Haganezuka (or the system) logs a "Sword Broken" event in the Inventory for a specific hunter.
*   **Action:** Automatically deduct a fixed penalty fee from that hunter's current month `deductions` field in the `payrolls` table.