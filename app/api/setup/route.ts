import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Database setup endpoint - checks migration status
// Since we can't run raw SQL without DATABASE_URL, this endpoint:
// 1. GET: Checks if required tables exist
// 2. POST: Returns the SQL that needs to be run

const MIGRATION_SQL = `
-- CR REALTOR PLATFORM - COMPLETE DATABASE SCHEMA
-- Run this SQL in Supabase Dashboard > SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client',
  avatar_url TEXT,
  license_number TEXT,
  license_state TEXT,
  brokerage TEXT,
  bio TEXT,
  specialties TEXT[],
  service_areas TEXT[],
  years_experience INTEGER,
  is_admin BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES profiles(id),
  mls_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT DEFAULT 'single_family',
  status TEXT DEFAULT 'active',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  county TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  price NUMERIC(12, 2) NOT NULL,
  bedrooms INTEGER,
  bathrooms NUMERIC(3, 1),
  sqft INTEGER,
  lot_size NUMERIC(10, 2),
  year_built INTEGER,
  features TEXT[],
  photos TEXT[],
  primary_image_url TEXT,
  virtual_tour_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  listed_date DATE,
  sold_date DATE,
  sold_price NUMERIC(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtor customers table
CREATE TABLE IF NOT EXISTS realtor_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID,
  agent_id UUID REFERENCES profiles(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT DEFAULT 'email',
  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),
  preferred_locations TEXT[],
  property_types TEXT[],
  notes TEXT,
  status TEXT DEFAULT 'active',
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtor leads table
CREATE TABLE IF NOT EXISTS realtor_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'new',
  source TEXT,
  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),
  preferred_locations TEXT[],
  property_type TEXT,
  notes TEXT,
  last_contact_date TIMESTAMPTZ,
  next_followup_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  category TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  is_preferred BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY IF NOT EXISTS "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "properties_public_read" ON properties FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "organizations_public_read" ON organizations FOR SELECT USING (true);

-- Create profiles for existing auth users
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  CASE 
    WHEN email LIKE '%tony%' OR email LIKE '%laura%' THEN 'realtor'
    WHEN email LIKE '%@craudiovizai.com' THEN 'platform_admin'
    ELSE 'client'
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW();

-- Create Harvey Team organization
INSERT INTO organizations (id, name, slug, contact_email, city, state, is_active)
VALUES (
  'c858a6cb-1520-4f6a-b023-d61673b36853',
  'Harvey Team - Premiere Plus Realty',
  'harvey-team',
  'tony@premiere-plus.cr-realtor.com',
  'Fort Myers',
  'FL',
  true
) ON CONFLICT (id) DO NOTHING;
`;

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing Supabase credentials'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Check which tables exist by trying to query them
    const tableChecks = ['profiles', 'properties', 'realtor_customers', 'realtor_leads', 'vendors', 'organizations']
    const results: Record<string, boolean> = {}
    
    for (const table of tableChecks) {
      const { error } = await supabase.from(table).select('id').limit(1)
      results[table] = !error || !error.message.includes('does not exist')
    }

    const existingTables = Object.entries(results).filter(([, exists]) => exists).map(([name]) => name)
    const missingTables = Object.entries(results).filter(([, exists]) => !exists).map(([name]) => name)

    if (missingTables.length === 0) {
      return NextResponse.json({
        status: 'ready',
        message: 'All required tables exist',
        tables: existingTables
      })
    }

    return NextResponse.json({
      status: 'migration_needed',
      existing_tables: existingTables,
      missing_tables: missingTables,
      action: 'Run the SQL in Supabase Dashboard > SQL Editor',
      sql_url: `${supabaseUrl.replace('.supabase.co', '')}/project/kteobfyferrukqeolofj/sql`
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      status: 'error',
      error: errorMessage 
    }, { status: 500 })
  }
}

export async function POST() {
  // Return the SQL that needs to be run
  return NextResponse.json({
    status: 'sql_provided',
    message: 'Copy this SQL and run it in Supabase Dashboard > SQL Editor',
    sql: MIGRATION_SQL
  })
}
