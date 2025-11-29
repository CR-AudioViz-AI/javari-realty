import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Get walkthrough feedback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customer_id')
  const propertyId = searchParams.get('property_id')
  const agentId = searchParams.get('agent_id')

  try {
    let query = supabase
      .from('walkthrough_feedback')
      .select(`
        *,
        properties (id, address, city, state, price, photos),
        customers (id, full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (customerId) query = query.eq('customer_id', customerId)
    if (propertyId) query = query.eq('property_id', propertyId)
    if (agentId) query = query.eq('agent_id', agentId)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ feedback: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST - Submit walkthrough feedback with photos and ratings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      property_id,
      customer_id,
      agent_id,
      showing_id,
      // Ratings (1-5 scale)
      overall_rating,
      location_rating,
      condition_rating,
      value_rating,
      layout_rating,
      // Comments
      overall_comments,
      likes,
      dislikes,
      questions,
      // Photos with captions
      photos,
      // Would they make an offer?
      interest_level, // 'not_interested', 'maybe', 'interested', 'very_interested', 'ready_to_offer'
      would_revisit,
      // Comparison rank (1 = best)
      rank_position,
      rank_notes,
    } = body

    // Insert main feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('walkthrough_feedback')
      .insert({
        property_id,
        customer_id,
        agent_id,
        showing_id,
        overall_rating,
        location_rating,
        condition_rating,
        value_rating,
        layout_rating,
        overall_comments,
        likes,
        dislikes,
        questions,
        interest_level,
        would_revisit,
        rank_position,
        rank_notes,
        status: 'submitted',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (feedbackError) throw feedbackError

    // Insert photos if provided
    if (photos && photos.length > 0) {
      const photoRecords = photos.map((photo: { url: string; caption?: string; room?: string; issue?: boolean }) => ({
        walkthrough_feedback_id: feedback.id,
        property_id,
        customer_id,
        photo_url: photo.url,
        caption: photo.caption,
        room: photo.room,
        is_issue: photo.issue || false,
        created_at: new Date().toISOString()
      }))

      await supabase.from('walkthrough_photos').insert(photoRecords)
    }

    // Notify agent of new feedback
    if (agent_id) {
      const { data: agentData } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', agent_id)
        .single()

      const { data: customerData } = await supabase
        .from('customers')
        .select('full_name')
        .eq('id', customer_id)
        .single()

      const { data: propertyData } = await supabase
        .from('properties')
        .select('address')
        .eq('id', property_id)
        .single()

      // Create notification record
      await supabase.from('agent_notifications').insert({
        agent_id,
        type: 'walkthrough_feedback',
        title: 'New Walkthrough Feedback',
        message: `${(customerData as { full_name: string } | null)?.full_name || 'Customer'} rated ${(propertyData as { address: string } | null)?.address || 'property'}: ${overall_rating}/5 stars`,
        data: {
          feedback_id: feedback.id,
          property_id,
          customer_id,
          rating: overall_rating,
          interest_level
        },
        read: false,
        created_at: new Date().toISOString()
      })
    }

    // Update showing request if linked
    if (showing_id) {
      await supabase
        .from('showing_requests')
        .update({ 
          feedback_id: feedback.id,
          rating: overall_rating,
          status: 'completed'
        })
        .eq('id', showing_id)
    }

    return NextResponse.json({ success: true, feedback })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH - Update rankings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, rankings } = body

    // rankings = [{ feedback_id, rank_position, rank_notes }]
    
    for (const ranking of rankings) {
      await supabase
        .from('walkthrough_feedback')
        .update({ 
          rank_position: ranking.rank_position,
          rank_notes: ranking.rank_notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', ranking.feedback_id)
        .eq('customer_id', customer_id)
    }

    // Notify agent of ranking update
    const { data: customer } = await supabase
      .from('customers')
      .select('assigned_agent_id, full_name')
      .eq('id', customer_id)
      .single()

    if (customer) {
      const cust = customer as { assigned_agent_id: string; full_name: string }
      await supabase.from('agent_notifications').insert({
        agent_id: cust.assigned_agent_id,
        type: 'rankings_updated',
        title: 'Property Rankings Updated',
        message: `${cust.full_name} has updated their property rankings`,
        data: { customer_id, rankings_count: rankings.length },
        read: false,
        created_at: new Date().toISOString()
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
