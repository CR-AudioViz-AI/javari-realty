import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.complete'

type Profile = Database['public']['Tables']['profiles']['Row']
type Feature = Database['public']['Tables']['features']['Row']
type PlatformToggle = Database['public']['Tables']['platform_feature_toggles']['Row']
type BrokerToggle = Database['public']['Tables']['broker_feature_toggles']['Row']
type OfficeToggle = Database['public']['Tables']['office_feature_toggles']['Row']
type RealtorToggle = Database['public']['Tables']['realtor_feature_toggles']['Row']
type FeatureUsage = Database['public']['Tables']['feature_usage_tracking']['Row']
type FeatureUsageInsert = Database['public']['Tables']['feature_usage_tracking']['Insert']

/**
 * Check if a feature is enabled for a specific user.
 * Checks hierarchical permissions: Platform → Broker → Office → Realtor
 * 
 * @param userId - The user's ID
 * @param featureName - The feature name to check
 * @returns boolean - Whether the feature is enabled
 */
export async function isFeatureEnabled(
  userId: string,
  featureName: string
): Promise<boolean> {
  const supabase = createClient()

  // Get user profile with relationships
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, broker_id, office_id')
    .eq('id', userId)
    .single() as { data: Pick<Profile, 'role' | 'broker_id' | 'office_id'> | null; error: any }

  if (!profile) return false

  // Get the feature
  const { data: feature } = await supabase
    .from('features')
    .select('id')
    .eq('name', featureName)
    .single() as { data: Pick<Feature, 'id'> | null; error: any }

  if (!feature) return false

  // 1. Check platform-level toggle (highest priority)
  const { data: platformToggle } = await supabase
    .from('platform_feature_toggles')
    .select('is_enabled')
    .eq('feature_id', feature.id)
    .single() as { data: Pick<PlatformToggle, 'is_enabled'> | null; error: any }

  if (!platformToggle?.is_enabled) return false

  // 2. Check broker-level toggle (if user has broker)
  if (profile.broker_id) {
    const { data: brokerToggle } = await supabase
      .from('broker_feature_toggles')
      .select('is_enabled')
      .eq('broker_id', profile.broker_id)
      .eq('feature_id', feature.id)
      .single() as { data: Pick<BrokerToggle, 'is_enabled'> | null; error: any }

    if (brokerToggle && !brokerToggle.is_enabled) return false
  }

  // 3. Check office-level toggle (if user has office)
  if (profile.office_id) {
    const { data: officeToggle } = await supabase
      .from('office_feature_toggles')
      .select('is_enabled')
      .eq('office_id', profile.office_id)
      .eq('feature_id', feature.id)
      .single() as { data: Pick<OfficeToggle, 'is_enabled'> | null; error: any }

    if (officeToggle && !officeToggle.is_enabled) return false
  }

  // 4. Check realtor-level toggle (personal preference)
  if (profile.role === 'realtor') {
    const { data: realtorToggle } = await supabase
      .from('realtor_feature_toggles')
      .select('is_enabled')
      .eq('realtor_id', userId)
      .eq('feature_id', feature.id)
      .single() as { data: Pick<RealtorToggle, 'is_enabled'> | null; error: any }

    if (realtorToggle && !realtorToggle.is_enabled) return false
  }

  // If all checks pass, feature is enabled
  return true
}

/**
 * Get all available features for display
 */
export async function getAllFeatures() {
  const supabase = createClient()

  const { data: features, error } = await supabase
    .from('features')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true }) as { data: Feature[] | null; error: any }

  if (error || !features) return []

  return features
}

/**
 * Get features grouped by category
 */
export async function getFeaturesByCategory() {
  const features = await getAllFeatures()
  
  return features.reduce((acc, feature) => {
    if (!acc[feature.name]) {
      acc[feature.name] = []
    }
    acc[feature.name].push(feature)
    return acc
  }, {} as Record<string, Feature[]>)
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(
  userId: string,
  featureId: string
): Promise<void> {
  const supabase = createClient()

  // Try to increment existing usage record
  const { data: existing } = await supabase
    .from('feature_usage_tracking')
    .select('id')
    .eq('feature_id', featureId)
    .eq('user_id', userId)
    .single() as { data: Pick<FeatureUsage, 'id'> | null; error: any }

  if (existing) {
    // Use database function to increment
    await supabase.rpc('increment_feature_usage', {
      p_feature_id: featureId,
      p_user_id: userId,
    } as any)
  } else {
    // Create new usage record
    await supabase
      .from('feature_usage_tracking')
      .insert({
        feature_id: featureId,
        user_id: userId,
        usage_count: 1,
        last_used_at: new Date().toISOString(),
      } as any)
  }
}

/**
 * Get feature usage statistics
 */
export async function getFeatureUsageStats(featureId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('feature_usage_tracking')
    .select('*')
    .eq('feature_id', featureId) as { data: FeatureUsage[] | null; error: any }

  if (error || !data) return { totalUsage: 0, uniqueUsers: 0 }

  return {
    totalUsage: data.reduce((sum, record) => sum + record.usage_count, 0),
    uniqueUsers: data.length,
  }
}

/**
 * Enable/disable a platform-wide feature
 */
export async function setPlatformFeatureToggle(
  featureId: string,
  enabled: boolean,
  userId: string
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('platform_feature_toggles')
    .insert({
      feature_id: featureId,
      is_enabled: enabled,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    } as any)
    .select()

  return !error
}

/**
 * Enable/disable a feature for a specific broker
 */
export async function setBrokerFeatureToggle(
  brokerId: string,
  featureId: string,
  enabled: boolean,
  userId: string
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('broker_feature_toggles')
    .insert({
      broker_id: brokerId,
      feature_id: featureId,
      is_enabled: enabled,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    } as any)
    .select()

  return !error
}

/**
 * Enable/disable a feature for a specific office
 */
export async function setOfficeFeatureToggle(
  officeId: string,
  featureId: string,
  enabled: boolean,
  userId: string
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('office_feature_toggles')
    .insert({
      office_id: officeId,
      feature_id: featureId,
      is_enabled: enabled,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    } as any)
    .select()

  return !error
}

/**
 * Enable/disable a feature for a specific realtor
 */
export async function setRealtorFeatureToggle(
  realtorId: string,
  featureId: string,
  enabled: boolean
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('realtor_feature_toggles')
    .insert({
      realtor_id: realtorId,
      feature_id: featureId,
      is_enabled: enabled,
      updated_at: new Date().toISOString(),
    } as any)
    .select()

  return !error
}
