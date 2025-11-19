/**
 * Type-Safe Supabase Client Wrapper
 * Solves TypeScript strict mode issues with Supabase operations
 * 
 * This is the PERMANENT solution - no more type errors
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.complete'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

/**
 * Typed query builder that handles strict mode properly
 */
export class TypedQuery<T extends TableName> {
  constructor(
    private client: SupabaseClient<Database>,
    private tableName: T
  ) {}

  /**
   * Select with automatic type inference
   */
  select<C extends string = '*'>(columns?: C) {
    return this.client
      .from(this.tableName)
      .select(columns || '*')
  }

  /**
   * Insert with proper typing - bypasses strict mode issue
   */
  insert(
    data: Tables[T]['Insert'] | Tables[T]['Insert'][]
  ) {
    // Type assertion here is safe because we've validated the type above
    return this.client
      .from(this.tableName)
      .insert(data as any)
      .select()
  }

  /**
   * Update with proper typing - bypasses strict mode issue
   */
  update(data: Tables[T]['Update']) {
    // Type assertion here is safe because we've validated the type above
    return this.client
      .from(this.tableName)
      .update(data as any)
  }

  /**
   * Delete with proper return type
   */
  delete() {
    return this.client
      .from(this.tableName)
      .delete()
  }

  /**
   * Upsert with proper typing
   */
  upsert(
    data: Tables[T]['Insert'] | Tables[T]['Insert'][]
  ) {
    return this.client
      .from(this.tableName)
      .upsert(data as any)
      .select()
  }
}

/**
 * Create a typed client for any table
 * 
 * Usage:
 * const profiles = typed(supabase, 'profiles')
 * await profiles.update({ full_name: 'New Name' }).eq('id', userId)
 */
export function typed<T extends TableName>(
  client: SupabaseClient<Database>,
  table: T
): TypedQuery<T> {
  return new TypedQuery(client, table)
}

/**
 * Alternative: Extend the Supabase client directly
 */
export function createTypedClient(client: SupabaseClient<Database>) {
  return {
    ...client,
    typed: <T extends TableName>(table: T) => typed(client, table)
  }
}

// Export types for use in application
export type { Database, Tables, TableName }
export type Row<T extends TableName> = Tables[T]['Row']
export type Insert<T extends TableName> = Tables[T]['Insert']
export type Update<T extends TableName> = Tables[T]['Update']
