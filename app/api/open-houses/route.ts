import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

// Helper to get Supabase client
function getDb() { return getAdminClient(); }

export const dynamic = 'force-dynamic'


// GET - List upcoming open houses
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('property_id')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    let query = getDb()
      .from('open_houses')
      .select(`
        *,
        properties (id, address, city, state, zip, price, bedrooms, bathrooms, sqft, photos),
        profiles:host_agent_id (id, full_name, phone, email)
      `)
      .gte('date', new Date().toISOString().split('T')[0])
      .eq('status', 'scheduled')
      .order('date', { ascending: true })
      .limit(limit)

    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ open_houses: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST - Create open house or RSVP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'create') {
      // Create a new open house (agent only)
      const { property_id, date, start_time, end_time, host_agent_id, notes, max_attendees } = body

      const { data, error } = await getDb()
        .from('open_houses')
        .insert({
          property_id,
          date,
          start_time,
          end_time,
          host_agent_id,
          notes,
          max_attendees,
          status: 'scheduled',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, open_house: data })

    } else if (action === 'rsvp') {
      // RSVP for an open house
      const { open_house_id, visitor_name, visitor_email, visitor_phone, party_size, notes } = body

      // Check if already RSVPed
      const { data: existing } = await getDb()
        .from('open_house_rsvps')
        .select('id')
        .eq('open_house_id', open_house_id)
        .eq('visitor_email', visitor_email)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Already registered for this open house' }, { status: 400 })
      }

      // Check capacity
      const { data: openHouse } = await getDb()
        .from('open_houses')
        .select('max_attendees, current_rsvps')
        .eq('id', open_house_id)
        .single()

      const oh = openHouse as { max_attendees?: number; current_rsvps?: number } | null
      if (oh?.max_attendees && (oh.current_rsvps || 0) >= oh.max_attendees) {
        return NextResponse.json({ error: 'This open house is at capacity' }, { status: 400 })
      }

      // Create RSVP
      const { data, error } = await getDb()
        .from('open_house_rsvps')
        .insert({
          open_house_id,
          visitor_name,
          visitor_email,
          visitor_phone,
          party_size: party_size || 1,
          notes,
          status: 'confirmed',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Update RSVP count
      await getDb().rpc('increment_open_house_rsvps', { oh_id: open_house_id, increment_by: party_size || 1 })

      // Create lead from RSVP
      const { data: ohData } = await getDb()
        .from('open_houses')
        .select('property_id, host_agent_id, properties(address)')
        .eq('id', open_house_id)
        .single()

      if (ohData) {
        const props = ohData.properties as unknown as { address: string } | null
        await getDb().from('realtor_leads').insert({
          full_name: visitor_name,
          email: visitor_email,
          phone: visitor_phone,
          source: 'open_house_rsvp',
          status: 'new',
          notes: `Open House RSVP for: ${props?.address || 'Unknown property'}`,
          assigned_to: ohData.host_agent_id,
          created_at: new Date().toISOString()
        })
      }

      return NextResponse.json({ success: true, rsvp: data })

    } else if (action === 'signin') {
      // Walk-in sign-in at open house
      const { open_house_id, visitor_name, visitor_email, visitor_phone, interested_in_property, buyer_type, timeline, notes } = body

      const { data, error } = await getDb()
        .from('open_house_signins')
        .insert({
          open_house_id,
          visitor_name,
          visitor_email,
          visitor_phone,
          interested_in_property: interested_in_property ?? true,
          buyer_type,
          timeline,
          notes,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Create lead from sign-in
      const { data: ohData } = await getDb()
        .from('open_houses')
        .select('property_id, host_agent_id, properties(address)')
        .eq('id', open_house_id)
        .single()

      if (ohData) {
        const props = ohData.properties as unknown as { address: string } | null
        await getDb().from('realtor_leads').insert({
          full_name: visitor_name,
          email: visitor_email,
          phone: visitor_phone,
          source: 'open_house_signin',
          status: 'new',
          buyer_type,
          timeline,
          notes: `Open House Walk-in: ${props?.address || 'Unknown property'}\n${notes || ''}`,
          assigned_to: ohData.host_agent_id,
          created_at: new Date().toISOString()
        })
      }

      return NextResponse.json({ success: true, signin: data })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
