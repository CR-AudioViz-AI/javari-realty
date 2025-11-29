import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch referral agreements
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent_id')
  const vendorId = searchParams.get('vendor_id')
  const status = searchParams.get('status')

  try {
    let query = supabase
      .from('referral_agreements')
      .select(`
        *,
        agent:profiles!referral_agreements_agent_id_fkey (id, full_name, email),
        vendor:contacts!referral_agreements_vendor_id_fkey (id, name, company, contact_type)
      `)
      .order('created_at', { ascending: false })

    if (agentId) query = query.eq('agent_id', agentId)
    if (vendorId) query = query.eq('vendor_id', vendorId)
    if (status) query = query.eq('status', status)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ agreements: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST - Create referral agreement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      agent_id,
      vendor_id,
      // Agreement terms
      referral_type, // 'per_referral', 'percentage', 'flat_fee', 'reciprocal'
      referral_amount, // Dollar amount or percentage
      referral_percentage,
      // Conditions
      min_transaction_value,
      max_referrals_per_month,
      exclusivity, // 'exclusive', 'non_exclusive'
      territory, // Geographic area
      // Duration
      start_date,
      end_date,
      auto_renew,
      // Terms
      terms_text,
      special_conditions,
      // Signatures
      agent_signature,
      agent_signed_at,
      vendor_signature,
      vendor_signed_at,
    } = body

    // Determine status based on signatures
    let status = 'draft'
    if (agent_signature && !vendor_signature) status = 'pending_vendor'
    if (!agent_signature && vendor_signature) status = 'pending_agent'
    if (agent_signature && vendor_signature) status = 'active'

    const { data, error } = await supabase
      .from('referral_agreements')
      .insert({
        agent_id,
        vendor_id,
        referral_type,
        referral_amount,
        referral_percentage,
        min_transaction_value,
        max_referrals_per_month,
        exclusivity: exclusivity || 'non_exclusive',
        territory,
        start_date,
        end_date,
        auto_renew: auto_renew || false,
        terms_text,
        special_conditions,
        agent_signature,
        agent_signed_at,
        vendor_signature,
        vendor_signed_at,
        status,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Notify vendor if agent signed
    if (agent_signature && !vendor_signature) {
      // Send notification to vendor
    }

    return NextResponse.json({ success: true, agreement: data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH - Update/Sign agreement
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updates } = body

    if (action === 'agent_sign') {
      // Agent signing
      const { data: existing } = await supabase
        .from('referral_agreements')
        .select('vendor_signature')
        .eq('id', id)
        .single()

      const newStatus = existing?.vendor_signature ? 'active' : 'pending_vendor'

      const { data, error } = await supabase
        .from('referral_agreements')
        .update({
          agent_signature: updates.signature,
          agent_signed_at: new Date().toISOString(),
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, agreement: data })

    } else if (action === 'vendor_sign') {
      // Vendor signing
      const { data: existing } = await supabase
        .from('referral_agreements')
        .select('agent_signature')
        .eq('id', id)
        .single()

      const newStatus = existing?.agent_signature ? 'active' : 'pending_agent'

      const { data, error } = await supabase
        .from('referral_agreements')
        .update({
          vendor_signature: updates.signature,
          vendor_signed_at: new Date().toISOString(),
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, agreement: data })

    } else {
      // Regular update
      const { data, error } = await supabase
        .from('referral_agreements')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, agreement: data })
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
