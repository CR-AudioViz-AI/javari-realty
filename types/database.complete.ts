// Auto-generated from Supabase schema
// DO NOT EDIT MANUALLY - Regenerate from schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profiles
        Insert: Profiles
        Update: Partial<Profiles>
      }
      leads: {
        Row: Leads
        Insert: Leads
        Update: Partial<Leads>
      }
      properties: {
        Row: Properties
        Insert: Properties
        Update: Partial<Properties>
      }
      transactions: {
        Row: Transactions
        Insert: Transactions
        Update: Partial<Transactions>
      }
      appointments: {
        Row: Appointments
        Insert: Appointments
        Update: Partial<Appointments>
      }
      showings: {
        Row: Showings
        Insert: Showings
        Update: Partial<Showings>
      }
      lead_activities: {
        Row: Lead_activities
        Insert: Lead_activities
        Update: Partial<Lead_activities>
      }
      property_images: {
        Row: Property_images
        Insert: Property_images
        Update: Partial<Property_images>
      }
      saved_properties: {
        Row: Saved_properties
        Insert: Saved_properties
        Update: Partial<Saved_properties>
      }
      saved_searches: {
        Row: Saved_searches
        Insert: Saved_searches
        Update: Partial<Saved_searches>
      }
      tour_requests: {
        Row: Tour_requests
        Insert: Tour_requests
        Update: Partial<Tour_requests>
      }
      messages: {
        Row: Messages
        Insert: Messages
        Update: Partial<Messages>
      }
      notifications: {
        Row: Notifications
        Insert: Notifications
        Update: Partial<Notifications>
      }
      organizations: {
        Row: Organizations
        Insert: Organizations
        Update: Partial<Organizations>
      }
      users: {
        Row: Users
        Insert: Users
        Update: Partial<Users>
      }
      subscriptions: {
        Row: Subscriptions
        Insert: Subscriptions
        Update: Partial<Subscriptions>
      }
    }
  }
}

// Row types
  export type Profiles = {
    active: boolean
    avatar_url: string
    bio: string
    created_at: string
    email: string
    experience_years: number
    first_name: string
    id: string
    is_admin: boolean
    last_name: string
    license_number: string
    organization_id: string
    phone: string
    role: string
    settings: any
    specialties: Array<string>
    updated_at: string
  }
  export type Leads = {
    assigned_agent_id: string
    created_at: string
    email: string
    full_name: string
    id: string
    interested_in: string
    last_contact_date: string
    lead_source: string
    lead_type: string
    max_price: number
    min_price: number
    notes: string
    phone: string
    preferred_locations: any
    priority: string
    property_preferences: any
    status: string
    updated_at: string
  }
  export type Properties = {
    address: string
    amenities: any
    bathrooms: number
    bedrooms: number
    building_class: string
    category: string
    ceiling_height: number
    city: string
    county: string
    created_at: string
    description: string
    featured: boolean
    features: any
    garage_spaces: number
    id: string
    latitude: number
    listed_date: string
    listing_agent_id: string
    loading_docks: number
    location: string
    longitude: number
    lot_size: number
    mls_number: string
    mls_status: string
    office_space: number
    parking_spaces: number
    photos: any
    power_capacity: string
    price: number
    property_type: string
    retail_space: number
    slug: string
    square_feet: number
    state: string
    status: string
    title: string
    transaction_type: string
    updated_at: string
    video_url: string
    virtual_tour_url: string
    warehouse_space: number
    year_built: number
    zip_code: string
    zoning: string
  }
  export type Transactions = {
    actual_closing_date: string
    agent_id: string
    appraisal_date: string
    buyer_email: string
    buyer_name: string
    buyer_phone: string
    closing_date: string
    commission_amount: number
    commission_rate: number
    contract_date: string
    created_at: string
    documents: any
    final_price: number
    id: string
    inspection_date: string
    lead_id: string
    metadata: any
    notes: string
    offer_price: number
    organization_id: string
    property_id: string
    seller_email: string
    seller_name: string
    seller_phone: string
    status: string
    transaction_type: string
    updated_at: string
  }
  export type Appointments = {
    agent_id: string
    appointment_type: string
    created_at: string
    customer_id: string
    description: string
    end_time: string
    id: string
    location: string
    notes: string
    property_id: string
    reminder_sent: boolean
    reminder_sent_at: string
    start_time: string
    status: string
    title: string
    updated_at: string
  }
  export type Showings = {
    agent_id: string
    agent_notes: string
    created_at: string
    customer_feedback: string
    customer_rating: number
    duration_minutes: number
    id: string
    lead_id: string
    property_id: string
    scheduled_date: string
    scheduled_time: string
    status: string
    updated_at: string
  }
  export type LeadActivities = {
    activity_type: string
    agent_id: string
    completed_at: string
    created_at: string
    description: string
    id: string
    lead_id: string
    metadata: any
    outcome: string
    scheduled_at: string
  }
  export type PropertyImages = {
    cloudinary_id: string
    created_at: string
    display_order: number
    id: string
    is_primary: boolean
    property_id: string
    thumbnail_url: string
    uploaded_by: string
    url: string
  }
  export type SavedProperties = {
    created_at: string
    customer_id: string
    id: string
    notes: string
    property_id: string
  }
  export type SavedSearches = {
    alert_frequency: string
    category: string
    created_at: string
    email_alerts: boolean
    filters: any
    id: string
    last_run_at: string
    locations: any
    max_price: number
    min_price: number
    search_name: string
    transaction_type: string
    user_id: string
  }
  export type TourRequests = {
    agent_id: string
    alternate_dates: any
    confirmed_by: string
    confirmed_date: string
    created_at: string
    customer_id: string
    id: string
    message: string
    preferred_date: string
    preferred_time: string
    property_id: string
    status: string
    updated_at: string
  }
  export type Messages = {
    attachment_url: string
    content: string
    conversation_id: string
    created_at: string
    id: string
    metadata: any
    read_by: Array<string>
    sender_id: string
  }
  export type Notifications = {
    created_at: string
    id: string
    message: string
    metadata: any
    read: boolean
    read_at: string
    related_id: string
    related_type: string
    title: string
    type: string
    user_id: string
  }
  export type Organizations = {
    active: boolean
    address: string
    city: string
    created_at: string
    email: string
    id: string
    license_number: string
    logo_url: string
    name: string
    phone: string
    settings: any
    state: string
    type: string
    updated_at: string
    website: string
    zip_code: string
  }
  export type Users = {
    address: string
    city: string
    created_at: string
    credit_balance: number
    email: string
    email_opt_in: boolean
    id: string
    last_login: string
    name: string
    phone: string
    sms_opt_in: boolean
    state: string
    subscription_tier: string
    updated_at: string
    user_type: string
    zip: string
  }
  export type Subscriptions = {
    cancel_at_period_end: boolean
    created_at: string
    current_period_end: string
    current_period_start: string
    id: string
    plan_id: string
    plan_name: string
    status: string
    stripe_customer_id: string
    stripe_subscription_id: string
    updated_at: string
    user_id: string
  }