// CR REALTOR PLATFORM - PROPERTY MANAGEMENT TYPES
// Created: December 3, 2025

// ============================================================================
// ENUMS
// ============================================================================

export type PMPropertyCategory = 'residential' | 'commercial' | 'industrial';

export type PMResidentialType = 
  | 'single_family'
  | 'apartment'
  | 'condo'
  | 'townhouse'
  | 'duplex'
  | 'triplex'
  | 'fourplex'
  | 'mobile_home'
  | 'student_housing'
  | 'senior_living';

export type PMCommercialType = 
  | 'office'
  | 'retail'
  | 'restaurant'
  | 'medical'
  | 'mixed_use'
  | 'hotel_motel'
  | 'strip_mall'
  | 'shopping_center';

export type PMIndustrialType = 
  | 'warehouse'
  | 'manufacturing'
  | 'distribution'
  | 'flex_space'
  | 'cold_storage'
  | 'data_center'
  | 'research_facility';

export type LeaseStatus = 
  | 'draft'
  | 'pending_signature'
  | 'active'
  | 'expiring_soon'
  | 'expired'
  | 'terminated'
  | 'renewed';

export type TenantStatus = 
  | 'prospect'
  | 'applicant'
  | 'approved'
  | 'active'
  | 'notice_given'
  | 'moved_out'
  | 'evicted';

export type MaintenancePriority = 'emergency' | 'urgent' | 'high' | 'medium' | 'low';

export type MaintenanceStatus = 
  | 'submitted'
  | 'acknowledged'
  | 'scheduled'
  | 'in_progress'
  | 'pending_parts'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'partial'
  | 'late'
  | 'failed'
  | 'refunded'
  | 'waived';

export type MaintenanceCategory = 
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'appliance'
  | 'structural'
  | 'pest'
  | 'landscaping'
  | 'cleaning'
  | 'other';

// ============================================================================
// PROPERTY MANAGER
// ============================================================================

export interface PropertyManager {
  id: string;
  user_id: string;
  company_name?: string;
  license_number?: string;
  license_state?: string;
  commission_rate: number;
  management_fee_type: 'percentage' | 'flat';
  management_fee?: number;
  is_realtor: boolean;
  realtor_id?: string;
  specialties: PMPropertyCategory[];
  service_areas: string[];
  properties_managed: number;
  units_managed: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// LANDLORD
// ============================================================================

export interface Landlord {
  id: string;
  user_id: string;
  company_name?: string;
  tax_id?: string;
  payment_method: string;
  bank_account_last4?: string;
  routing_number_last4?: string;
  payment_schedule: 'weekly' | 'biweekly' | 'monthly';
  management_agreement_signed: boolean;
  agreement_signed_date?: string;
  preferred_contact: 'email' | 'phone' | 'text';
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// RENTAL PROPERTY
// ============================================================================

export interface RentalProperty {
  id: string;
  landlord_id: string;
  property_manager_id?: string;
  
  // Location
  address: string;
  unit_number?: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  
  // Classification
  category: PMPropertyCategory;
  residential_type?: PMResidentialType;
  commercial_type?: PMCommercialType;
  industrial_type?: PMIndustrialType;
  
  // Details
  name?: string;
  description?: string;
  year_built?: number;
  total_units: number;
  total_sqft?: number;
  lot_size?: number;
  parking_spaces: number;
  
  // Financials
  market_rent?: number;
  purchase_price?: number;
  purchase_date?: string;
  current_value?: number;
  mortgage_payment?: number;
  property_tax_annual?: number;
  insurance_annual?: number;
  hoa_monthly?: number;
  
  // Status
  is_active: boolean;
  acquisition_date?: string;
  images: string[];
  documents: PropertyDocument[];
  
  created_at: string;
  updated_at: string;
  
  // Relations (when joined)
  landlord?: Landlord;
  property_manager?: PropertyManager;
  units?: RentalUnit[];
}

export interface PropertyDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploaded_at: string;
}

// ============================================================================
// RENTAL UNIT
// ============================================================================

export interface RentalUnit {
  id: string;
  property_id: string;
  unit_number: string;
  
  // Details
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  
  // Rent
  market_rent?: number;
  current_rent?: number;
  deposit_amount?: number;
  
  // Status
  is_available: boolean;
  available_date?: string;
  last_renovation?: string;
  
  // Amenities
  amenities: string[];
  appliances: string[];
  utilities_included: string[];
  pet_policy: 'no_pets' | 'cats_only' | 'small_dogs' | 'all_pets';
  pet_deposit?: number;
  pet_rent_monthly?: number;
  
  images: string[];
  virtual_tour_url?: string;
  
  created_at: string;
  updated_at: string;
  
  // Relations (when joined)
  property?: RentalProperty;
  current_lease?: Lease;
  current_tenant?: Tenant;
}

// ============================================================================
// TENANT
// ============================================================================

export interface Tenant {
  id: string;
  user_id?: string;
  
  // Personal Info
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  ssn_last4?: string;
  
  // Employment
  employer?: string;
  employer_phone?: string;
  job_title?: string;
  monthly_income?: number;
  employment_start_date?: string;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  
  // Rental History
  previous_address?: string;
  previous_landlord_name?: string;
  previous_landlord_phone?: string;
  years_at_previous?: number;
  reason_for_leaving?: string;
  
  // Status
  status: TenantStatus;
  credit_score?: number;
  background_check_date?: string;
  background_check_status?: string;
  
  documents: TenantDocument[];
  notes?: string;
  
  created_at: string;
  updated_at: string;
  
  // Computed
  full_name?: string;
}

export interface TenantDocument {
  id: string;
  name: string;
  type: 'id' | 'pay_stub' | 'bank_statement' | 'reference' | 'other';
  url: string;
  uploaded_at: string;
}

export interface CoTenant {
  id: string;
  primary_tenant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  relationship: 'spouse' | 'partner' | 'roommate' | 'family';
  is_on_lease: boolean;
  created_at: string;
}

// ============================================================================
// LEASE
// ============================================================================

export interface Lease {
  id: string;
  unit_id: string;
  tenant_id: string;
  property_manager_id?: string;
  
  // Terms
  lease_type: 'fixed' | 'month_to_month';
  start_date: string;
  end_date?: string;
  move_in_date?: string;
  move_out_date?: string;
  
  // Rent
  monthly_rent: number;
  security_deposit?: number;
  pet_deposit?: number;
  last_month_rent?: number;
  
  // Payment Terms
  rent_due_day: number;
  grace_period_days: number;
  late_fee_type: 'flat' | 'percentage' | 'daily';
  late_fee_amount?: number;
  late_fee_percentage?: number;
  late_fee_daily?: number;
  late_fee_max?: number;
  
  // Status
  status: LeaseStatus;
  signed_date?: string;
  
  // Renewal
  auto_renew: boolean;
  renewal_terms?: string;
  renewal_rent_increase?: number;
  renewal_notice_days: number;
  
  // Documents
  lease_document_url?: string;
  addendums: LeaseAddendum[];
  
  // Termination
  termination_date?: string;
  termination_reason?: string;
  termination_notes?: string;
  
  created_at: string;
  updated_at: string;
  
  // Relations (when joined)
  unit?: RentalUnit;
  tenant?: Tenant;
  property?: RentalProperty;
}

export interface LeaseAddendum {
  id: string;
  name: string;
  url: string;
  signed_date?: string;
}

// ============================================================================
// RENT PAYMENT
// ============================================================================

export interface RentPayment {
  id: string;
  lease_id: string;
  tenant_id?: string;
  
  // Payment Details
  payment_date?: string;
  due_date: string;
  period_start?: string;
  period_end?: string;
  
  // Amounts
  rent_amount: number;
  late_fee: number;
  other_charges: number;
  other_charges_description?: string;
  total_amount: number;
  amount_paid: number;
  balance_due?: number;
  
  // Status
  status: PaymentStatus;
  
  // Payment Method
  payment_method?: 'check' | 'ach' | 'credit_card' | 'cash' | 'money_order' | 'online';
  payment_reference?: string;
  
  // Processing
  processed_date?: string;
  processed_by?: string;
  
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  lease?: Lease;
  tenant?: Tenant;
}

// ============================================================================
// MAINTENANCE REQUEST
// ============================================================================

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  unit_id?: string;
  tenant_id?: string;
  property_manager_id?: string;
  
  // Request Details
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  
  // Location
  location_in_unit?: string;
  
  // Assignment
  assigned_to?: string;
  vendor_id?: string;
  
  // Scheduling
  requested_date?: string;
  scheduled_date?: string;
  scheduled_time_start?: string;
  scheduled_time_end?: string;
  completed_date?: string;
  
  // Costs
  estimated_cost?: number;
  actual_cost?: number;
  tenant_responsible: boolean;
  
  // Access
  permission_to_enter: boolean;
  entry_instructions?: string;
  pet_in_unit: boolean;
  
  // Documentation
  images: string[];
  completion_images: string[];
  
  // Resolution
  resolution_notes?: string;
  tenant_satisfaction?: number;
  
  created_at: string;
  updated_at: string;
  
  // Relations
  property?: RentalProperty;
  unit?: RentalUnit;
  tenant?: Tenant;
}

// ============================================================================
// VENDOR
// ============================================================================

export interface PMVendor {
  id: string;
  property_manager_id?: string;
  
  company_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  
  // Services
  services: MaintenanceCategory[];
  service_areas: string[];
  
  // Business Info
  license_number?: string;
  insurance_expiry?: string;
  w9_on_file: boolean;
  
  // Rates
  hourly_rate?: number;
  emergency_rate?: number;
  
  // Performance
  jobs_completed: number;
  average_rating?: number;
  
  is_preferred: boolean;
  is_active: boolean;
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// INSPECTION
// ============================================================================

export interface PropertyInspection {
  id: string;
  property_id: string;
  unit_id?: string;
  lease_id?: string;
  
  inspection_type: 'move_in' | 'move_out' | 'routine' | 'annual' | 'complaint';
  scheduled_date?: string;
  completed_date?: string;
  inspector_id?: string;
  
  // Checklist Results
  checklist: InspectionChecklist;
  
  // Overall Condition
  overall_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Damages
  damages_found: boolean;
  damage_description?: string;
  damage_cost_estimate?: number;
  tenant_responsible_damages?: number;
  
  // Documentation
  photos: string[];
  tenant_signature?: string;
  tenant_signed_date?: string;
  inspector_signature?: string;
  inspector_signed_date?: string;
  
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InspectionChecklist {
  [area: string]: {
    [item: string]: {
      condition: 'excellent' | 'good' | 'fair' | 'poor' | 'na';
      notes?: string;
      photos?: string[];
    };
  };
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export interface PMDashboardStats {
  total_properties: number;
  total_units: number;
  occupied_units: number;
  vacancy_rate: number;
  
  active_leases: number;
  expiring_soon: number;
  
  rent_collected_mtd: number;
  rent_outstanding: number;
  
  open_maintenance: number;
  emergency_requests: number;
  
  // By category
  residential_units: number;
  commercial_units: number;
  industrial_units: number;
}

// ============================================================================
// FORM INPUTS
// ============================================================================

export interface CreatePropertyInput {
  landlord_id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  category: PMPropertyCategory;
  residential_type?: PMResidentialType;
  commercial_type?: PMCommercialType;
  industrial_type?: PMIndustrialType;
  total_units?: number;
  market_rent?: number;
}

export interface CreateTenantInput {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  employer?: string;
  monthly_income?: number;
}

export interface CreateLeaseInput {
  unit_id: string;
  tenant_id: string;
  lease_type: 'fixed' | 'month_to_month';
  start_date: string;
  end_date?: string;
  monthly_rent: number;
  security_deposit?: number;
  rent_due_day?: number;
}

export interface CreateMaintenanceInput {
  property_id: string;
  unit_id?: string;
  tenant_id?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority?: MaintenancePriority;
  permission_to_enter?: boolean;
}

export interface RecordPaymentInput {
  lease_id: string;
  amount_paid: number;
  payment_method: string;
  payment_reference?: string;
  payment_date?: string;
}
