// Auto-generated from Supabase schema
// Generated for CR Realtor Platform
// Tables: features, leads, organizations, profiles, properties, transactions

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
      features: {
        Row: {
          id: string
          name: string
          description: string | null
          enabled: boolean
          created_at: string
          updated_at: string
          [key: string]: any
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          organization_id: string | null
          created_at: string
          updated_at: string
          [key: string]: any
        }
        Insert: {
          id?: string
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          [key: string]: any
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          role: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          organization_id: string | null
          created_at: string
          updated_at: string
          [key: string]: any
        }
        Insert: {
          id: string
          role?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          organization_id: string | null
          address: string | null
          created_at: string
          updated_at: string
          [key: string]: any
        }
        Insert: {
          id?: string
          organization_id?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          organization_id: string | null
          amount: number | null
          created_at: string
          updated_at: string
          [key: string]: any
        }
        Insert: {
          id?: string
          organization_id?: string | null
          amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          amount?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      [key: string]: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, any>
      }
    }
    Functions: {
      [key: string]: any
    }
    Enums: {
      [key: string]: string
    }
  }
}
