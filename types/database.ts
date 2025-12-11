// CR REALTOR PLATFORM - DATABASE TYPES
// Generated: December 10, 2025
// Matches: DEPLOY_CR_REALTOR_SAFE.sql schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enum types matching PostgreSQL enums
export type UserRole = 'platform_admin' | 'broker_admin' | 'office_manager' | 'realtor' | 'client'
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'off_market' | 'coming_soon'
export type PropertyType = 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial' | 'mobile_home' | 'farm_ranch'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'showing' | 'offer' | 'under_contract' | 'closed' | 'lost'
export type TransactionStatus = 'active' | 'pending' | 'under_contract' | 'closed' | 'cancelled' | 'expired'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: UserRole
          avatar_url: string | null
          license_number: string | null
          license_state: string | null
          brokerage: string | null
          bio: string | null
          specialties: string[] | null
          service_areas: string[] | null
          years_experience: number | null
          is_admin: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          license_number?: string | null
          license_state?: string | null
          brokerage?: string | null
          bio?: string | null
          specialties?: string[] | null
          service_areas?: string[] | null
          years_experience?: number | null
          is_admin?: boolean
          is_active?: boolean
        }
        Update: {
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          license_number?: string | null
          license_state?: string | null
          brokerage?: string | null
          bio?: string | null
          specialties?: string[] | null
          service_areas?: string[] | null
          years_experience?: number | null
          is_admin?: boolean
          is_active?: boolean
        }
      }
      
      properties: {
        Row: {
          id: string
          agent_id: string | null
          mls_id: string | null
          title: string
          description: string | null
          property_type: string
          status: string
          address: string
          city: string
          state: string
          zip_code: string
          county: string | null
          latitude: number | null
          longitude: number | null
          price: number
          bedrooms: number | null
          bathrooms: number | null
          sqft: number | null
          lot_size: number | null
          year_built: number | null
          features: string[] | null
          photos: string[] | null
          primary_image_url: string | null
          virtual_tour_url: string | null
          is_featured: boolean
          listed_date: string | null
          sold_date: string | null
          sold_price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id?: string | null
          mls_id?: string | null
          title: string
          description?: string | null
          property_type?: string
          status?: string
          address: string
          city: string
          state: string
          zip_code: string
          county?: string | null
          latitude?: number | null
          longitude?: number | null
          price: number
          bedrooms?: number | null
          bathrooms?: number | null
          sqft?: number | null
          lot_size?: number | null
          year_built?: number | null
          features?: string[] | null
          photos?: string[] | null
          primary_image_url?: string | null
          virtual_tour_url?: string | null
          is_featured?: boolean
          listed_date?: string | null
        }
        Update: {
          agent_id?: string | null
          mls_id?: string | null
          title?: string
          description?: string | null
          property_type?: string
          status?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          county?: string | null
          latitude?: number | null
          longitude?: number | null
          price?: number
          bedrooms?: number | null
          bathrooms?: number | null
          sqft?: number | null
          lot_size?: number | null
          year_built?: number | null
          features?: string[] | null
          photos?: string[] | null
          primary_image_url?: string | null
          virtual_tour_url?: string | null
          is_featured?: boolean
          listed_date?: string | null
          sold_date?: string | null
          sold_price?: number | null
        }
      }
      
      realtor_customers: {
        Row: {
          id: string
          auth_user_id: string | null
          agent_id: string | null
          email: string
          full_name: string
          phone: string | null
          preferred_contact: string
          budget_min: number | null
          budget_max: number | null
          preferred_locations: string[] | null
          property_types: string[] | null
          notes: string | null
          status: string
          source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          agent_id?: string | null
          email: string
          full_name: string
          phone?: string | null
          preferred_contact?: string
          budget_min?: number | null
          budget_max?: number | null
          preferred_locations?: string[] | null
          property_types?: string[] | null
          notes?: string | null
          status?: string
          source?: string | null
        }
        Update: {
          auth_user_id?: string | null
          agent_id?: string | null
          email?: string
          full_name?: string
          phone?: string | null
          preferred_contact?: string
          budget_min?: number | null
          budget_max?: number | null
          preferred_locations?: string[] | null
          property_types?: string[] | null
          notes?: string | null
          status?: string
          source?: string | null
        }
      }
      
      realtor_leads: {
        Row: {
          id: string
          agent_id: string | null
          email: string
          full_name: string
          phone: string | null
          source: string | null
          property_interest: string | null
          message: string | null
          status: string
          priority: string
          last_contact_date: string | null
          next_follow_up_date: string | null
          converted_to_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id?: string | null
          email: string
          full_name: string
          phone?: string | null
          source?: string | null
          property_interest?: string | null
          message?: string | null
          status?: string
          priority?: string
          last_contact_date?: string | null
          next_follow_up_date?: string | null
          converted_to_customer_id?: string | null
        }
        Update: {
          agent_id?: string | null
          email?: string
          full_name?: string
          phone?: string | null
          source?: string | null
          property_interest?: string | null
          message?: string | null
          status?: string
          priority?: string
          last_contact_date?: string | null
          next_follow_up_date?: string | null
          converted_to_customer_id?: string | null
        }
      }
      
      realtor_transactions: {
        Row: {
          id: string
          agent_id: string | null
          property_id: string | null
          customer_id: string | null
          transaction_type: string
          status: string
          property_address: string | null
          list_price: number | null
          sale_price: number | null
          commission_rate: number | null
          commission_amount: number | null
          buyer_name: string | null
          seller_name: string | null
          list_date: string | null
          closing_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id?: string | null
          property_id?: string | null
          customer_id?: string | null
          transaction_type: string
          status?: string
          property_address?: string | null
          list_price?: number | null
          sale_price?: number | null
          commission_rate?: number | null
          commission_amount?: number | null
          buyer_name?: string | null
          seller_name?: string | null
          list_date?: string | null
          closing_date?: string | null
          notes?: string | null
        }
        Update: {
          agent_id?: string | null
          property_id?: string | null
          customer_id?: string | null
          transaction_type?: string
          status?: string
          property_address?: string | null
          list_price?: number | null
          sale_price?: number | null
          commission_rate?: number | null
          commission_amount?: number | null
          buyer_name?: string | null
          seller_name?: string | null
          list_date?: string | null
          closing_date?: string | null
          notes?: string | null
        }
      }
      
      vendors: {
        Row: {
          id: string
          agent_id: string | null
          business_name: string
          contact_name: string | null
          email: string | null
          phone: string | null
          website: string | null
          category: string
          description: string | null
          services_offered: string[] | null
          agent_rating: number | null
          agent_notes: string | null
          is_preferred: boolean
          commission_type: string | null
          commission_amount: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id?: string | null
          business_name: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          category: string
          description?: string | null
          services_offered?: string[] | null
          agent_rating?: number | null
          agent_notes?: string | null
          is_preferred?: boolean
          commission_type?: string | null
          commission_amount?: number | null
          is_active?: boolean
        }
        Update: {
          agent_id?: string | null
          business_name?: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          category?: string
          description?: string | null
          services_offered?: string[] | null
          agent_rating?: number | null
          agent_notes?: string | null
          is_preferred?: boolean
          commission_type?: string | null
          commission_amount?: number | null
          is_active?: boolean
        }
      }
      
      messages: {
        Row: {
          id: string
          sender_id: string
          sender_type: string
          recipient_id: string
          recipient_type: string
          agent_id: string | null
          customer_id: string | null
          subject: string | null
          content: string
          property_id: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          sender_type: string
          recipient_id: string
          recipient_type: string
          agent_id?: string | null
          customer_id?: string | null
          subject?: string | null
          content: string
          property_id?: string | null
          is_read?: boolean
          read_at?: string | null
        }
        Update: {
          sender_id?: string
          sender_type?: string
          recipient_id?: string
          recipient_type?: string
          agent_id?: string | null
          customer_id?: string | null
          subject?: string | null
          content?: string
          property_id?: string | null
          is_read?: boolean
          read_at?: string | null
        }
      }
      
      saved_properties: {
        Row: {
          id: string
          customer_id: string | null
          property_id: string | null
          notes: string | null
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          property_id?: string | null
          notes?: string | null
          rating?: number | null
        }
        Update: {
          customer_id?: string | null
          property_id?: string | null
          notes?: string | null
          rating?: number | null
        }
      }
      
      showings: {
        Row: {
          id: string
          property_id: string | null
          agent_id: string | null
          customer_id: string | null
          showing_date: string
          showing_time: string
          status: string
          feedback: string | null
          interest_level: number | null
          attendee_name: string | null
          attendee_phone: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          agent_id?: string | null
          customer_id?: string | null
          showing_date: string
          showing_time: string
          status?: string
          feedback?: string | null
          interest_level?: number | null
          attendee_name?: string | null
          attendee_phone?: string | null
          notes?: string | null
        }
        Update: {
          property_id?: string | null
          agent_id?: string | null
          customer_id?: string | null
          showing_date?: string
          showing_time?: string
          status?: string
          feedback?: string | null
          interest_level?: number | null
          attendee_name?: string | null
          attendee_phone?: string | null
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      property_status: PropertyStatus
      property_type: PropertyType
      lead_status: LeadStatus
      transaction_status: TransactionStatus
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type Profile = Tables<'profiles'>
export type Property = Tables<'properties'>
export type Customer = Tables<'realtor_customers'>
export type Lead = Tables<'realtor_leads'>
export type Transaction = Tables<'realtor_transactions'>
export type Vendor = Tables<'vendors'>
export type Message = Tables<'messages'>
export type SavedProperty = Tables<'saved_properties'>
export type Showing = Tables<'showings'>
