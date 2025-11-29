import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch referral records
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent_id')
  const vendorId = searchParams.get('vendor_id')
  const customerId = searchParams.get('customer_id')
  const propertyId = searchParams.get('property_id')
  const status = searchParams.get('status')

  try {
    let query = supabase
      .from('referral_records')
      .select(`
        *,
        agreement:referral_agreements (id, referral_type, referral_amount, referral_percentage),
        agent:profiles!referral_records_agent_id_fkey (id, full_name),
        vendor:contacts!referral_records_vendor_id_fkey (id, name, company),
        customer:customers!referral_records_customer_id_fkey (id, full_name),
        property:properties!referral_records_property_id_fkey (id, address)
      `)
      .order('created_at', { ascending: false })

    if (agentId) query = query.eq('agent_id', agentId)
    if (vendorId) query = query.eq('vendor_id', vendorId)
    if (customerId) query = query.eq('customer_id', customerId)
    if (propertyId) query = query.eq('property_id', propertyId)
    if (status) query = query.eq('status', status)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ referrals: data || [] })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST - Create referral record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      agreement_id,
      agent_id,
      vendor_id,
      customer_id,
      property_id,
      // Referral details
      service_type,
      service_description,
      estimated_value,
      // Tracking
      referred_at,
      customer_contacted_at,
      service_scheduled_at,
      service_completed_at,
      // Payment
      referral_fee_amount,
      payment_status, // 'pending', 'invoiced', 'paid'
      payment_date,
      invoice_number,
      // Documentation
      notes,
      customer_feedback,
      customer_rating,
    } = body

    const { data, error } = await supabase
      .from('referral_records')
      .insert({
        agreement_id,
        agent_id,
        vendor_id,
        customer_id,
        property_id,
        service_type,
        service_description,
        estimated_value,
        referred_at: referred_at || new Date().toISOString(),
        customer_contacted_at,
        service_scheduled_at,
        service_completed_at,
        referral_fee_amount,
        payment_status: payment_status || 'pending',
        payment_date,
        invoice_number,
        notes,
        customer_feedback,
        customer_rating,
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Notify vendor of new referral
    await supabase.from('vendor_notifications').insert({
      vendor_id,
      type: 'new_referral',
      title: 'New Referral',
      message: `You have a new referral from agent for ${service_type}`,
      data: { referral_id: data.id, customer_id, property_id },
      read: false,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ success: true, referral: data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH - Update referral status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    // If completing service, calculate fee
    if (updates.service_completed_at && !updates.referral_fee_amount) {
      const { data: referral } = await supabase
        .from('referral_records')
        .select('agreement_id, estimated_value')
        .eq('id', id)
        .single()

      if (referral?.agreement_id) {
        const { data: agreement } = await supabase
          .from('referral_agreements')
          .select('referral_type, referral_amount, referral_percentage')
          .eq('id', referral.agreement_id)
          .single()

        if (agreement) {
          const agr = agreement as { referral_type: string; referral_amount?: number; referral_percentage?: number }
          if (agr.referral_type === 'flat_fee') {
            updates.referral_fee_amount = agr.referral_amount
          } else if (agr.referral_type === 'percentage' && referral.estimated_value) {
            updates.referral_fee_amount = (referral.estimated_value * (agr.referral_percentage || 0)) / 100
          }
        }
      }
    }

    const { data, error } = await supabase
      .from('referral_records')
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
