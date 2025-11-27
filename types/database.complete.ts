// AUTO-GENERATED - DO NOT EDIT
// Generated from actual Supabase database schema
// Last updated: 2025-11-27

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
          organization_id: string | null
          role: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          avatar_url: string | null
          license_number: string | null
          specialties: string[] | null
          bio: string | null
          experience_years: number | null
          settings: Json | null
          active: boolean | null
          created_at: string
          updated_at: string
          is_admin: boolean | null
        }
        Insert: {
          id: string
          organization_id?: string | null
          role: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          license_number?: string | null
          specialties?: string[] | null
          bio?: string | null
          experience_years?: number | null
          settings?: Json | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          role?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          license_number?: string | null
          specialties?: string[] | null
          bio?: string | null
          experience_years?: number | null
          settings?: Json | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean | null
        }
      }
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
          features: Json | null
          amenities: Json | null
          parking_spaces: number | null
          garage_spaces: number | null
          photos: Json | null
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
          features?: Json | null
          amenities?: Json | null
          parking_spaces?: number | null
          garage_spaces?: number | null
          photos?: Json | null
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
          features?: Json | null
          amenities?: Json | null
          parking_spaces?: number | null
          garage_spaces?: number | null
          photos?: Json | null
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
          name: string | null
          email: string | null
          phone: string | null
          message: string | null
          source: string | null
          status: string | null
          property_id: string | null
          realtor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          message?: string | null
          source?: string | null
          status?: string | null
          property_id?: string | null
          realtor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          message?: string | null
          source?: string | null
          status?: string | null
          property_id?: string | null
          realtor_id?: string | null
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
      agents: {
        Row: {
          id: string
          organization_id: string | null
          role: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          avatar_url: string | null
          license_number: string | null
          specialties: string[] | null
          bio: string | null
          experience_years: number | null
          settings: Json | null
          active: boolean | null
          created_at: string
          updated_at: string
          is_admin: boolean | null
        }
        Insert: {
          id?: string
          organization_id?: string | null
          role?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          license_number?: string | null
          specialties?: string[] | null
          bio?: string | null
          experience_years?: number | null
          settings?: Json | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          role?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          license_number?: string | null
          specialties?: string[] | null
          bio?: string | null
          experience_years?: number | null
          settings?: Json | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean | null
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
      [_ in never]: never
    }
  }
}
