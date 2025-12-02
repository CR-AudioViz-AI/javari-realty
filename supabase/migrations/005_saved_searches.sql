-- =====================================================
-- CR REALTOR PLATFORM - SAVED SEARCHES & SHARED LISTINGS
-- Path: supabase/migrations/005_saved_searches.sql
-- Timestamp: 2025-12-01 11:38 AM EST
-- Purpose: Customer saved searches and agent shared listings
-- =====================================================

-- =====================================================
-- SAVED SEARCHES TABLE
-- Customers can save unlimited searches with different criteria
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Search identification
  name VARCHAR(255) NOT NULL,  -- "Beach Condos", "Family Homes Near Schools", etc.
  description TEXT,
  
  -- Search Criteria (stored as JSONB for flexibility)
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  /*
    Example criteria structure:
    {
      "cities": ["Fort Myers", "Cape Coral", "Naples"],
      "regions": ["Southwest Florida"],
      "counties": ["Lee", "Collier"],
      "zip_codes": ["33901", "33902"],
      "property_types": ["single_family", "condo"],
      "min_price": 250000,
      "max_price": 500000,
      "min_bedrooms": 3,
      "max_bedrooms": 5,
      "min_bathrooms": 2,
      "min_sqft": 1500,
      "max_sqft": 3000,
      "min_lot_size": 0.25,
      "max_lot_size": 1,
      "year_built_min": 2000,
      "year_built_max": null,
      "features": ["pool", "garage", "waterfront"],
      "keywords": "updated kitchen",
      "days_on_market_max": 30,
      "open_house_only": false,
      "new_construction": false,
      "foreclosure": false,
      "short_sale": false
    }
  */
  
  -- Alert settings
  email_alerts BOOLEAN DEFAULT true,
  alert_frequency VARCHAR(50) DEFAULT 'daily',  -- 'instant', 'daily', 'weekly'
  last_alert_sent_at TIMESTAMPTZ,
  new_listings_count INTEGER DEFAULT 0,  -- Count since last viewed
  
  -- Tracking
  last_viewed_at TIMESTAMPTZ,
  results_count INTEGER DEFAULT 0,  -- Cached count of matching listings
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for customer lookups
CREATE INDEX idx_saved_searches_customer ON saved_searches(customer_id);
CREATE INDEX idx_saved_searches_active ON saved_searches(customer_id, is_active) WHERE is_active = true;
CREATE INDEX idx_saved_searches_alerts ON saved_searches(email_alerts, alert_frequency) WHERE email_alerts = true;

-- =====================================================
-- AGENT SHARED LISTINGS TABLE
-- Agents can share ANY MLS listing with their customers
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_shared_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  -- The listing being shared (can be from properties table or external MLS)
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,  -- Our internal listing
  mls_listing_id VARCHAR(50),  -- External MLS ID for listings not in our system
  mls_data JSONB,  -- Cached MLS data for external listings
  
  -- Agent's notes/message
  agent_message TEXT,
  
  -- Customer interaction tracking
  is_viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMPTZ,
  is_favorited BOOLEAN DEFAULT false,
  customer_notes TEXT,
  customer_rating INTEGER CHECK (customer_rating BETWEEN 1 AND 5),  -- 1-5 stars
  
  -- Status
  is_dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_shared_listings_customer ON agent_shared_listings(customer_id);
CREATE INDEX idx_shared_listings_agent ON agent_shared_listings(agent_id);
CREATE INDEX idx_shared_listings_unviewed ON agent_shared_listings(customer_id, is_viewed) WHERE is_viewed = false;
CREATE UNIQUE INDEX idx_shared_listings_unique ON agent_shared_listings(agent_id, customer_id, property_id) 
  WHERE property_id IS NOT NULL;
CREATE UNIQUE INDEX idx_shared_listings_mls_unique ON agent_shared_listings(agent_id, customer_id, mls_listing_id) 
  WHERE mls_listing_id IS NOT NULL;

-- =====================================================
-- MLS LISTINGS TABLE (for full MLS feed)
-- This will store the full MLS feed data
-- =====================================================
CREATE TABLE IF NOT EXISTS mls_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mls_number VARCHAR(50) UNIQUE NOT NULL,  -- MLS listing ID
  
  -- Basic info
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  county VARCHAR(100),
  region VARCHAR(100),
  
  -- Property details
  property_type VARCHAR(50),  -- single_family, condo, townhouse, multi_family, land
  property_subtype VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',  -- active, pending, sold, withdrawn, expired
  
  -- Pricing
  list_price DECIMAL(12,2),
  original_price DECIMAL(12,2),
  sold_price DECIMAL(12,2),
  price_per_sqft DECIMAL(10,2),
  
  -- Specs
  bedrooms INTEGER,
  bathrooms DECIMAL(4,2),
  half_baths INTEGER,
  square_feet INTEGER,
  lot_size DECIMAL(10,4),  -- in acres
  lot_size_sqft INTEGER,
  year_built INTEGER,
  stories INTEGER,
  garage_spaces INTEGER,
  
  -- Description
  description TEXT,
  remarks TEXT,
  private_remarks TEXT,  -- Only visible to agents
  
  -- Features (stored as arrays for easy filtering)
  features TEXT[],  -- pool, waterfront, garage, etc.
  appliances TEXT[],
  flooring TEXT[],
  exterior TEXT[],
  interior TEXT[],
  
  -- Location details
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  subdivision VARCHAR(255),
  school_district VARCHAR(255),
  elementary_school VARCHAR(255),
  middle_school VARCHAR(255),
  high_school VARCHAR(255),
  
  -- HOA
  hoa_fee DECIMAL(10,2),
  hoa_frequency VARCHAR(50),  -- monthly, quarterly, annually
  hoa_includes TEXT[],
  
  -- Dates
  list_date DATE,
  sold_date DATE,
  days_on_market INTEGER,
  
  -- Images
  images TEXT[],
  virtual_tour_url TEXT,
  
  -- Agent info
  listing_agent_id VARCHAR(50),
  listing_agent_name VARCHAR(255),
  listing_agent_phone VARCHAR(50),
  listing_agent_email VARCHAR(255),
  listing_office VARCHAR(255),
  
  -- Showing info
  showing_instructions TEXT,
  lockbox_type VARCHAR(50),
  
  -- Raw MLS data
  raw_data JSONB,
  
  -- Sync tracking
  mls_source VARCHAR(100),  -- Which MLS feed this came from
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for MLS searches
CREATE INDEX idx_mls_status ON mls_listings(status);
CREATE INDEX idx_mls_city ON mls_listings(city);
CREATE INDEX idx_mls_county ON mls_listings(county);
CREATE INDEX idx_mls_zip ON mls_listings(zip_code);
CREATE INDEX idx_mls_price ON mls_listings(list_price) WHERE status = 'active';
CREATE INDEX idx_mls_beds ON mls_listings(bedrooms) WHERE status = 'active';
CREATE INDEX idx_mls_baths ON mls_listings(bathrooms) WHERE status = 'active';
CREATE INDEX idx_mls_sqft ON mls_listings(square_feet) WHERE status = 'active';
CREATE INDEX idx_mls_type ON mls_listings(property_type) WHERE status = 'active';
CREATE INDEX idx_mls_location ON mls_listings USING gist (
  ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX idx_mls_features ON mls_listings USING gin(features);
CREATE INDEX idx_mls_list_date ON mls_listings(list_date DESC) WHERE status = 'active';

-- Full text search on MLS listings
CREATE INDEX idx_mls_search ON mls_listings USING gin(
  to_tsvector('english', coalesce(address, '') || ' ' || coalesce(city, '') || ' ' || coalesce(description, ''))
);

-- =====================================================
-- UPDATE saved_properties TABLE
-- Add notes field if not exists
-- =====================================================
ALTER TABLE saved_properties ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE saved_properties ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE saved_properties ADD COLUMN IF NOT EXISTS mls_listing_id UUID REFERENCES mls_listings(id) ON DELETE CASCADE;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Saved searches: customers can only see their own
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own saved searches"
  ON saved_searches FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create own saved searches"
  ON saved_searches FOR INSERT
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can update own saved searches"
  ON saved_searches FOR UPDATE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can delete own saved searches"
  ON saved_searches FOR DELETE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Agent shared listings: customers see their shares, agents see what they shared
ALTER TABLE agent_shared_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view listings shared with them"
  ON agent_shared_listings FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view listings they shared"
  ON agent_shared_listings FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can share listings with customers"
  ON agent_shared_listings FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Customers can update shared listings (notes, rating)"
  ON agent_shared_listings FOR UPDATE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can update/delete their shared listings"
  ON agent_shared_listings FOR ALL
  USING (agent_id = auth.uid());

-- MLS listings: everyone can read active listings
ALTER TABLE mls_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active MLS listings"
  ON mls_listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can manage MLS listings"
  ON mls_listings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp trigger for saved_searches
CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update timestamp trigger for agent_shared_listings
CREATE TRIGGER update_shared_listings_updated_at
  BEFORE UPDATE ON agent_shared_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update timestamp trigger for mls_listings
CREATE TRIGGER update_mls_listings_updated_at
  BEFORE UPDATE ON mls_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
