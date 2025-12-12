// Migration endpoint v3 - Let DATABASE_URL handle SSL via query params
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const MIGRATION_SECRET = 'cr-realtor-migrate-2025'

const MIGRATION_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE TABLE IF NOT EXISTS showings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE showings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_agent ON realtor_leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_vendors_agent ON vendors(agent_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);

INSERT INTO profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'User'),
  CASE 
    WHEN email LIKE '%tony%' OR email LIKE '%laura%' THEN 'realtor'
    WHEN email LIKE '%@craudiovizai.com' THEN 'platform_admin'
    ELSE 'client'
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = CASE 
    WHEN EXCLUDED.email LIKE '%tony%' OR EXCLUDED.email LIKE '%laura%' THEN 'realtor'
    WHEN EXCLUDED.email LIKE '%@craudiovizai.com' THEN 'platform_admin'
    ELSE profiles.role
  END,
  updated_at = NOW();

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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { secret } = body
    
    if (secret !== MIGRATION_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({ 
        error: 'DATABASE_URL not configured'
      }, { status: 500 })
    }
    
    // Don't specify SSL config - let the URL handle it
    const pool = new Pool({ connectionString: databaseUrl })
    
    const client = await pool.connect()
    
    try {
      await client.query(MIGRATION_SQL)
      
      const result = await client.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'properties', 'realtor_customers', 'realtor_leads', 'vendors', 'organizations', 'showings', 'saved_properties', 'realtor_messages')
        ORDER BY table_name
      `)
      
      const tables = result.rows.map((r: any) => r.table_name)
      const profileCount = await client.query('SELECT COUNT(*) FROM profiles')
      
      return NextResponse.json({
        status: 'success',
        message: 'Migration completed!',
        tables_created: tables,
        profile_count: parseInt(profileCount.rows[0].count),
        timestamp: new Date().toISOString()
      })
      
    } finally {
      client.release()
      await pool.end()
    }
    
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3),
      detail: error.detail || error.hint || 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'POST with { "secret": "cr-realtor-migrate-2025" } to run migration',
    timestamp: new Date().toISOString()
  })
}
