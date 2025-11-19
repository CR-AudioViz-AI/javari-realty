import { createClient } from '@/lib/supabase/server'

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
    .single()

  if (!profile) return false

  // Get the feature
  const { data: feature } = await supabase
    .from('features')
    .select('id')
    .eq('name', featureName)
    .single()

  if (!feature) return false

  // 1. Check platform-level toggle (highest priority)
  const { data: platformToggle } = await supabase
    .from('platform_feature_toggles')
    .select('is_enabled')
    .eq('feature_id', feature.id)
    .single()

  if (!platformToggle?.is_enabled) return false

  // 2. Check broker-level toggle (if user has broker)
  if (profile.broker_id) {
    const { data: brokerToggle } = await supabase
      .from('broker_feature_toggles')
      .select('is_enabled')
      .eq('broker_id', profile.broker_id)
      .eq('feature_id', feature.id)
      .single()

    if (brokerToggle && !brokerToggle.is_enabled) return false
  }

  // 3. Check office-level toggle (if user has office)
  if (profile.office_id) {
    const { data: officeToggle } = await supabase
      .from('office_feature_toggles')
      .select('is_enabled')
      .eq('office_id', profile.office_id)
      .eq('feature_id', feature.id)
      .single()

    if (officeToggle && !officeToggle.is_enabled) return false
  }

  // 4. Check realtor-level toggle (personal preference)
  if (profile.role === 'realtor') {
    const { data: realtorToggle } = await supabase
      .from('realtor_feature_toggles')
      .select('is_enabled')
      .eq('realtor_id', userId)
      .eq('feature_id', feature.id)
      .single()

    if (realtorToggle && !realtorToggle.is_enabled) return false
  }

  // If all checks pass, feature is enabled
  return true
}

/**
 * Get all enabled features for a user
 * 
 * @param userId - The user's ID
 * @returns Array of enabled feature names
 */
export async function getUserEnabledFeatures(
  userId: string
): Promise<string[]> {
  const supabase = createClient()

  // Get all features
  const { data: features } = await supabase
    .from('features')
    .select('name')
    .order('name')

  if (!features) return []

  // Check each feature
  const enabledFeatures: string[] = []
  for (const feature of features) {
    const enabled = await isFeatureEnabled(userId, feature.name)
    if (enabled) {
      enabledFeatures.push(feature.name)
    }
  }

  return enabledFeatures
}

/**
 * Track feature usage
 * 
 * @param userId - The user's ID
 * @param featureName - The feature being used
 */
export async function trackFeatureUsage(
  userId: string,
  featureName: string
): Promise<void> {
  const supabase = createClient()

  // Get feature ID
  const { data: feature } = await supabase
    .from('features')
    .select('id')
    .eq('name', featureName)
    .single()

  if (!feature) return

  // Upsert usage record
  await supabase
    .from('feature_usage')
    .upsert(
      {
        feature_id: feature.id,
        user_id: userId,
        usage_count: 1,
        last_used_at: new Date().toISOString(),
      },
      {
        onConflict: 'feature_id,user_id',
      }
    )

  // Increment usage count
  await supabase.rpc('increment_feature_usage', {
    p_feature_id: feature.id,
    p_user_id: userId,
  })
}

/**
 * Get feature usage analytics
 * 
 * @param scope - 'platform' | 'broker' | 'office'
 * @param scopeId - ID of the scope (broker_id or office_id)
 * @returns Feature usage statistics
 */
export async function getFeatureAnalytics(
  scope: 'platform' | 'broker' | 'office',
  scopeId?: string
) {
  const supabase = createClient()

  let query = supabase
    .from('feature_usage')
    .select(`
      feature_id,
      features!inner(name, display_name, category),
      usage_count,
      last_used_at
    `)

  // Filter by scope if needed
  if (scope === 'broker' && scopeId) {
    query = query.eq('profiles.broker_id', scopeId)
  } else if (scope === 'office' && scopeId) {
    query = query.eq('profiles.office_id', scopeId)
  }

  const { data } = await query

  return data || []
}

/**
 * Admin function to toggle feature at platform level
 * 
 * @param featureName - The feature to toggle
 * @param enabled - Whether to enable or disable
 * @param adminId - ID of the admin making the change
 */
export async function setPlatformFeatureToggle(
  featureName: string,
  enabled: boolean,
  adminId: string
): Promise<void> {
  const supabase = createClient()

  // Get feature ID
  const { data: feature } = await supabase
    .from('features')
    .select('id')
    .eq('name', featureName)
    .single()

  if (!feature) return

  // Update platform toggle
  await supabase
    .from('platform_feature_toggles')
    .upsert({
      feature_id: feature.id,
      is_enabled: enabled,
      updated_by: adminId,
      updated_at: new Date().toISOString(),
    })
}

/**
 * Broker admin function to toggle feature for broker
 * 
 * @param brokerId - The broker ID
 * @param featureName - The feature to toggle
 * @param enabled - Whether to enable or disable
 * @param adminId - ID of the admin making the change
 */
export async function setBrokerFeatureToggle(
  brokerId: string,
  featureName: string,
  enabled: boolean,
  adminId: string
): Promise<void> {
  const supabase = createClient()

  // Get feature ID
  const { data: feature } = await supabase
    .from('features')
    .select('id')
    .eq('name', featureName)
    .single()

  if (!feature) return

  // Update broker toggle
  await supabase
    .from('broker_feature_toggles')
    .upsert({
      broker_id: brokerId,
      feature_id: feature.id,
      is_enabled: enabled,
      updated_by: adminId,
      updated_at: new Date().toISOString(),
    })
}

/**
 * Office manager function to toggle feature for office
 * 
 * @param officeId - The office ID
 * @param featureName - The feature to toggle
 * @param enabled - Whether to enable or disable
 * @param adminId - ID of the admin making the change
 */
export async function setOfficeFeatureToggle(
  officeId: string,
  featureName: string,
  enabled: boolean,
  adminId: string
): Promise<void> {
  const supabase = createClient()

  // Get feature ID
  const { data: feature } = await supabase
    .from('features')
    .select('id')
    .eq('name', featureName)
    .single()

  if (!feature) return

  // Update office toggle
  await supabase
    .from('office_feature_toggles')
    .upsert({
      office_id: officeId,
      feature_id: feature.id,
      is_enabled: enabled,
      updated_by: adminId,
      updated_at: new Date().toISOString(),
    })
}

/**
 * Realtor function to toggle feature for themselves
 * 
 * @param realtorId - The realtor ID
 * @param featureName - The feature to toggle
 * @param enabled - Whether to enable or disable
 */
export async function setRealtorFeatureToggle(
  realtorId: string,
  featureName: string,
  enabled: boolean
): Promise<void> {
  const supabase = createClient()

  // Get feature ID
  const { data: feature } = await supabase
    .from('features')
    .select('id')
    .eq('name', featureName)
    .single()

  if (!feature) return

  // Update realtor toggle
  await supabase
    .from('realtor_feature_toggles')
    .upsert({
      realtor_id: realtorId,
      feature_id: feature.id,
      is_enabled: enabled,
      updated_at: new Date().toISOString(),
    })
}
