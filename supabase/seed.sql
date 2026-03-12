-- Seed data for local development.
-- Note: Users are created through Supabase Auth, which triggers profile creation.

-- Test user: test@example.com / TestPass123
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@example.com',
  crypt('TestPass123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;
