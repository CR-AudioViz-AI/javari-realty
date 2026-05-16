import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent_id')
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  try {
    let query = supabase.from('advertisements').select('*').order('created_at', { ascending: false })

    if (agentId) query = query.eq('agent_id', agentId)
    if (status) query = query.eq('status', status)
    if (type) query = query.eq('type', type)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ advertisements: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      agent_id, type, title, description, image_url, link_url,
      target_audience, budget, start_date, end_date, properties
    } = body

    const { data, error } = await supabase
      .from('advertisements')
      .insert({
        agent_id,
        type: type || 'banner',
        title,
        description,
        image_url,
        link_url,
        target_audience: target_audience || {},
        budget: budget || 0,
        start_date,
        end_date,
        properties: properties || [],
        status: 'draft',
        impressions: 0,
        clicks: 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, advertisement: data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updates } = body

    if (action === 'track_impression') {
      const { error } = await supabase.rpc('increment_ad_impressions', { ad_id: id })
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (action === 'track_click') {
      const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: id })
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    const { data, error } = await supabase
      .from('advertisements')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, advertisement: data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  try {
    const { error } = await supabase.from('advertisements').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
