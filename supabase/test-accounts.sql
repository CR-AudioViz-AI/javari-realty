-- CR REALTOR PLATFORM - TEST ACCOUNTS
-- Run this in Supabase SQL Editor to create test accounts

-- Create test admin user
DO $$ 
DECLARE
  admin_user_id uuid;
  realtor_user_id uuid;
BEGIN
  -- Admin user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@craudiovizai.com',
    crypt('Admin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated'
  )
  RETURNING id INTO admin_user_id;

  -- Create admin profile
  INSERT INTO profiles (id, email, full_name, role, is_active)
  VALUES (admin_user_id, 'admin@craudiovizai.com', 'Roy Henderson', 'platform_admin', true);

  -- Realtor user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'realtor@test.com',
    crypt('Realtor123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated'
  )
  RETURNING id INTO realtor_user_id;

  -- Create realtor profile
  INSERT INTO profiles (id, email, full_name, role, phone, is_active)
  VALUES (realtor_user_id, 'realtor@test.com', 'Test Realtor', 'realtor', '(239) 555-0123', true);

  RAISE NOTICE 'Test accounts created successfully!';
  RAISE NOTICE 'Admin: admin@craudiovizai.com / Admin123!';
  RAISE NOTICE 'Realtor: realtor@test.com / Realtor123!';
END $$;