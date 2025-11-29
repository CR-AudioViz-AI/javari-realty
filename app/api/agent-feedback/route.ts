import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Get agent evaluations (visible to ALL agents using the system)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('property_id')
  const agentId = searchParams.get('agent_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    let query = supabase
      .from('agent_property_evaluations')
      .select(`
        *,
        properties (id, address, city, state, price, photos),
        agent:profiles!agent_property_evaluations_agent_id_fkey (id, full_name, avatar_url, license_number)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (propertyId) query = query.eq('property_id', propertyId)
    if (agentId) query = query.eq('agent_id', agentId)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ evaluations: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST - Create agent evaluation (with photos/videos)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      property_id,
      agent_id,
      showing_id,
      // Ratings
      overall_rating,
      condition_rating,
      pricing_rating,
      location_rating,
      investment_potential,
      // Comments
      overall_notes,
      condition_notes,
      pricing_analysis,
      neighborhood_notes,
      showing_experience,
      seller_motivation,
      recommended_for, // 'first_time_buyer', 'investor', 'family', 'retiree', etc.
      potential_issues,
      negotiation_notes,
      // Media
      photos, // Array of { url, caption, room, is_issue }
      videos, // Array of { url, title, duration }
      // Visibility
      share_with_customer, // Share this evaluation with customer
      internal_only, // Only for agent's personal notes
    } = body

    // Insert evaluation
    const { data: evaluation, error: evalError } = await supabase
      .from('agent_property_evaluations')
      .insert({
        property_id,
        agent_id,
        showing_id,
        overall_rating,
        condition_rating,
        pricing_rating,
        location_rating,
        investment_potential,
        overall_notes,
        condition_notes,
        pricing_analysis,
        neighborhood_notes,
        showing_experience,
        seller_motivation,
        recommended_for,
        potential_issues,
        negotiation_notes,
        share_with_customer: share_with_customer || false,
        internal_only: internal_only || false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (evalError) throw evalError

    // Insert photos
    if (photos && photos.length > 0) {
      const photoRecords = photos.map((photo: { url: string; caption?: string; room?: string; is_issue?: boolean }) => ({
        evaluation_id: evaluation.id,
        property_id,
        agent_id,
        media_type: 'photo',
        url: photo.url,
        caption: photo.caption,
        room: photo.room,
        is_issue: photo.is_issue || false,
        created_at: new Date().toISOString()
      }))

      await supabase.from('agent_evaluation_media').insert(photoRecords)
    }

    // Insert videos
    if (videos && videos.length > 0) {
      const videoRecords = videos.map((video: { url: string; title?: string; duration?: number }) => ({
        evaluation_id: evaluation.id,
        property_id,
        agent_id,
        media_type: 'video',
        url: video.url,
        title: video.title,
        duration: video.duration,
        created_at: new Date().toISOString()
      }))

      await supabase.from('agent_evaluation_media').insert(videoRecords)
    }

    // Notify other agents about new evaluation (optional feature)
    // This makes evaluations visible to all agents using the system

    return NextResponse.json({ success: true, evaluation })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH - Update evaluation
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, agent_id, ...updates } = body

    // Verify ownership
    const { data: existing } = await supabase
      .from('agent_property_evaluations')
      .select('agent_id')
      .eq('id', id)
      .single()

    if (!existing || existing.agent_id !== agent_id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('agent_property_evaluations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, evaluation: data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
