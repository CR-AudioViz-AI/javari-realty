import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    // Verify admin user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError }: { data: any; error: any } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Profile error' }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // TypeScript type assertion - we've confirmed profile exists above
    

    if (profile!.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all features with their platform toggle status
    const { data: features, error } = await supabase
      .from('features')
      .select(`
        id,
        name,
        display_name,
        description,
        category,
        is_social_impact,
        social_impact_type,
        platform_feature_toggles!inner(is_enabled)
      `)
      .order('category')
      .order('display_name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data to flatten the toggle status
    const transformedFeatures = (features || []).map((feature: any) => ({
      id: feature.id,
      name: feature.name,
      display_name: feature.display_name,
      description: feature.description,
      category: feature.category,
      is_social_impact: feature.is_social_impact,
      social_impact_type: feature.social_impact_type,
      is_enabled: feature.platform_feature_toggles.is_enabled,
    }))

    return NextResponse.json({ features: transformedFeatures })
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
