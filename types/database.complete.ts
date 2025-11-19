// CACHE BUST: 2025-11-19 23:21:27
// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'platform_admin' | 'broker_admin' | 'office_manager' | 'realtor' | 'client'
          avatar_url: string | null
          broker_id: string | null
          office_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'platform_admin' | 'broker_admin' | 'office_manager' | 'realtor' | 'client'
          avatar_url?: string | null
          broker_id?: string | null
          office_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'platform_admin' | 'broker_admin' | 'office_manager' | 'realtor' | 'client'
          avatar_url?: string | null
          broker_id?: string | null
          office_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      brokers: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          website: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      offices: {
        Row: {
          id: string
          broker_id: string
          name: string
          manager_id: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          phone: string | null
          email: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      features: {
        Row: {
          id: string
          name: string
          display_name: string
          description: string | null
          category: string
          is_social_impact: boolean
          social_impact_type: string | null
          is_enabled_by_default: boolean
          created_at: string
        }
      }
      platform_feature_toggles: {
        Row: {
          id: string
          feature_id: string
          is_enabled: boolean
          notes: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          feature_id: string
          is_enabled?: boolean
          notes?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          feature_id?: string
          is_enabled?: boolean
          notes?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
      broker_feature_toggles: {
        Row: {
          id: string
          broker_id: string
          feature_id: string
          is_enabled: boolean
          notes: string | null
          updated_by: string | null
          updated_at: string
        }
      }
      office_feature_toggles: {
        Row: {
          id: string
          office_id: string
          feature_id: string
          is_enabled: boolean
          notes: string | null
          updated_by: string | null
          updated_at: string
        }
      }
      realtor_feature_toggles: {
        Row: {
          id: string
          realtor_id: string
          feature_id: string
          is_enabled: boolean
          notes: string | null
          updated_at: string
        }
      }
      properties: {
        Row: {
          id: string
          mls_id: string | null
          address: string
          city: string
          state: string
          zip: string
          county: string | null
          latitude: number | null
          longitude: number | null
          property_type: string
          status: string
          price: number
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          lot_size: number | null
          year_built: number | null
          description: string | null
          listing_agent_id: string | null
          broker_id: string | null
          office_id: string | null
          listed_date: string | null
          updated_date: string | null
          images: Json
          virtual_tour_url: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
      }
      leads: {
        Row: {
          id: string
          realtor_id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          status: string
          source: string | null
          budget_min: number | null
          budget_max: number | null
          preferred_locations: string[] | null
          property_type: string | null
          notes: string | null
          last_contact_date: string | null
          next_followup_date: string | null
          created_at: string
          updated_at: string
        }
      }
      transactions: {
        Row: {
          id: string
          property_id: string | null
          buyer_id: string | null
          buyer_agent_id: string | null
          seller_id: string | null
          seller_agent_id: string | null
          stage: string
          offer_price: number | null
          final_price: number | null
          closing_date: string | null
          earnest_money: number | null
          contingencies: string[] | null
          notes: string | null
          created_at: string
          updated_at: string
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
      user_role: 'platform_admin' | 'broker_admin' | 'office_manager' | 'realtor' | 'client'
      property_status: 'active' | 'pending' | 'sold' | 'off_market' | 'coming_soon'
      property_type: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial' | 'mobile_home' | 'farm_ranch'
      lead_status: 'new' | 'contacted' | 'qualified' | 'nurturing' | 'converted' | 'lost'
      transaction_stage: 'pre_approval' | 'property_search' | 'offer_submitted' | 'under_contract' | 'inspection' | 'appraisal' | 'financing' | 'final_walkthrough' | 'closing' | 'completed' | 'cancelled'
    }
  }
}
