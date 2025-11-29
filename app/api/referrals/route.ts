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
    let query = supabase.from('referrals').select('*').order('created_at', { ascending: false })

    if (agentId) query = query.eq('agent_id', agentId)
    if (status) query = query.eq('status', status)
    if (type) query = query.eq('type', type)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ referrals: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      agent_id, referred_by, referred_to, type, client_name, client_email,
      client_phone, property_type, budget_range, notes, commission_split
    } = body

    const { data, error } = await supabase
      .from('referrals')
      .insert({
        agent_id,
        referred_by,
        referred_to,
        type: type || 'buyer',
        client_name,
        client_email,
        client_phone,
        property_type,
        budget_range,
        notes,
        commission_split,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, referral: data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('referrals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, referral: data })
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
    const { error } = await supabase.from('referrals').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
