-- CR REALTOR PLATFORM - COMPREHENSIVE DATABASE SCHEMA V2.0
-- Created: December 21, 2025
-- Description: Full-featured realtor platform with competitive differentiators
-- Author: CR AudioViz AI Engineering Team

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geographic queries

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TYPE user_role AS ENUM ('platform_admin', 'broker_admin', 'office_manager', 'realtor', 'client', 'demo_user');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  broker_id UUID,
  office_id UUID,
  is_active BOOLEAN DEFAULT true,
  is_demo_account BOOLEAN DEFAULT false,
  demo_persona TEXT, -- 'first_time_buyer', 'investor', 'luxury', etc.
  preferences JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ORGANIZATIONAL HIERARCHY
-- ============================================================================

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
  license_number TEXT,
  white_label_settings JSONB DEFAULT '{}', -- Custom branding
  subscription_tier TEXT DEFAULT 'basic', -- basic, pro, enterprise
  subscription_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  manager_id UUID,
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
-- FEATURE TOGGLE SYSTEM
-- ============================================================================

CREATE TYPE feature_category AS ENUM (
  'property_search', 'mls_integration', 'market_analytics', 'mortgage_calculator',
  'agent_matching', 'virtual_tours', 'document_management', 'transaction_coordination',
  'crm', 'lead_generation', 'social_impact_module', 'investment_tools',
  'neighborhood_intelligence', 'ai_advisor', 'moving_concierge', 'ar_preview'
);

CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  category feature_category NOT NULL,
  is_social_impact BOOLEAN DEFAULT false,
  social_impact_type TEXT,
  is_enabled_by_default BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  monthly_price NUMERIC(8,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE platform_feature_toggles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  notes TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feature_id)
);

CREATE TABLE broker_feature_toggles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  notes TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, feature_id)
);

-- ============================================================================
-- PROPERTIES
-- ============================================================================

CREATE TYPE property_status AS ENUM ('active', 'pending', 'sold', 'off_market', 'coming_soon', 'pre_foreclosure', 'auction');
CREATE TYPE property_type AS ENUM ('single_family', 'condo', 'townhouse', 'multi_family', 'land', 'commercial', 'mobile_home', 'farm_ranch');

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mls_id TEXT UNIQUE,
  external_id TEXT, -- From RapidAPI/Realtor16
  source TEXT DEFAULT 'mls', -- mls, off_market, fsbo, auction
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
  original_price NUMERIC(12, 2),
  price_per_sqft NUMERIC(8, 2),
  bedrooms INTEGER,
  bathrooms NUMERIC(3, 1),
  half_baths INTEGER DEFAULT 0,
  square_feet INTEGER,
  lot_size_sqft INTEGER,
  lot_size_acres NUMERIC(10, 4),
  year_built INTEGER,
  stories INTEGER,
  garage_spaces INTEGER,
  parking_spaces INTEGER,
  has_pool BOOLEAN DEFAULT false,
  has_waterfront BOOLEAN DEFAULT false,
  has_view BOOLEAN DEFAULT false,
  has_hoa BOOLEAN DEFAULT false,
  hoa_fee NUMERIC(8, 2),
  hoa_frequency TEXT, -- monthly, quarterly, yearly
  property_tax_annual NUMERIC(10, 2),
  description TEXT,
  listing_agent_id UUID,
  listing_agent_name TEXT,
  listing_agent_phone TEXT,
  listing_agent_email TEXT,
  listing_brokerage TEXT,
  broker_id UUID REFERENCES brokers(id),
  office_id UUID REFERENCES offices(id),
  listed_date DATE,
  days_on_market INTEGER,
  updated_date DATE,
  sold_date DATE,
  sold_price NUMERIC(12, 2),
  photos JSONB DEFAULT '[]'::jsonb,
  virtual_tour_url TEXT,
  video_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_off_market BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  interior_features JSONB DEFAULT '[]'::jsonb,
  exterior_features JSONB DEFAULT '[]'::jsonb,
  appliances JSONB DEFAULT '[]'::jsonb,
  heating_cooling JSONB DEFAULT '{}',
  flooring JSONB DEFAULT '[]',
  roof_type TEXT,
  construction_materials JSONB DEFAULT '[]',
  architectural_style TEXT,
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  lead_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property price history
CREATE TABLE property_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- listed, price_change, pending, sold
  price NUMERIC(12, 2) NOT NULL,
  event_date DATE NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property tax history
CREATE TABLE property_tax_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  tax_amount NUMERIC(10, 2),
  assessed_value NUMERIC(12, 2),
  land_value NUMERIC(12, 2),
  improvement_value NUMERIC(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NEIGHBORHOOD INTELLIGENCE
-- ============================================================================

CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_codes TEXT[],
  boundary_geojson JSONB,
  median_home_price NUMERIC(12, 2),
  median_rent NUMERIC(8, 2),
  median_household_income NUMERIC(10, 2),
  population INTEGER,
  population_density NUMERIC(10, 2),
  walk_score INTEGER,
  transit_score INTEGER,
  bike_score INTEGER,
  crime_score INTEGER, -- 1-100, lower is safer
  school_rating_avg NUMERIC(3, 1),
  cost_of_living_index NUMERIC(5, 2),
  appreciation_1yr NUMERIC(5, 2),
  appreciation_5yr NUMERIC(5, 2),
  data_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  school_type TEXT NOT NULL, -- elementary, middle, high, private, charter
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  rating NUMERIC(3, 1), -- GreatSchools rating 1-10
  student_count INTEGER,
  student_teacher_ratio NUMERIC(4, 1),
  district_name TEXT,
  grades_served TEXT,
  is_title_1 BOOLEAN DEFAULT false,
  test_scores_math NUMERIC(5, 2),
  test_scores_reading NUMERIC(5, 2),
  graduation_rate NUMERIC(5, 2),
  college_readiness NUMERIC(5, 2),
  data_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE property_schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  distance_miles NUMERIC(5, 2),
  is_assigned BOOLEAN DEFAULT false,
  UNIQUE(property_id, school_id)
);

CREATE TABLE crime_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zip_code TEXT NOT NULL,
  city TEXT,
  state TEXT,
  crime_type TEXT NOT NULL, -- violent, property, total
  incidents_per_1000 NUMERIC(8, 2),
  year INTEGER NOT NULL,
  month INTEGER,
  national_comparison NUMERIC(5, 2), -- percentage vs national avg
  data_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commute_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_zip TEXT NOT NULL,
  to_zip TEXT NOT NULL,
  mode TEXT NOT NULL, -- driving, transit, walking, biking
  avg_duration_minutes INTEGER,
  distance_miles NUMERIC(6, 2),
  rush_hour_duration INTEGER,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE local_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- grocery, restaurant, gym, hospital, park, etc.
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  rating NUMERIC(3, 1),
  review_count INTEGER,
  price_level INTEGER, -- 1-4
  is_open_now BOOLEAN,
  hours JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE future_developments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  development_type TEXT NOT NULL, -- residential, commercial, infrastructure, school
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  estimated_completion DATE,
  impact_description TEXT,
  status TEXT, -- planned, approved, under_construction, completed
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE natural_hazards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zip_code TEXT NOT NULL,
  hazard_type TEXT NOT NULL, -- flood, fire, earthquake, hurricane, tornado
  risk_level TEXT NOT NULL, -- minimal, low, moderate, high, very_high
  risk_score INTEGER, -- 1-100
  fema_zone TEXT,
  insurance_required BOOLEAN,
  historical_events INTEGER,
  last_major_event DATE,
  mitigation_recommendations TEXT,
  data_source TEXT,
  data_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE internet_coverage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT,
  zip_code TEXT NOT NULL,
  providers JSONB DEFAULT '[]', -- [{name, type, max_speed, price_range}]
  max_download_speed INTEGER, -- Mbps
  fiber_available BOOLEAN DEFAULT false,
  cable_available BOOLEAN DEFAULT false,
  dsl_available BOOLEAN DEFAULT false,
  starlink_available BOOLEAN DEFAULT true,
  five_g_coverage BOOLEAN DEFAULT false,
  data_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INVESTMENT CALCULATOR DATA
-- ============================================================================

CREATE TABLE rental_estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  estimated_rent_monthly NUMERIC(10, 2),
  rent_low NUMERIC(10, 2),
  rent_high NUMERIC(10, 2),
  airbnb_estimate_nightly NUMERIC(8, 2),
  airbnb_occupancy_rate NUMERIC(5, 2),
  airbnb_monthly_estimate NUMERIC(10, 2),
  comparable_properties INTEGER,
  confidence_score NUMERIC(5, 2),
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE investment_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  -- Purchase assumptions
  purchase_price NUMERIC(12, 2),
  down_payment_percent NUMERIC(5, 2),
  down_payment_amount NUMERIC(12, 2),
  loan_amount NUMERIC(12, 2),
  interest_rate NUMERIC(5, 3),
  loan_term_years INTEGER,
  closing_costs NUMERIC(10, 2),
  -- Monthly income
  monthly_rent NUMERIC(10, 2),
  other_income NUMERIC(10, 2),
  vacancy_rate_percent NUMERIC(5, 2),
  -- Monthly expenses
  mortgage_payment NUMERIC(10, 2),
  property_tax_monthly NUMERIC(10, 2),
  insurance_monthly NUMERIC(10, 2),
  hoa_monthly NUMERIC(10, 2),
  maintenance_monthly NUMERIC(10, 2),
  property_management_monthly NUMERIC(10, 2),
  utilities_monthly NUMERIC(10, 2),
  -- Results
  monthly_cash_flow NUMERIC(10, 2),
  annual_cash_flow NUMERIC(12, 2),
  cap_rate NUMERIC(5, 2),
  cash_on_cash_return NUMERIC(5, 2),
  gross_rent_multiplier NUMERIC(5, 2),
  debt_service_coverage_ratio NUMERIC(5, 2),
  -- Projections
  appreciation_rate_annual NUMERIC(5, 2),
  value_5yr NUMERIC(12, 2),
  value_10yr NUMERIC(12, 2),
  equity_5yr NUMERIC(12, 2),
  equity_10yr NUMERIC(12, 2),
  total_return_5yr NUMERIC(12, 2),
  total_return_10yr NUMERIC(12, 2),
  irr_5yr NUMERIC(5, 2),
  irr_10yr NUMERIC(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MORTGAGE PRE-QUALIFICATION
-- ============================================================================

CREATE TABLE mortgage_prequalifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  -- Income
  annual_income NUMERIC(12, 2),
  additional_income NUMERIC(12, 2),
  income_source TEXT,
  employment_status TEXT, -- employed, self_employed, retired, other
  employer_name TEXT,
  years_employed INTEGER,
  -- Debts
  monthly_debt_payments NUMERIC(10, 2),
  credit_card_debt NUMERIC(10, 2),
  auto_loan_balance NUMERIC(10, 2),
  student_loan_balance NUMERIC(10, 2),
  other_debt NUMERIC(10, 2),
  -- Credit
  credit_score_range TEXT, -- excellent, good, fair, poor
  credit_score_estimate INTEGER,
  -- Assets
  savings_amount NUMERIC(12, 2),
  investments_amount NUMERIC(12, 2),
  retirement_amount NUMERIC(12, 2),
  other_assets NUMERIC(12, 2),
  -- Loan preferences
  loan_type TEXT, -- conventional, fha, va, usda
  down_payment_available NUMERIC(12, 2),
  down_payment_percent NUMERIC(5, 2),
  -- Results
  max_purchase_price NUMERIC(12, 2),
  max_loan_amount NUMERIC(12, 2),
  estimated_monthly_payment NUMERIC(10, 2),
  estimated_interest_rate NUMERIC(5, 3),
  debt_to_income_ratio NUMERIC(5, 2),
  loan_to_value_ratio NUMERIC(5, 2),
  is_qualified BOOLEAN,
  qualification_notes TEXT,
  -- Status
  status TEXT DEFAULT 'draft', -- draft, submitted, verified, expired
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEADS & CRM (Enhanced)
-- ============================================================================

CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'nurturing', 'showing', 'offer_made', 'converted', 'lost');
CREATE TYPE lead_source AS ENUM ('website', 'referral', 'zillow', 'realtor_com', 'social_media', 'open_house', 'sign_call', 'cold_call', 'paid_ad', 'other');
CREATE TYPE lead_temperature AS ENUM ('hot', 'warm', 'cold');

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  realtor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  secondary_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  status lead_status DEFAULT 'new',
  source lead_source DEFAULT 'website',
  source_detail TEXT,
  temperature lead_temperature DEFAULT 'warm',
  score INTEGER DEFAULT 50, -- 1-100 lead score
  -- Buyer info
  is_buyer BOOLEAN DEFAULT true,
  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),
  is_prequalified BOOLEAN DEFAULT false,
  prequalification_id UUID REFERENCES mortgage_prequalifications(id),
  preferred_locations TEXT[],
  property_type property_type,
  beds_min INTEGER,
  baths_min INTEGER,
  sqft_min INTEGER,
  must_haves TEXT[],
  nice_to_haves TEXT[],
  deal_breakers TEXT[],
  move_timeline TEXT, -- asap, 1-3months, 3-6months, 6-12months, just_looking
  -- Seller info
  is_seller BOOLEAN DEFAULT false,
  current_property_address TEXT,
  current_property_value NUMERIC(12, 2),
  selling_reason TEXT,
  -- Communication
  preferred_contact_method TEXT, -- email, phone, text
  best_contact_time TEXT,
  do_not_contact BOOLEAN DEFAULT false,
  -- Tracking
  notes TEXT,
  tags TEXT[],
  assigned_to UUID REFERENCES profiles(id),
  last_contact_date TIMESTAMPTZ,
  next_followup_date TIMESTAMPTZ,
  properties_viewed INTEGER DEFAULT 0,
  offers_made INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  realtor_id UUID REFERENCES profiles(id),
  activity_type TEXT NOT NULL, -- email_sent, email_received, call_made, call_received, text_sent, text_received, meeting, showing, open_house, offer, note
  subject TEXT,
  description TEXT,
  outcome TEXT,
  duration_minutes INTEGER,
  property_id UUID REFERENCES properties(id),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lead_automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  realtor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL, -- new_lead, status_change, no_activity, property_match
  trigger_conditions JSONB,
  action_type TEXT NOT NULL, -- send_email, send_text, assign_task, change_status, notify
  action_config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRANSACTIONS (Enhanced)
-- ============================================================================

CREATE TYPE transaction_stage AS ENUM (
  'pre_approval', 'property_search', 'offer_submitted', 'offer_accepted',
  'under_contract', 'inspection', 'inspection_negotiation', 'appraisal',
  'financing', 'title_search', 'final_walkthrough', 'closing', 'completed', 'cancelled'
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  -- Parties
  buyer_id UUID REFERENCES profiles(id),
  buyer_agent_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  seller_agent_id UUID REFERENCES profiles(id),
  -- Deal info
  stage transaction_stage DEFAULT 'pre_approval',
  offer_price NUMERIC(12, 2),
  list_price NUMERIC(12, 2),
  final_price NUMERIC(12, 2),
  earnest_money NUMERIC(10, 2),
  -- Dates
  offer_date DATE,
  acceptance_date DATE,
  inspection_deadline DATE,
  appraisal_deadline DATE,
  financing_deadline DATE,
  closing_date DATE,
  actual_closing_date DATE,
  possession_date DATE,
  -- Contingencies
  has_inspection_contingency BOOLEAN DEFAULT true,
  has_financing_contingency BOOLEAN DEFAULT true,
  has_appraisal_contingency BOOLEAN DEFAULT true,
  has_sale_contingency BOOLEAN DEFAULT false,
  contingencies_cleared BOOLEAN DEFAULT false,
  -- Financing
  loan_type TEXT,
  loan_amount NUMERIC(12, 2),
  lender_name TEXT,
  lender_contact TEXT,
  rate_locked BOOLEAN DEFAULT false,
  -- Parties
  title_company TEXT,
  title_contact TEXT,
  home_inspector TEXT,
  appraiser TEXT,
  -- Commissions
  buyer_agent_commission_percent NUMERIC(4, 2),
  seller_agent_commission_percent NUMERIC(4, 2),
  buyer_agent_commission_amount NUMERIC(10, 2),
  seller_agent_commission_amount NUMERIC(10, 2),
  -- Status
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transaction_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- paperwork, inspection, financing, title, closing
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  is_required BOOLEAN DEFAULT true,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transaction_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  requires_signature BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ,
  signed_by UUID REFERENCES profiles(id),
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER ENGAGEMENT
-- ============================================================================

CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL,
  notification_enabled BOOLEAN DEFAULT true,
  notification_frequency TEXT DEFAULT 'instant', -- instant, daily, weekly
  last_notified_at TIMESTAMPTZ,
  match_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE favorite_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  rating INTEGER, -- 1-5 stars
  tags TEXT[],
  notified_of_changes BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE TABLE property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  session_id TEXT,
  view_duration_seconds INTEGER,
  viewed_photos BOOLEAN DEFAULT false,
  viewed_map BOOLEAN DEFAULT false,
  calculated_mortgage BOOLEAN DEFAULT false,
  contacted_agent BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- price_drop, status_change, open_house, back_on_market
  alert_data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MOVING CONCIERGE
-- ============================================================================

CREATE TABLE moving_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id),
  -- Address change
  usps_change_submitted BOOLEAN DEFAULT false,
  dmv_updated BOOLEAN DEFAULT false,
  voter_registration_updated BOOLEAN DEFAULT false,
  -- Utilities
  electric_setup BOOLEAN DEFAULT false,
  electric_provider TEXT,
  gas_setup BOOLEAN DEFAULT false,
  gas_provider TEXT,
  water_setup BOOLEAN DEFAULT false,
  water_provider TEXT,
  internet_setup BOOLEAN DEFAULT false,
  internet_provider TEXT,
  trash_setup BOOLEAN DEFAULT false,
  -- Insurance
  homeowners_insurance BOOLEAN DEFAULT false,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  -- Services
  moving_company_booked BOOLEAN DEFAULT false,
  moving_company TEXT,
  moving_date DATE,
  moving_cost NUMERIC(10, 2),
  -- Misc
  schools_enrolled BOOLEAN DEFAULT false,
  doctors_found BOOLEAN DEFAULT false,
  mail_forwarded BOOLEAN DEFAULT false,
  keys_received BOOLEAN DEFAULT false,
  security_system_setup BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- moving, insurance, home_warranty, contractor, inspector, etc
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  service_area TEXT[],
  rating NUMERIC(3, 1),
  review_count INTEGER,
  is_verified BOOLEAN DEFAULT false,
  is_preferred BOOLEAN DEFAULT false,
  referral_commission NUMERIC(5, 2),
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AI INTERACTIONS
-- ============================================================================

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  context_type TEXT, -- property_advisor, mortgage_help, neighborhood_qa, investment_analysis
  context_id UUID, -- property_id, etc
  messages JSONB DEFAULT '[]',
  summary TEXT,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

CREATE TABLE market_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_type TEXT NOT NULL,
  area_value TEXT NOT NULL,
  median_price NUMERIC(12, 2),
  average_price NUMERIC(12, 2),
  total_listings INTEGER,
  new_listings INTEGER,
  sold_count INTEGER,
  average_days_on_market INTEGER,
  median_days_on_market INTEGER,
  price_per_sqft NUMERIC(8, 2),
  list_to_sale_ratio NUMERIC(5, 2),
  month_over_month_change NUMERIC(5, 2),
  year_over_year_change NUMERIC(5, 2),
  inventory_months NUMERIC(4, 1),
  absorption_rate NUMERIC(5, 2),
  data_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(area_type, area_value, data_date)
);

CREATE TABLE agent_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  -- Lead metrics
  leads_received INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5, 2),
  -- Activity metrics
  showings_conducted INTEGER DEFAULT 0,
  offers_written INTEGER DEFAULT 0,
  offers_accepted INTEGER DEFAULT 0,
  -- Transaction metrics
  transactions_closed INTEGER DEFAULT 0,
  total_volume NUMERIC(14, 2) DEFAULT 0,
  avg_sale_price NUMERIC(12, 2),
  avg_days_to_close INTEGER,
  -- Performance
  list_to_sale_ratio NUMERIC(5, 2),
  client_satisfaction_score NUMERIC(3, 1),
  response_time_hours NUMERIC(5, 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, period_start, period_end)
);

-- ============================================================================
-- DEMO ACCOUNTS FOR SALES
-- ============================================================================

CREATE TABLE demo_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  persona_type TEXT NOT NULL, -- first_time_buyer, investor, luxury_buyer, downsizer, relocator
  -- Demo user profile
  demo_full_name TEXT NOT NULL,
  demo_email TEXT NOT NULL,
  demo_phone TEXT,
  demo_avatar_url TEXT,
  -- Demo data
  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),
  preferred_locations TEXT[],
  saved_search_criteria JSONB,
  favorite_property_count INTEGER DEFAULT 5,
  search_history_count INTEGER DEFAULT 20,
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SOCIAL IMPACT MODULES
-- ============================================================================

CREATE TABLE social_impact_eligibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending',
  verification_document_url TEXT,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  benefits_unlocked JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assistance_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  module_type TEXT NOT NULL,
  program_type TEXT, -- grant, loan, tax_credit, discount
  description TEXT,
  eligibility_requirements TEXT,
  max_benefit_amount NUMERIC(12, 2),
  application_process TEXT,
  application_url TEXT,
  contact_info TEXT,
  deadline DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Properties
CREATE INDEX idx_properties_location ON properties(city, state, zip);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_beds_baths ON properties(bedrooms, bathrooms);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_coords ON properties(latitude, longitude);
CREATE INDEX idx_properties_external ON properties(external_id);

-- Leads
CREATE INDEX idx_leads_realtor ON leads(realtor_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_temperature ON leads(temperature);
CREATE INDEX idx_leads_score ON leads(score DESC);

-- Transactions
CREATE INDEX idx_transactions_agents ON transactions(buyer_agent_id, seller_agent_id);
CREATE INDEX idx_transactions_stage ON transactions(stage);
CREATE INDEX idx_transactions_closing ON transactions(closing_date);

-- Analytics
CREATE INDEX idx_property_views_property ON property_views(property_id);
CREATE INDEX idx_property_views_user ON property_views(user_id);
CREATE INDEX idx_market_analytics_area ON market_analytics(area_type, area_value);

-- Neighborhoods
CREATE INDEX idx_schools_location ON schools(city, state);
CREATE INDEX idx_crime_zip ON crime_data(zip_code);
CREATE INDEX idx_neighborhoods_location ON neighborhoods(city, state);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_prequalifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Public read for properties
CREATE POLICY "Anyone can view active properties" ON properties
  FOR SELECT USING (status IN ('active', 'pending', 'coming_soon'));

-- Users manage their own data
CREATE POLICY "Users manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users manage own favorites" ON favorite_properties
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own searches" ON saved_searches
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own prequalifications" ON mortgage_prequalifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own investments" ON investment_calculations
  FOR ALL USING (auth.uid() = user_id);

-- Agents manage their leads
CREATE POLICY "Agents manage own leads" ON leads
  FOR ALL USING (auth.uid() = realtor_id);

-- ============================================================================
-- SEED DATA - FEATURES
-- ============================================================================

INSERT INTO features (name, display_name, description, category, is_enabled_by_default, is_premium) VALUES
-- Core features
('property_search', 'Property Search', 'Advanced property search with filters', 'property_search', true, false),
('mls_integration', 'Live MLS Data', 'Real-time MLS listings from multiple sources', 'mls_integration', true, false),
('mortgage_calculator', 'Mortgage Calculator', 'Mortgage and affordability calculations', 'mortgage_calculator', true, false),
('saved_searches', 'Saved Searches', 'Save and get alerts for searches', 'property_search', true, false),
('favorites', 'Favorites', 'Save and track favorite properties', 'property_search', true, false),
-- Premium features
('investment_calculator', 'Investment Calculator Pro', 'ROI, cap rate, cash flow analysis', 'investment_tools', true, true),
('neighborhood_intelligence', 'Neighborhood Intelligence', 'Schools, crime, commute, amenities data', 'neighborhood_intelligence', true, true),
('mortgage_prequal', 'Instant Pre-Qualification', 'Get pre-qualified in minutes', 'mortgage_calculator', true, true),
('market_analytics', 'Market Analytics', 'Comprehensive market trends and data', 'market_analytics', true, true),
('ai_property_advisor', 'AI Property Advisor', 'Javari AI-powered property recommendations', 'ai_advisor', true, true),
('off_market_access', 'Off-Market Properties', 'Access to pocket listings and FSBOs', 'property_search', false, true),
('virtual_staging', 'Virtual Staging', 'AI-powered virtual staging for listings', 'virtual_tours', false, true),
('moving_concierge', 'Moving Concierge', 'Full-service moving assistance', 'moving_concierge', true, true),
-- Agent/Broker features
('crm', 'CRM System', 'Client relationship management', 'crm', true, false),
('lead_management', 'Lead Management', 'Track and nurture leads', 'lead_generation', true, false),
('transaction_management', 'Transaction Management', 'End-to-end transaction tracking', 'transaction_coordination', true, false),
('agent_analytics', 'Agent Analytics', 'Performance metrics and insights', 'market_analytics', true, true),
('white_label', 'White Label', 'Custom branding for your site', 'crm', false, true);

-- Social impact modules
INSERT INTO features (name, display_name, description, category, is_social_impact, social_impact_type, is_enabled_by_default) VALUES
('veterans_module', 'Veterans Program', 'VA loans and military benefits', 'social_impact_module', true, 'veterans', true),
('first_responders_module', 'First Responders', 'Hero programs for police, fire, EMS', 'social_impact_module', true, 'first_responders', true),
('seniors_module', 'Seniors Program', 'Downsizing and accessibility help', 'social_impact_module', true, 'seniors', true),
('first_time_buyers_module', 'First-Time Buyers', 'Down payment assistance programs', 'social_impact_module', true, 'first_time_buyers', true);

-- Demo scenarios for sales presentations
INSERT INTO demo_scenarios (name, description, persona_type, demo_full_name, demo_email, budget_min, budget_max, preferred_locations) VALUES
('First-Time Buyer Sarah', 'Young professional looking for her first home', 'first_time_buyer', 'Sarah Mitchell', 'sarah.demo@crrealty.com', 250000, 400000, ARRAY['Austin, TX', 'Round Rock, TX']),
('Investor Marcus', 'Experienced real estate investor building portfolio', 'investor', 'Marcus Johnson', 'marcus.demo@crrealty.com', 150000, 500000, ARRAY['Tampa, FL', 'Orlando, FL']),
('Relocating Family Chen', 'Family relocating for new job opportunity', 'relocator', 'Jennifer Chen', 'chen.demo@crrealty.com', 500000, 750000, ARRAY['Denver, CO', 'Boulder, CO']),
('Luxury Buyer Williams', 'High-net-worth individual seeking luxury property', 'luxury_buyer', 'Robert Williams', 'williams.demo@crrealty.com', 1500000, 3000000, ARRAY['Naples, FL', 'Miami, FL']),
('Downsizer Torres', 'Empty nester looking to downsize', 'downsizer', 'Amanda Torres', 'torres.demo@crrealty.com', 300000, 450000, ARRAY['Scottsdale, AZ', 'Phoenix, AZ']);

-- Enable platform features
INSERT INTO platform_feature_toggles (feature_id, is_enabled)
SELECT id, is_enabled_by_default FROM features;
