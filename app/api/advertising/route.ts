import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Ad placement locations
const AD_PLACEMENTS = [
  { id: 'homepage_hero', name: 'Homepage Hero Banner', type: 'premium', price: 500 },
  { id: 'homepage_sidebar', name: 'Homepage Sidebar', type: 'standard', price: 200 },
  { id: 'search_results_top', name: 'Search Results Top', type: 'premium', price: 400 },
  { id: 'search_results_sidebar', name: 'Search Results Sidebar', type: 'standard', price: 150 },
  { id: 'property_detail_sidebar', name: 'Property Detail Sidebar', type: 'premium', price: 300 },
  { id: 'property_detail_footer', name: 'Property Detail Footer', type: 'standard', price: 100 },
  { id: 'customer_dashboard', name: 'Customer Dashboard', type: 'standard', price: 150 },
  { id: 'agent_dashboard', name: 'Agent Dashboard', type: 'standard', price: 150 },
  { id: 'email_newsletter', name: 'Email Newsletter', type: 'premium', price: 250 },
  { id: 'mobile_app_banner', name: 'Mobile App Banner', type: 'premium', price: 350 },
  { id: 'vendor_directory_featured', name: 'Vendor Directory Featured', type: 'premium', price: 200 },
  { id: 'neighborhood_guide', name: 'Neighborhood Guide Sponsor', type: 'premium', price: 300 },
]

// GET - Fetch ads or placements
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const placement = searchParams.get('placement')
  const advertiserId = searchParams.get('advertiser_id')
  const activeOnly = searchParams.get('active') === 'true'
  const getPlacementsOnly = searchParams.get('placements') === 'true'

  try {
    if (getPlacementsOnly) {
      return NextResponse.json({ placements: AD_PLACEMENTS })
    }

    let query = supabase
      .from('advertisements')
      .select(`
        *,
        advertiser:advertisers (id, company_name, contact_name, email, tier)
      `)
      .order('priority', { ascending: false })

    if (placement) query = query.eq('placement', placement)
    if (advertiserId) query = query.eq('advertiser_id', advertiserId)
    if (activeOnly) {
      const now = new Date().toISOString()
      query = query.eq('status', 'active').lte('start_date', now).gte('end_date', now)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ advertisements: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST - Create advertisement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'create_advertiser') {
      // Create advertiser account
      const {
        company_name,
        contact_name,
        email,
        phone,
        address,
        website,
        tier, // 'basic', 'premium', 'enterprise'
        billing_info,
      } = body

      const { data, error } = await supabase
        .from('advertisers')
        .insert({
          company_name,
          contact_name,
          email,
          phone,
          address,
          website,
          tier: tier || 'basic',
          billing_info,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, advertiser: data })

    } else {
      // Create advertisement
      const {
        advertiser_id,
        placement,
        // Creative
        title,
        description,
        image_url,
        video_url,
        cta_text,
        cta_url,
        // Targeting
        target_cities,
        target_property_types,
        target_price_range,
        target_user_types, // 'customer', 'agent', 'all'
        // Schedule
        start_date,
        end_date,
        // Budget
        budget_total,
        budget_daily,
        cost_per_impression,
        cost_per_click,
        // Priority (paid advertisers get bonus)
        priority,
        // Bonus placements for paid advertisers
        bonus_placements,
      } = body

      // Get advertiser tier for bonus calculation
      const { data: advertiser } = await supabase
        .from('advertisers')
        .select('tier')
        .eq('id', advertiser_id)
        .single()

      // Calculate bonus placements based on tier
      let calculatedBonusPlacements: string[] = []
      if (advertiser) {
        const adv = advertiser as { tier: string }
        if (adv.tier === 'premium') {
          calculatedBonusPlacements = ['homepage_sidebar', 'search_results_sidebar']
        } else if (adv.tier === 'enterprise') {
          calculatedBonusPlacements = ['homepage_sidebar', 'search_results_sidebar', 'email_newsletter', 'mobile_app_banner']
        }
      }

      const { data, error } = await supabase
        .from('advertisements')
        .insert({
          advertiser_id,
          placement,
          title,
          description,
          image_url,
          video_url,
          cta_text,
          cta_url,
          target_cities: target_cities || [],
          target_property_types: target_property_types || [],
          target_price_range,
          target_user_types: target_user_types || ['all'],
          start_date,
          end_date,
          budget_total,
          budget_daily,
          cost_per_impression,
          cost_per_click,
          priority: priority || 1,
          bonus_placements: bonus_placements || calculatedBonusPlacements,
          impressions: 0,
          clicks: 0,
          status: 'pending_review',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, advertisement: data })
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH - Track impressions/clicks or update ad
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updates } = body

    if (action === 'impression') {
      // Track impression
      await supabase.rpc('increment_ad_impressions', { ad_id: id })
      
      // Log impression
      await supabase.from('ad_events').insert({
        advertisement_id: id,
        event_type: 'impression',
        user_id: updates.user_id,
        user_type: updates.user_type,
        placement: updates.placement,
        created_at: new Date().toISOString()
      })

      return NextResponse.json({ success: true })

    } else if (action === 'click') {
      // Track click
      await supabase.rpc('increment_ad_clicks', { ad_id: id })
      
      // Log click
      await supabase.from('ad_events').insert({
        advertisement_id: id,
        event_type: 'click',
        user_id: updates.user_id,
        user_type: updates.user_type,
        placement: updates.placement,
        created_at: new Date().toISOString()
      })

      return NextResponse.json({ success: true })

    } else {
      // Regular update
      const { data, error } = await supabase
        .from('advertisements')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, advertisement: data })
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
