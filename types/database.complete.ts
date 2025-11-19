// Complete Supabase types with Insert/Update/Delete for all tables
// Generated for CR Realtor Platform

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
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          website?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          website?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
        Insert: {
          id?: string
          broker_id: string
          name: string
          manager_id?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          phone?: string | null
          email?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          broker_id?: string
          name?: string
          manager_id?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          phone?: string | null
          email?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          [key: string]: any
        }
        Insert: {
          id?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
      }
      transactions: {
        Row: {
          id: string
          stage: string
          [key: string]: any
        }
        Insert: {
          id?: string
          stage?: string
          [key: string]: any
        }
        Update: {
          id?: string
          stage?: string
          [key: string]: any
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
          id?: string
          name: string
          display_name: string
          description?: string | null
          category: string
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
    }
  }
}
