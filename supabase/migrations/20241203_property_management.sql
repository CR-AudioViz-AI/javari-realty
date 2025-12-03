-- CR REALTOR PLATFORM - PROPERTY MANAGEMENT MODULE
-- Created: December 3, 2025
-- Description: Complete property management system for rentals
-- Supports: Residential, Commercial, Industrial properties
-- Access: Standalone OR as addon to Realtor subscription

-- ============================================================================
-- PROPERTY MANAGEMENT ENUMS
-- ============================================================================

-- Property management categories
CREATE TYPE pm_property_category AS ENUM (
  'residential',
  'commercial', 
  'industrial'
);

-- Residential subtypes
CREATE TYPE pm_residential_type AS ENUM (
  'single_family',
  'apartment',
  'condo',
  'townhouse',
  'duplex',
  'triplex',
  'fourplex',
  'mobile_home',
  'student_housing',
  'senior_living'
);

-- Commercial subtypes
CREATE TYPE pm_commercial_type AS ENUM (
  'office',
  'retail',
  'restaurant',
  'medical',
  'mixed_use',
  'hotel_motel',
  'strip_mall',
  'shopping_center'
);

-- Industrial subtypes
CREATE TYPE pm_industrial_type AS ENUM (
  'warehouse',
  'manufacturing',
  'distribution',
  'flex_space',
  'cold_storage',
  'data_center',
  'research_facility'
);

-- Lease status
CREATE TYPE lease_status AS ENUM (
  'draft',
  'pending_signature',
  'active',
  'expiring_soon',
  'expired',
  'terminated',
  'renewed'
);

-- Tenant status
CREATE TYPE tenant_status AS ENUM (
  'prospect',
  'applicant',
  'approved',
  'active',
  'notice_given',
  'moved_out',
  'evicted'
);

-- Maintenance priority
CREATE TYPE maintenance_priority AS ENUM (
  'emergency',
  'urgent',
  'high',
  'medium',
  'low'
);

-- Maintenance status
CREATE TYPE maintenance_status AS ENUM (
  'submitted',
  'acknowledged',
  'scheduled',
  'in_progress',
  'pending_parts',
  'completed',
  'cancelled'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'partial',
  'late',
  'failed',
  'refunded',
  'waived'
);

-- ============================================================================
-- PROPERTY MANAGERS (Can be standalone or linked to realtor)
-- ============================================================================

CREATE TABLE property_managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  license_number TEXT,
  license_state TEXT,
  commission_rate NUMERIC(5, 2) DEFAULT 10.00, -- % of rent collected
  management_fee_type TEXT DEFAULT 'percentage', -- 'percentage' or 'flat'
  management_fee NUMERIC(10, 2),
  is_realtor BOOLEAN DEFAULT false, -- True if also a realtor (addon mode)
  realtor_id UUID REFERENCES profiles(id), -- Link to realtor profile if addon
  specialties pm_property_category[] DEFAULT '{residential}',
  service_areas TEXT[], -- Cities/regions served
  properties_managed INTEGER DEFAULT 0,
  units_managed INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LANDLORDS / PROPERTY OWNERS
-- ============================================================================

CREATE TABLE landlords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  tax_id TEXT, -- EIN or SSN (encrypted)
  payment_method TEXT DEFAULT 'direct_deposit',
  bank_account_last4 TEXT,
  routing_number_last4 TEXT,
  payment_schedule TEXT DEFAULT 'monthly', -- 'weekly', 'biweekly', 'monthly'
  management_agreement_signed BOOLEAN DEFAULT false,
  agreement_signed_date DATE,
  preferred_contact TEXT DEFAULT 'email', -- 'email', 'phone', 'text'
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Landlord to Property Manager assignments
CREATE TABLE landlord_manager_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID REFERENCES landlords(id) ON DELETE CASCADE,
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  commission_rate NUMERIC(5, 2), -- Override default if negotiated
  contract_start DATE,
  contract_end DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(landlord_id, property_manager_id)
);

-- ============================================================================
-- RENTAL PROPERTIES
-- ============================================================================

CREATE TABLE rental_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID REFERENCES landlords(id) ON DELETE CASCADE,
  property_manager_id UUID REFERENCES property_managers(id),
  
  -- Location
  address TEXT NOT NULL,
  unit_number TEXT, -- For multi-unit buildings
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  county TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  
  -- Classification
  category pm_property_category NOT NULL,
  residential_type pm_residential_type,
  commercial_type pm_commercial_type,
  industrial_type pm_industrial_type,
  
  -- Details
  name TEXT, -- Property name (e.g., "Sunset Apartments")
  description TEXT,
  year_built INTEGER,
  total_units INTEGER DEFAULT 1,
  total_sqft INTEGER,
  lot_size NUMERIC(10, 2),
  parking_spaces INTEGER DEFAULT 0,
  
  -- Financials
  market_rent NUMERIC(10, 2),
  purchase_price NUMERIC(12, 2),
  purchase_date DATE,
  current_value NUMERIC(12, 2),
  mortgage_payment NUMERIC(10, 2),
  property_tax_annual NUMERIC(10, 2),
  insurance_annual NUMERIC(10, 2),
  hoa_monthly NUMERIC(10, 2),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  acquisition_date DATE,
  images JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb, -- Deeds, insurance, etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- UNITS (For multi-unit properties)
-- ============================================================================

CREATE TABLE rental_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES rental_properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  
  -- Details
  floor INTEGER,
  bedrooms INTEGER,
  bathrooms NUMERIC(3, 1),
  sqft INTEGER,
  
  -- Rent
  market_rent NUMERIC(10, 2),
  current_rent NUMERIC(10, 2),
  deposit_amount NUMERIC(10, 2),
  
  -- Status
  is_available BOOLEAN DEFAULT true,
  available_date DATE,
  last_renovation DATE,
  
  -- Amenities
  amenities TEXT[],
  appliances TEXT[],
  utilities_included TEXT[], -- 'water', 'electric', 'gas', 'trash', 'internet'
  pet_policy TEXT DEFAULT 'no_pets', -- 'no_pets', 'cats_only', 'small_dogs', 'all_pets'
  pet_deposit NUMERIC(10, 2),
  pet_rent_monthly NUMERIC(10, 2),
  
  images JSONB DEFAULT '[]'::jsonb,
  virtual_tour_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(property_id, unit_number)
);

-- ============================================================================
-- TENANTS
-- ============================================================================

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id), -- Optional: linked to platform user
  
  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  ssn_last4 TEXT, -- Last 4 of SSN for verification
  
  -- Employment
  employer TEXT,
  employer_phone TEXT,
  job_title TEXT,
  monthly_income NUMERIC(10, 2),
  employment_start_date DATE,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Rental History
  previous_address TEXT,
  previous_landlord_name TEXT,
  previous_landlord_phone TEXT,
  years_at_previous INTEGER,
  reason_for_leaving TEXT,
  
  -- Status
  status tenant_status DEFAULT 'prospect',
  credit_score INTEGER,
  background_check_date DATE,
  background_check_status TEXT,
  
  -- Documents
  documents JSONB DEFAULT '[]'::jsonb, -- ID, pay stubs, etc.
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Co-tenants (roommates on same lease)
CREATE TABLE co_tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  primary_tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  relationship TEXT, -- 'spouse', 'partner', 'roommate', 'family'
  is_on_lease BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEASES
-- ============================================================================

CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES rental_units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  property_manager_id UUID REFERENCES property_managers(id),
  
  -- Terms
  lease_type TEXT DEFAULT 'fixed', -- 'fixed', 'month_to_month'
  start_date DATE NOT NULL,
  end_date DATE,
  move_in_date DATE,
  move_out_date DATE,
  
  -- Rent
  monthly_rent NUMERIC(10, 2) NOT NULL,
  security_deposit NUMERIC(10, 2),
  pet_deposit NUMERIC(10, 2),
  last_month_rent NUMERIC(10, 2),
  
  -- Payment Terms
  rent_due_day INTEGER DEFAULT 1, -- Day of month rent is due
  grace_period_days INTEGER DEFAULT 5,
  late_fee_type TEXT DEFAULT 'flat', -- 'flat', 'percentage', 'daily'
  late_fee_amount NUMERIC(10, 2),
  late_fee_percentage NUMERIC(5, 2),
  late_fee_daily NUMERIC(10, 2),
  late_fee_max NUMERIC(10, 2),
  
  -- Status
  status lease_status DEFAULT 'draft',
  signed_date DATE,
  
  -- Renewal
  auto_renew BOOLEAN DEFAULT false,
  renewal_terms TEXT, -- Terms for auto-renewal
  renewal_rent_increase NUMERIC(5, 2), -- Percentage increase
  renewal_notice_days INTEGER DEFAULT 60,
  
  -- Documents
  lease_document_url TEXT,
  addendums JSONB DEFAULT '[]'::jsonb,
  
  -- Termination
  termination_date DATE,
  termination_reason TEXT,
  termination_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lease renewals history
CREATE TABLE lease_renewals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  new_lease_id UUID REFERENCES leases(id),
  previous_rent NUMERIC(10, 2),
  new_rent NUMERIC(10, 2),
  rent_increase_percentage NUMERIC(5, 2),
  renewal_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RENT PAYMENTS
-- ============================================================================

CREATE TABLE rent_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  
  -- Payment Details
  payment_date DATE,
  due_date DATE NOT NULL,
  period_start DATE,
  period_end DATE,
  
  -- Amounts
  rent_amount NUMERIC(10, 2) NOT NULL,
  late_fee NUMERIC(10, 2) DEFAULT 0,
  other_charges NUMERIC(10, 2) DEFAULT 0,
  other_charges_description TEXT,
  total_amount NUMERIC(10, 2) NOT NULL,
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  balance_due NUMERIC(10, 2),
  
  -- Status
  status payment_status DEFAULT 'pending',
  
  -- Payment Method
  payment_method TEXT, -- 'check', 'ach', 'credit_card', 'cash', 'money_order', 'online'
  payment_reference TEXT, -- Check number, transaction ID, etc.
  
  -- Processing
  processed_date TIMESTAMPTZ,
  processed_by UUID REFERENCES profiles(id),
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment ledger (immutable transaction log)
CREATE TABLE payment_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES rent_payments(id),
  lease_id UUID REFERENCES leases(id),
  tenant_id UUID REFERENCES tenants(id),
  
  transaction_type TEXT NOT NULL, -- 'charge', 'payment', 'credit', 'refund', 'adjustment'
  amount NUMERIC(10, 2) NOT NULL,
  running_balance NUMERIC(10, 2),
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MAINTENANCE REQUESTS
-- ============================================================================

CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES rental_properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES rental_units(id),
  tenant_id UUID REFERENCES tenants(id),
  property_manager_id UUID REFERENCES property_managers(id),
  
  -- Request Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'pest', 'other'
  priority maintenance_priority DEFAULT 'medium',
  status maintenance_status DEFAULT 'submitted',
  
  -- Location
  location_in_unit TEXT, -- 'kitchen', 'bathroom', 'bedroom', 'living_room', 'exterior', etc.
  
  -- Assignment
  assigned_to UUID REFERENCES profiles(id), -- Vendor or staff
  vendor_id UUID, -- If assigned to external vendor
  
  -- Scheduling
  requested_date DATE,
  scheduled_date DATE,
  scheduled_time_start TIME,
  scheduled_time_end TIME,
  completed_date DATE,
  
  -- Costs
  estimated_cost NUMERIC(10, 2),
  actual_cost NUMERIC(10, 2),
  tenant_responsible BOOLEAN DEFAULT false,
  
  -- Access
  permission_to_enter BOOLEAN DEFAULT false,
  entry_instructions TEXT,
  pet_in_unit BOOLEAN DEFAULT false,
  
  -- Documentation
  images JSONB DEFAULT '[]'::jsonb, -- Before photos
  completion_images JSONB DEFAULT '[]'::jsonb, -- After photos
  
  -- Resolution
  resolution_notes TEXT,
  tenant_satisfaction INTEGER, -- 1-5 rating
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance work log
CREATE TABLE maintenance_work_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  
  action TEXT NOT NULL,
  performed_by UUID REFERENCES profiles(id),
  labor_hours NUMERIC(5, 2),
  materials_cost NUMERIC(10, 2),
  materials_description TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- VENDORS
-- ============================================================================

CREATE TABLE pm_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id),
  
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Services
  services TEXT[] NOT NULL, -- 'plumbing', 'electrical', 'hvac', etc.
  service_areas TEXT[],
  
  -- Business Info
  license_number TEXT,
  insurance_expiry DATE,
  w9_on_file BOOLEAN DEFAULT false,
  
  -- Rates
  hourly_rate NUMERIC(10, 2),
  emergency_rate NUMERIC(10, 2),
  
  -- Performance
  jobs_completed INTEGER DEFAULT 0,
  average_rating NUMERIC(3, 2),
  
  is_preferred BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INSPECTIONS
-- ============================================================================

CREATE TABLE property_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES rental_properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES rental_units(id),
  lease_id UUID REFERENCES leases(id),
  
  inspection_type TEXT NOT NULL, -- 'move_in', 'move_out', 'routine', 'annual', 'complaint'
  scheduled_date DATE,
  completed_date DATE,
  inspector_id UUID REFERENCES profiles(id),
  
  -- Checklist Results (JSON for flexibility)
  checklist JSONB DEFAULT '{}'::jsonb,
  
  -- Overall Condition
  overall_condition TEXT, -- 'excellent', 'good', 'fair', 'poor'
  
  -- Damages
  damages_found BOOLEAN DEFAULT false,
  damage_description TEXT,
  damage_cost_estimate NUMERIC(10, 2),
  tenant_responsible_damages NUMERIC(10, 2),
  
  -- Documentation
  photos JSONB DEFAULT '[]'::jsonb,
  tenant_signature TEXT,
  tenant_signed_date TIMESTAMPTZ,
  inspector_signature TEXT,
  inspector_signed_date TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FEATURE TOGGLES - ADD PROPERTY MANAGEMENT FEATURES
-- ============================================================================

-- Insert Property Management features
INSERT INTO features (name, display_name, description, category, is_enabled_by_default) VALUES
  ('pm_residential', 'Residential Property Management', 'Manage residential rental properties', 'property_management', false),
  ('pm_commercial', 'Commercial Property Management', 'Manage commercial rental properties', 'property_management', false),
  ('pm_industrial', 'Industrial Property Management', 'Manage industrial rental properties', 'property_management', false),
  ('pm_maintenance', 'Maintenance Request System', 'Handle tenant maintenance requests', 'property_management', false),
  ('pm_accounting', 'PM Accounting & Reporting', 'Financial tracking and owner statements', 'property_management', false),
  ('pm_tenant_portal', 'Tenant Portal', 'Allow tenants to pay rent and submit requests online', 'property_management', false),
  ('pm_landlord_portal', 'Landlord/Owner Portal', 'Allow property owners to view reports', 'property_management', false),
  ('pm_lease_management', 'Lease Management', 'Create, track, and renew leases', 'property_management', false),
  ('pm_inspections', 'Property Inspections', 'Move-in/move-out and routine inspections', 'property_management', false),
  ('pm_vendor_management', 'Vendor Management', 'Track and manage maintenance vendors', 'property_management', false)
ON CONFLICT (name) DO NOTHING;

-- Add 'property_management' to feature_category enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'property_management' AND enumtypid = 'feature_category'::regtype) THEN
    ALTER TYPE feature_category ADD VALUE 'property_management';
  END IF;
END $$;

-- ============================================================================
-- ADD PROPERTY MANAGER ROLE
-- ============================================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'property_manager' AND enumtypid = 'user_role'::regtype) THEN
    ALTER TYPE user_role ADD VALUE 'property_manager';
  END IF;
END $$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_rental_properties_landlord ON rental_properties(landlord_id);
CREATE INDEX idx_rental_properties_manager ON rental_properties(property_manager_id);
CREATE INDEX idx_rental_properties_category ON rental_properties(category);
CREATE INDEX idx_rental_properties_city_state ON rental_properties(city, state);

CREATE INDEX idx_rental_units_property ON rental_units(property_id);
CREATE INDEX idx_rental_units_available ON rental_units(is_available, available_date);

CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_email ON tenants(email);

CREATE INDEX idx_leases_unit ON leases(unit_id);
CREATE INDEX idx_leases_tenant ON leases(tenant_id);
CREATE INDEX idx_leases_status ON leases(status);
CREATE INDEX idx_leases_dates ON leases(start_date, end_date);

CREATE INDEX idx_rent_payments_lease ON rent_payments(lease_id);
CREATE INDEX idx_rent_payments_tenant ON rent_payments(tenant_id);
CREATE INDEX idx_rent_payments_status ON rent_payments(status);
CREATE INDEX idx_rent_payments_due_date ON rent_payments(due_date);

CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_unit ON maintenance_requests(unit_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_priority ON maintenance_requests(priority);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE property_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Property managers can see their own data
CREATE POLICY pm_own_data ON property_managers
  FOR ALL USING (user_id = auth.uid());

-- Property managers can see properties they manage
CREATE POLICY pm_properties ON rental_properties
  FOR ALL USING (
    property_manager_id IN (SELECT id FROM property_managers WHERE user_id = auth.uid())
    OR landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid())
  );

-- Tenants can see their own data
CREATE POLICY tenant_own_data ON tenants
  FOR SELECT USING (user_id = auth.uid());

-- Tenants can see their own leases
CREATE POLICY tenant_leases ON leases
  FOR SELECT USING (
    tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid())
  );

-- Tenants can view and create maintenance requests for their unit
CREATE POLICY tenant_maintenance ON maintenance_requests
  FOR ALL USING (
    tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid())
  );

-- Platform admins can see everything
CREATE POLICY admin_all_pm ON property_managers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'platform_admin')
  );

CREATE POLICY admin_all_properties ON rental_properties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'platform_admin')
  );
