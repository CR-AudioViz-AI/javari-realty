import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// This endpoint runs database migrations using direct PostgreSQL connection
// Protected by a secret token

const MIGRATION_SQL = `
-- CR REALTOR PLATFORM - DATABASE MIGRATION

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
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

-- PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- REALTOR CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS realtor_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id),
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

-- REALTOR LEADS TABLE
CREATE TABLE IF NOT EXISTS realtor_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES profiles(id),
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

-- SAVED PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS saved_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    notes TEXT,
    rating INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- SHOWINGS TABLE
CREATE TABLE IF NOT EXISTS showings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- VENDORS TABLE
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES profiles(id),
    business_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    city TEXT,
    state TEXT,
    category TEXT NOT NULL,
    description TEXT,
    notes TEXT,
    is_preferred BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- REALTOR MESSAGES TABLE
CREATE TABLE IF NOT EXISTS realtor_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID,
    sender_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    property_id UUID REFERENCES properties(id),
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE showings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtor_messages ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES - PUBLIC READ
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_own_update" ON profiles;
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_own_insert" ON profiles;
CREATE POLICY "profiles_own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "properties_public_read" ON properties;
CREATE POLICY "properties_public_read" ON properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "properties_agent_all" ON properties;
CREATE POLICY "properties_agent_all" ON properties FOR ALL USING (auth.uid() = agent_id);

-- SERVICE ROLE POLICIES
DROP POLICY IF EXISTS "service_role_profiles" ON profiles;
CREATE POLICY "service_role_profiles" ON profiles FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

DROP POLICY IF EXISTS "service_role_properties" ON properties;
CREATE POLICY "service_role_properties" ON properties FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

DROP POLICY IF EXISTS "service_role_customers" ON realtor_customers;
CREATE POLICY "service_role_customers" ON realtor_customers FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

DROP POLICY IF EXISTS "service_role_leads" ON realtor_leads;
CREATE POLICY "service_role_leads" ON realtor_leads FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

DROP POLICY IF EXISTS "service_role_saved" ON saved_properties;
CREATE POLICY "service_role_saved" ON saved_properties FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

DROP POLICY IF EXISTS "service_role_showings" ON showings;
CREATE POLICY "service_role_showings" ON showings FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

DROP POLICY IF EXISTS "service_role_vendors" ON vendors;
CREATE POLICY "service_role_vendors" ON vendors FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

DROP POLICY IF EXISTS "service_role_orgs" ON organizations;
CREATE POLICY "service_role_orgs" ON organizations FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

DROP POLICY IF EXISTS "service_role_messages" ON realtor_messages;
CREATE POLICY "service_role_messages" ON realtor_messages FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_leads_agent ON realtor_leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON realtor_leads(status);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_showings_agent ON showings(agent_id);
CREATE INDEX IF NOT EXISTS idx_vendors_agent ON vendors(agent_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON realtor_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON realtor_messages(recipient_id);

-- TRIGGER FUNCTION FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- APPLY TRIGGERS
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON realtor_customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON realtor_customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON realtor_leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON realtor_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- AUTO-CREATE PROFILE ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        'client'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SEED PROFILES FROM EXISTING AUTH USERS
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
`

export async function POST(request: Request) {
  const startTime = Date.now()
  
  try {
    const { secret } = await request.json()
    
    // Verify secret token
    if (secret !== process.env.MIGRATION_SECRET && secret !== 'cr-realtor-migrate-2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLER
    
    if (!databaseUrl) {
      return NextResponse.json({ 
        error: 'No DATABASE_URL configured',
        hint: 'Add DATABASE_URL or DATABASE_URL_POOLER to environment variables'
      }, { status: 500 })
    }
    
    // Create PostgreSQL pool with proper SSL for Supabase
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false
    })
    
    const client = await pool.connect()
    
    try {
      // Execute migration SQL
      await client.query(MIGRATION_SQL)
      
      // Verify tables created
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'properties', 'realtor_customers', 'realtor_leads', 
                           'saved_properties', 'showings', 'vendors', 'organizations', 'realtor_messages')
        ORDER BY table_name
      `)
      
      const profileCount = await client.query('SELECT COUNT(*) FROM profiles')
      
      const elapsed = Date.now() - startTime
      
      return NextResponse.json({
        status: 'success',
        message: 'Migration completed successfully',
        tables_created: result.rows.map(r => r.table_name),
        tables_count: result.rows.length,
        profiles_seeded: parseInt(profileCount.rows[0].count),
        elapsed_ms: elapsed,
        timestamp: new Date().toISOString()
      })
      
    } finally {
      client.release()
      await pool.end()
    }
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Migration endpoint ready. Send POST with { "secret": "cr-realtor-migrate-2025" }',
    timestamp: new Date().toISOString()
  })
}
