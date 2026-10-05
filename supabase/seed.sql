-- Enable extension for UUID generation and crypto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CLEAN SLATE: Delete existing data to avoid conflicts
DELETE FROM auth.users WHERE email IN ('oyakata@corps.jp', 'kyojuro@corps.jp', 'tanjiro@corps.jp', 'goto@corps.jp');

-- 1. Insert Users into Supabase Auth safely
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token
)
VALUES 
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'oyakata@corps.jp', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), ''),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kyojuro@corps.jp', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), ''),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tanjiro@corps.jp', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), ''),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'goto@corps.jp', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '');

-- Insert into auth.identities
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
VALUES 
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', format('{"sub":"%s","email":"%s"}', '11111111-1111-1111-1111-111111111111', 'oyakata@corps.jp')::jsonb, 'email', now(), now()),
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', format('{"sub":"%s","email":"%s"}', '22222222-2222-2222-2222-222222222222', 'kyojuro@corps.jp')::jsonb, 'email', now(), now()),
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', format('{"sub":"%s","email":"%s"}', '33333333-3333-3333-3333-333333333333', 'tanjiro@corps.jp')::jsonb, 'email', now(), now()),
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', format('{"sub":"%s","email":"%s"}', '44444444-4444-4444-4444-444444444444', 'goto@corps.jp')::jsonb, 'email', now(), now());

-- 2. Insert into Hunters (Profiles)
INSERT INTO hunters (id, user_id, name, rank, breathing_style, status) VALUES 
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Kagaya Ubuyashiki', 'Oyakata', 'None', 'Active'),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Kyojuro Rengoku', 'Hashira', 'Flame Breathing', 'Active'),
('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Kamado Tanjiro', 'Mizunoto', 'Water Breathing', 'Active'),
('a4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Goto', 'Kakushi', 'None', 'Active')
ON CONFLICT DO NOTHING;

-- 3. Insert Missions
INSERT INTO missions (id, title, location, threat_level, status, reward_multiplier) VALUES 
('b1111111-1111-1111-1111-111111111111', 'Mugen Train Investigation', 'Mugen Train', 'Lower Moon', 'Completed', 2.5),
('b2222222-2222-2222-2222-222222222222', 'Mt. Natagumo Spiders', 'Mt. Natagumo', 'Lower Moon', 'Ongoing', 2.5)
ON CONFLICT DO NOTHING;

-- 4. Mission Assignments
INSERT INTO mission_assignments (mission_id, hunter_id) VALUES 
('b1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222'),
('b1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333'),
('b2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- 5. Payroll (for Mugen Train)
INSERT INTO payrolls (id, hunter_id, month_year, base_salary, hazard_pay_bonus, deductions) VALUES 
(uuid_generate_v4(), 'a2222222-2222-2222-2222-222222222222', '2026-10', 200000, 12500, 0),
(uuid_generate_v4(), 'a3333333-3333-3333-3333-333333333333', '2026-10', 10000, 12500, 0)
ON CONFLICT DO NOTHING;

-- 6. Medical Records
INSERT INTO medical_records (id, hunter_id, injury_severity, admission_date, estimated_recovery_days) VALUES 
(uuid_generate_v4(), 'a3333333-3333-3333-3333-333333333333', 'Severe', now() - interval '2 days', 30)
ON CONFLICT DO NOTHING;
