import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verify admin user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<Pick<Profile, 'role'>>()

    // Combined check: if error OR no profile data, reject
    if (profileError || !profile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // TypeScript now knows profile is non-null and has role property
    if (profile.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    const { featureId, enabled } = body

    if (!featureId || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Update platform feature toggle
    type PlatformFeatureToggleUpdate = Database['public']['Tables']['platform_feature_toggles']['Update']
    
    const updateData: PlatformFeatureToggleUpdate = {
      is_enabled: enabled,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }
    
    // Known Supabase TypeScript strict mode bug: update() method infers parameter as 'never'
    // See: https://github.com/supabase/supabase-js/issues/786
    // Types are validated above by PlatformFeatureToggleUpdate, safe at runtime
    const updateQuery = supabase
      .from('platform_feature_toggles')
      // @ts-ignore - Supabase strict mode bug
      .update(updateData)
      .eq('feature_id', featureId)
    
    const { error: updateError } = await updateQuery

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    // Log the change
    console.log(
      `[FEATURE TOGGLE] User ${user.id} ${enabled ? 'enabled' : 'disabled'} feature ${featureId}`
    )

    return NextResponse.json({
      success: true,
      message: `Feature ${enabled ? 'enabled' : 'disabled'} successfully`,
    })
  } catch (error) {
    console.error('Error toggling feature:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

