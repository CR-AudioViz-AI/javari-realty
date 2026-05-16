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
  const customerId = searchParams.get('customer_id')
  const type = searchParams.get('type')

  try {
    let query = supabase.from('contacts').select('*').order('created_at', { ascending: false })

    if (agentId) query = query.eq('agent_id', agentId)
    if (customerId) query = query.eq('customer_id', customerId)
    if (type) query = query.eq('type', type)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ contacts: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_id, customer_id, type, name, email, phone, company, notes, tags } = body

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        agent_id,
        customer_id,
        type: type || 'general',
        name,
        email,
        phone,
        company,
        notes,
        tags: tags || [],
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, contact: data })
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
      .from('contacts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, contact: data })
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
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
