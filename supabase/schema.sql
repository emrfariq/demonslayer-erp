-- Demon Slayer Corps ERP: Supabase Database Schema

-- 1. Enums
CREATE TYPE hunter_rank AS ENUM (
  'Mizunoto', 'Mizunoe', 'Kanoto', 'Kanoe', 
  'Tsuchinoto', 'Tsuchinoe', 'Hinoto', 'Hinoe', 
  'Kinoto', 'Kinoe', 'Hashira'
);

CREATE TYPE hunter_status AS ENUM (
  'Active', 'In Recovery', 'Deceased', 'Retired'
);

CREATE TYPE threat_level AS ENUM (
  'Normal', 'Lower Moon', 'Upper Moon', 'Muzan'
);

CREATE TYPE mission_status AS ENUM (
  'Pending', 'Ongoing', 'Completed', 'Failed'
);

CREATE TYPE injury_severity AS ENUM (
  'Light', 'Severe', 'Critical'
);


-- 2. Tables

-- Hunters (Corps Members)
CREATE TABLE hunters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  rank hunter_rank NOT NULL DEFAULT 'Mizunoto',
  breathing_style VARCHAR(100),
  status hunter_status NOT NULL DEFAULT 'Active',
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missions (Kasugai Crow Dispatch)
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  threat_level threat_level NOT NULL DEFAULT 'Normal',
  status mission_status NOT NULL DEFAULT 'Pending',
  reward_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mission Assignments (Relational Table)
CREATE TABLE mission_assignments (
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  hunter_id UUID REFERENCES hunters(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (mission_id, hunter_id)
);

-- Payrolls (Compensation)
CREATE TABLE payrolls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hunter_id UUID REFERENCES hunters(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  base_salary DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  hazard_pay_bonus DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  deductions DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Records (Butterfly Estate)
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hunter_id UUID REFERENCES hunters(id) ON DELETE CASCADE,
  injury_severity injury_severity NOT NULL,
  admission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estimated_recovery_days INT NOT NULL,
  cleared_date TIMESTAMP WITH TIME ZONE, -- null if still in recovery
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
-- Oyakata-sama (Super Admin) will interact through an admin API or authenticated session
ALTER TABLE hunters ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Create policies (Example: Allow authenticated users full access for now)
-- In a real production environment, you would restrict this specifically to Oyakata-sama's UUID/Role.
CREATE POLICY "Enable all access for authenticated users" ON hunters FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON missions FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON mission_assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON payrolls FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON medical_records FOR ALL TO authenticated USING (true);
