-- CR REALTOR PLATFORM - DATABASE SCHEMA
-- Created: November 19, 2025
-- Description: Unified realtor platform with 20 social impact modules

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('platform_admin', 'broker_admin', 'office_manager', 'realtor', 'client');

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  broker_id UUID REFERENCES profiles(id),
  office_id UUID REFERENCES offices(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ORGANIZATIONAL HIERARCHY
-- ============================================================================

-- Brokers (top level organizations)
CREATE TABLE brokers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
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

-- Offices (belong to brokers)
CREATE TABLE offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  manager_id UUID REFERENCES profiles(id),
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FEATURE TOGGLE SYSTEM (GRANULAR PERMISSIONS)
-- ============================================================================

-- Feature categories
CREATE TYPE feature_category AS ENUM (
  'property_search',
  'mls_integration',
  'market_analytics',
  'mortgage_calculator',
  'agent_matching',
  'virtual_tours',
  'document_management',
  'transaction_coordination',
  'crm',
  'lead_generation',
  'social_impact_module'
);

-- All available features
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  category feature_category NOT NULL,
  is_social_impact BOOLEAN DEFAULT false,
  social_impact_type TEXT, -- veterans, first_responders, seniors, etc.
  is_enabled_by_default BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform-level feature toggles (Roy's control)
CREATE TABLE platform_feature_toggles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  notes TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feature_id)
);

-- Broker-level feature toggles
CREATE TABLE broker_feature_toggles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  notes TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, feature_id)
);

-- Office-level feature toggles
CREATE TABLE office_feature_toggles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  office_id UUID REFERENCES offices(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  notes TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(office_id, feature_id)
);

-- Realtor-level feature toggles (personal preferences)
CREATE TABLE realtor_feature_toggles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  realtor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(realtor_id, feature_id)
);

-- Feature usage analytics
CREATE TABLE feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feature_id, user_id)
);

-- ============================================================================
-- PROPERTIES
-- ============================================================================

-- Property status enum
CREATE TYPE property_status AS ENUM (
  'active',
  'pending',
  'sold',
  'off_market',
  'coming_soon'
);

-- Property types
CREATE TYPE property_type AS ENUM (
  'single_family',
  'condo',
  'townhouse',
  'multi_family',
  'land',
  'commercial',
  'mobile_home',
  'farm_ranch'
);

-- Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mls_id TEXT UNIQUE,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  county TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  property_type property_type NOT NULL,
  status property_status DEFAULT 'active',
  price NUMERIC(12, 2) NOT NULL,
  bedrooms INTEGER,
  bathrooms NUMERIC(3, 1),
  square_feet INTEGER,
  lot_size NUMERIC(10, 2),
  year_built INTEGER,
  description TEXT,
  listing_agent_id UUID REFERENCES profiles(id),
  broker_id UUID REFERENCES brokers(id),
  office_id UUID REFERENCES offices(id),
  listed_date DATE,
  updated_date DATE,
  images JSONB DEFAULT '[]'::jsonb,
  virtual_tour_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property amenities
CREATE TABLE property_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SOCIAL IMPACT MODULES
-- ============================================================================

-- Social impact eligibility
CREATE TABLE social_impact_eligibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL, -- veterans, first_responders, etc.
  verification_status TEXT DEFAULT 'pending', -- pending, verified, rejected
  verification_document_url TEXT,
  notes TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Available assistance programs
CREATE TABLE assistance_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  module_type TEXT NOT NULL,
  description TEXT,
  eligibility_requirements TEXT,
  benefits TEXT,
  application_url TEXT,
  contact_info TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEADS & CRM
-- ============================================================================

-- Lead status
CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'nurturing',
  'converted',
  'lost'
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  realtor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  status lead_status DEFAULT 'new',
  source TEXT,
  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),
  preferred_locations TEXT[],
  property_type property_type,
  notes TEXT,
  last_contact_date TIMESTAMPTZ,
  next_followup_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead activities
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  realtor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- email, call, meeting, viewing, etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRANSACTIONS
-- ============================================================================

-- Transaction stages
CREATE TYPE transaction_stage AS ENUM (
  'pre_approval',
  'property_search',
  'offer_submitted',
  'under_contract',
  'inspection',
  'appraisal',
  'financing',
  'final_walkthrough',
  'closing',
  'completed',
  'cancelled'
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  buyer_id UUID REFERENCES profiles(id),
  buyer_agent_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  seller_agent_id UUID REFERENCES profiles(id),
  stage transaction_stage DEFAULT 'pre_approval',
  offer_price NUMERIC(12, 2),
  final_price NUMERIC(12, 2),
  closing_date DATE,
  earnest_money NUMERIC(12, 2),
  contingencies TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction documents
CREATE TABLE transaction_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SAVED SEARCHES & FAVORITES
-- ============================================================================

-- Saved property searches
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL,
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorite properties
CREATE TABLE favorite_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

-- Market analytics (cached data)
CREATE TABLE market_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_type TEXT NOT NULL, -- city, zip, county
  area_value TEXT NOT NULL,
  median_price NUMERIC(12, 2),
  average_price NUMERIC(12, 2),
  total_listings INTEGER,
  average_days_on_market INTEGER,
  price_per_sqft NUMERIC(8, 2),
  month_over_month_change NUMERIC(5, 2),
  year_over_year_change NUMERIC(5, 2),
  data_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(area_type, area_value, data_date)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_broker ON profiles(broker_id);
CREATE INDEX idx_profiles_office ON profiles(office_id);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_listing_agent ON properties(listing_agent_id);

CREATE INDEX idx_leads_realtor ON leads(realtor_id);
CREATE INDEX idx_leads_status ON leads(status);

CREATE INDEX idx_transactions_buyer_agent ON transactions(buyer_agent_id);
CREATE INDEX idx_transactions_seller_agent ON transactions(seller_agent_id);
CREATE INDEX idx_transactions_stage ON transactions(stage);

CREATE INDEX idx_feature_usage_feature ON feature_usage(feature_id);
CREATE INDEX idx_feature_usage_user ON feature_usage(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Platform admins can see everything
CREATE POLICY "Platform admins full access" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'platform_admin'
    )
  );

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Realtors can view properties in their office
CREATE POLICY "Realtors view office properties" ON properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND (p.role IN ('realtor', 'office_manager', 'broker_admin')
        AND (p.office_id = properties.office_id OR p.broker_id = properties.broker_id))
    )
  );

-- Public can view active properties
CREATE POLICY "Public view active properties" ON properties
  FOR SELECT USING (status = 'active');

-- ============================================================================
-- SEED DATA - FEATURES
-- ============================================================================

INSERT INTO features (name, display_name, description, category, is_enabled_by_default) VALUES
-- Core competitive features
('property_search', 'Property Search', 'Advanced property search with filters', 'property_search', true),
('mls_integration', 'MLS Integration', 'Real-time MLS data sync', 'mls_integration', true),
('market_analytics', 'Market Analytics', 'Comprehensive market data and trends', 'market_analytics', true),
('mortgage_calculator', 'Mortgage Calculator', 'Mortgage and affordability calculations', 'mortgage_calculator', true),
('agent_matching', 'Agent Matching', 'Match clients with ideal agents', 'agent_matching', true),
('virtual_tours', 'Virtual Tours', '3D property tours and walkthroughs', 'virtual_tours', true),
('document_management', 'Document Management', 'Upload, sign, and manage documents', 'document_management', true),
('transaction_coordination', 'Transaction Coordination', 'Manage transaction pipeline', 'transaction_coordination', true),
('crm', 'CRM System', 'Client relationship management', 'crm', true),
('lead_generation', 'Lead Generation', 'Automated lead capture and nurturing', 'lead_generation', true);

-- Social impact modules
INSERT INTO features (name, display_name, description, category, is_social_impact, social_impact_type, is_enabled_by_default) VALUES
('veterans_module', 'Veterans Program', 'VA loans and military relocation assistance', 'social_impact_module', true, 'veterans', true),
('first_responders_module', 'First Responders Program', 'Hero programs and specialized financing', 'social_impact_module', true, 'first_responders', true),
('seniors_module', 'Seniors (55+) Program', 'Downsizing and accessibility assistance', 'social_impact_module', true, 'seniors', true),
('first_time_buyers_module', 'First-Time Buyers Program', 'Affordability and assistance programs', 'social_impact_module', true, 'first_time_buyers', true),
('faith_based_module', 'Faith-Based Communities', 'Church relocation and ministry housing', 'social_impact_module', true, 'faith_based', true),
('low_income_module', 'Affordable Housing Navigator', 'Low-income housing assistance', 'social_impact_module', true, 'low_income', false),
('military_families_module', 'Military Families', 'PCS moves and deployment housing', 'social_impact_module', true, 'military_families', false),
('special_needs_module', 'Special Needs Housing', 'ADA compliance and modifications', 'social_impact_module', true, 'special_needs', false),
('foster_adoption_module', 'Foster/Adoption Families', 'Family expansion housing support', 'social_impact_module', true, 'foster_adoption', false),
('nonprofit_module', 'Nonprofit Organizations', 'Office space and facilities', 'social_impact_module', true, 'nonprofit', false),
('accessibility_module', 'Accessibility Housing', 'Grants and modifications', 'social_impact_module', true, 'accessibility', false),
('emergency_housing_module', 'Emergency Housing', 'Disaster victims and crisis support', 'social_impact_module', true, 'emergency_housing', false),
('green_sustainable_module', 'Green/Sustainable Housing', 'Energy efficient and eco-friendly', 'social_impact_module', true, 'green_sustainable', false),
('multigenerational_module', 'Multigenerational Housing', 'Extended family living solutions', 'social_impact_module', true, 'multigenerational', false),
('tiny_homes_module', 'Tiny Homes', 'Alternative housing options', 'social_impact_module', true, 'tiny_homes', false),
('cohousing_module', 'Co-Housing', 'Collaborative living communities', 'social_impact_module', true, 'cohousing', false),
('rural_homesteading_module', 'Rural/Homesteading', 'Land, farming, self-sufficiency', 'social_impact_module', true, 'rural_homesteading', false),
('urban_revitalization_module', 'Urban Revitalization', 'Community rebuilding programs', 'social_impact_module', true, 'urban_revitalization', false),
('community_land_trusts_module', 'Community Land Trusts', 'Affordable ownership models', 'social_impact_module', true, 'community_land_trusts', false),
('cultural_communities_module', 'Cultural Communities', 'Immigrant and refugee support', 'social_impact_module', true, 'cultural_communities', false);

-- Enable all features at platform level by default
INSERT INTO platform_feature_toggles (feature_id, is_enabled)
SELECT id, is_enabled_by_default FROM features;
