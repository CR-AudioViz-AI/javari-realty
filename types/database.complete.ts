// Complete Supabase Database Types
// Generated: 2025-11-19
// Project: CR Realtor Platform

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
      transactions: {
        Row: {
          id: string
          stage: string
          buyer_agent_id: string | null
          seller_agent_id: string | null
          property_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          stage?: string
          buyer_agent_id?: string | null
          seller_agent_id?: string | null
          property_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stage?: string
          buyer_agent_id?: string | null
          seller_agent_id?: string | null
          property_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          status: string
          source: string | null
          buyer_agent_id: string | null
          seller_agent_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          status?: string
          source?: string | null
          buyer_agent_id?: string | null
          seller_agent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          status?: string
          source?: string | null
          buyer_agent_id?: string | null
          seller_agent_id?: string | null
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          status: string
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          price: number | null
          created_at: string
        }
        Insert: {
          id: string
          status?: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          status?: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          price?: number | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          type: string | null
          url: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          type?: string | null
          url?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string | null
          url?: string
          created_at?: string
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
        Insert: {
          id: string
          name: string
          display_name?: string
          description?: string | null
          category?: string
          is_social_impact?: boolean
          social_impact_type?: string | null
          is_enabled_by_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          description?: string | null
          category?: string
          is_social_impact?: boolean
          social_impact_type?: string | null
          is_enabled_by_default?: boolean
          created_at?: string
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
          id: string
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
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Update<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
