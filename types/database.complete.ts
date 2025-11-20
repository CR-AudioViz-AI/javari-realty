// AUTO-GENERATED - DO NOT EDIT
// Generated from actual Supabase database schema
// Last updated: 2025-11-20 10:06 PM EST

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
      properties: {
        Row: {
          id: string
          category: string | null
          transaction_type: string | null
          property_type: string | null
          title: string | null
          description: string | null
          price: number | null
          address: string
          city: string
          state: string
          zip_code: string
          county: string | null
          latitude: number | null
          longitude: number | null
          location: unknown | null
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          lot_size: number | null
          year_built: number | null
          zoning: string | null
          building_class: string | null
          office_space: number | null
          warehouse_space: number | null
          retail_space: number | null
          loading_docks: number | null
          ceiling_height: number | null
          power_capacity: number | null
          features: string[] | null
          amenities: string[] | null
          parking_spaces: number | null
          garage_spaces: number | null
          photos: string[] | null
          video_url: string | null
          virtual_tour_url: string | null
          mls_number: string | null
          mls_status: string | null
          status: string | null
          featured: boolean | null
          listing_agent_id: string | null
          listed_date: string | null
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category?: string | null
          transaction_type?: string | null
          property_type?: string | null
          title?: string | null
          description?: string | null
          price?: number | null
          address: string
          city: string
          state: string
          zip_code: string
          county?: string | null
          latitude?: number | null
          longitude?: number | null
          location?: unknown | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: number | null
          year_built?: number | null
          zoning?: string | null
          building_class?: string | null
          office_space?: number | null
          warehouse_space?: number | null
          retail_space?: number | null
          loading_docks?: number | null
          ceiling_height?: number | null
          power_capacity?: number | null
          features?: string[] | null
          amenities?: string[] | null
          parking_spaces?: number | null
          garage_spaces?: number | null
          photos?: string[] | null
          video_url?: string | null
          virtual_tour_url?: string | null
          mls_number?: string | null
          mls_status?: string | null
          status?: string | null
          featured?: boolean | null
          listing_agent_id?: string | null
          listed_date?: string | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string | null
          transaction_type?: string | null
          property_type?: string | null
          title?: string | null
          description?: string | null
          price?: number | null
          address?: string
          city?: string
          state?: string
          zip_code?: string
          county?: string | null
          latitude?: number | null
          longitude?: number | null
          location?: unknown | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: number | null
          year_built?: number | null
          zoning?: string | null
          building_class?: string | null
          office_space?: number | null
          warehouse_space?: number | null
          retail_space?: number | null
          loading_docks?: number | null
          ceiling_height?: number | null
          power_capacity?: number | null
          features?: string[] | null
          amenities?: string[] | null
          parking_spaces?: number | null
          garage_spaces?: number | null
          photos?: string[] | null
          video_url?: string | null
          virtual_tour_url?: string | null
          mls_number?: string | null
          mls_status?: string | null
          status?: string | null
          featured?: boolean | null
          listing_agent_id?: string | null
          listed_date?: string | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          realtor_id: string | null
          name: string | null
          email: string | null
          phone: string | null
          message: string | null
          property_id: string | null
          status: string | null
          source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          realtor_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          message?: string | null
          property_id?: string | null
          status?: string | null
          source?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          realtor_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          message?: string | null
          property_id?: string | null
          status?: string | null
          source?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          phone: string | null
          role: string | null
          avatar_url: string | null
          broker_id: string | null
          office_id: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          role?: string | null
          avatar_url?: string | null
          broker_id?: string | null
          office_id?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          role?: string | null
          avatar_url?: string | null
          broker_id?: string | null
          office_id?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          property_id: string | null
          buyer_agent_id: string | null
          seller_agent_id: string | null
          stage: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          buyer_agent_id?: string | null
          seller_agent_id?: string | null
          stage?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          buyer_agent_id?: string | null
          seller_agent_id?: string | null
          stage?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      features: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      platform_feature_toggles: {
        Row: {
          id: string
          feature_id: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          feature_id: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          feature_id?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      broker_feature_toggles: {
        Row: {
          id: string
          broker_id: string
          feature_id: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          broker_id: string
          feature_id: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          broker_id?: string
          feature_id?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      office_feature_toggles: {
        Row: {
          id: string
          office_id: string
          feature_id: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          office_id: string
          feature_id: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          office_id?: string
          feature_id?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      realtor_feature_toggles: {
        Row: {
          id: string
          realtor_id: string
          feature_id: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          realtor_id: string
          feature_id: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          realtor_id?: string
          feature_id?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      feature_usage_tracking: {
        Row: {
          id: string
          user_id: string
          feature_id: string
          usage_count: number
          last_used_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feature_id: string
          usage_count?: number
          last_used_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feature_id?: string
          usage_count?: number
          last_used_at?: string
          created_at?: string
        }
      }
    }
  }
}
