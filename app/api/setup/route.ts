import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Database setup endpoint - creates all tables directly via PostgreSQL
// GET: Check migration status
// POST: Run migration

const MIGRATION_SQL = `
-- CR REALTOR PLATFORM MIGRATION
-- Auto-generated migration script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
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

-- Create properties table
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

-- Create realtor_customers table
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

-- Create organizations table
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

-- Create organization_members table
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'agent',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Create realtor_leads table
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

-- Create saved_properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL,
  notification_enabled BOOLEAN DEFAULT true,
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create showings table
CREATE TABLE IF NOT EXISTS showings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES profiles(id),
  customer_id UUID REFERENCES realtor_customers(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create realtor_transactions table
CREATE TABLE IF NOT EXISTS realtor_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  buyer_id UUID REFERENCES realtor_customers(id),
  buyer_agent_id UUID REFERENCES profiles(id),
  seller_agent_id UUID REFERENCES profiles(id),
  stage TEXT DEFAULT 'pending',
  offer_price NUMERIC(12, 2),
  final_price NUMERIC(12, 2),
  closing_date DATE,
  earnest_money NUMERIC(12, 2),
  contingencies TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create realtor_messages table
CREATE TABLE IF NOT EXISTS realtor_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID,
  sender_id UUID,
  recipient_id UUID,
  property_id UUID REFERENCES properties(id),
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_documents table
CREATE TABLE IF NOT EXISTS customer_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES realtor_customers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  is_shared_with_customer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address_line1 TEXT,
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

-- Create vendor_services table
CREATE TABLE IF NOT EXISTS vendor_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vendor_commissions table
CREATE TABLE IF NOT EXISTS vendor_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  commission_type TEXT,
  commission_amount NUMERIC(10, 2),
  commission_percent NUMERIC(5, 2),
  notes TEXT,
  effective_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_realtor_leads_agent ON realtor_leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_realtor_leads_status ON realtor_leads(status);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_showings_agent ON showings(agent_id);
CREATE INDEX IF NOT EXISTS idx_vendors_agent ON vendors(agent_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE showings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "properties_public_read" ON properties;
CREATE POLICY "properties_public_read" ON properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "organizations_public_read" ON organizations;
CREATE POLICY "organizations_public_read" ON organizations FOR SELECT USING (true);

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

-- Add sample properties for testing
INSERT INTO properties (id, agent_id, title, address, city, state, zip_code, price, bedrooms, bathrooms, sqft, property_type, status, description)
SELECT 
  uuid_generate_v4(),
  p.id,
  'Beautiful ' || (CASE WHEN random() < 0.5 THEN 'Waterfront' ELSE 'Golf Course' END) || ' Home',
  (1000 + floor(random() * 9000)::int)::text || ' ' || 
  (CASE floor(random() * 5)::int 
    WHEN 0 THEN 'Palm Beach' 
    WHEN 1 THEN 'Gulf Shore'
    WHEN 2 THEN 'Captiva'
    WHEN 3 THEN 'Sanibel'
    ELSE 'McGregor' END) || ' Blvd',
  (CASE floor(random() * 4)::int 
    WHEN 0 THEN 'Fort Myers'
    WHEN 1 THEN 'Naples'
    WHEN 2 THEN 'Cape Coral'
    ELSE 'Bonita Springs' END),
  'FL',
  '33' || (901 + floor(random() * 99)::int)::text,
  (300000 + floor(random() * 700000)::int)::numeric,
  (3 + floor(random() * 3)::int),
  (2 + floor(random() * 2)::int),
  (1500 + floor(random() * 2000)::int),
  (CASE floor(random() * 3)::int WHEN 0 THEN 'single_family' WHEN 1 THEN 'condo' ELSE 'townhouse' END),
  'active',
  'Stunning Southwest Florida property with amazing views and modern amenities.'
FROM profiles p
WHERE p.email LIKE '%tony%'
LIMIT 1;
`;

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
    
    if (!dbUrl) {
      return NextResponse.json({
        status: 'config_needed',
        message: 'DATABASE_URL environment variable not set',
        help: 'Add DATABASE_URL to Vercel environment variables'
      })
    }

    // Try to connect and check tables
    const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })
    
    try {
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'properties', 'realtor_customers', 'realtor_leads', 'vendors')
      `)
      
      const existingTables = result.rows.map(r => r.table_name)
      const requiredTables = ['profiles', 'properties', 'realtor_customers', 'realtor_leads', 'vendors']
      const missingTables = requiredTables.filter(t => !existingTables.includes(t))
      
      await pool.end()
      
      if (missingTables.length === 0) {
        return NextResponse.json({
          status: 'ready',
          message: 'All tables exist',
          tables: existingTables
        })
      }
      
      return NextResponse.json({
        status: 'migration_needed',
        existing: existingTables,
        missing: missingTables
      })
      
    } catch (err: any) {
      await pool.end()
      throw err
    }
    
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      error: error.message 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
    
    if (!dbUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not configured'
      }, { status: 500 })
    }

    const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })
    
    try {
      // Run migration
      await pool.query(MIGRATION_SQL)
      
      // Verify tables were created
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'properties', 'realtor_customers', 'realtor_leads', 'vendors')
      `)
      
      await pool.end()
      
      return NextResponse.json({
        status: 'success',
        message: 'Migration completed successfully',
        tables_created: result.rows.map(r => r.table_name)
      })
      
    } catch (err: any) {
      await pool.end()
      throw err
    }
    
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      error: error.message 
    }, { status: 500 })
  }
}
