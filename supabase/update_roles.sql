-- Run this in your Supabase SQL Editor

-- 1. Add 'Kakushi' to hunter_rank
ALTER TYPE hunter_rank ADD VALUE IF NOT EXISTS 'Kakushi';

-- 2. Add 'Candidate' to hunter_status
ALTER TYPE hunter_status ADD VALUE IF NOT EXISTS 'Candidate';

-- 3. Add user_id to hunters to link with auth.users
ALTER TABLE hunters ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Enable RLS (we disabled it earlier, let's re-enable and set secure policies)
ALTER TABLE hunters ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- 5. Create secure policies
-- For now, let's allow anyone authenticated to view and edit (simplified for development).
-- In production, we would check the 'rank' of the current user.
DROP POLICY IF EXISTS "Enable all access for public" ON hunters;
CREATE POLICY "Enable access for authenticated" ON hunters FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable all access for public" ON missions;
CREATE POLICY "Enable access for authenticated" ON missions FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable all access for public" ON mission_assignments;
CREATE POLICY "Enable access for authenticated" ON mission_assignments FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable all access for public" ON payrolls;
CREATE POLICY "Enable access for authenticated" ON payrolls FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable all access for public" ON medical_records;
CREATE POLICY "Enable access for authenticated" ON medical_records FOR ALL TO authenticated USING (true);
