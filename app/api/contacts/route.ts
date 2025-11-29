import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Contact types
const CONTACT_TYPES = [
  'inspector', 'appraiser', 'mortgage_lender', 'title_company', 'insurance_agent',
  'contractor', 'handyman', 'electrician', 'plumber', 'hvac', 'roofer', 'landscaper',
  'moving_company', 'attorney', 'cpa', 'financial_advisor', 'home_warranty',
  'pest_control', 'pool_service', 'cleaning_service', 'staging', 'photographer',
  'personal', 'family', 'friend', 'other'
]

// GET - Fetch contacts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ownerId = searchParams.get('owner_id')
  const ownerType = searchParams.get('owner_type') // 'customer', 'agent'
  const contactType = searchParams.get('type')
  const isVendor = searchParams.get('is_vendor')
  const isPreferred = searchParams.get('is_preferred')
  const includeShared = searchParams.get('include_shared') === 'true'

  try {
    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (ownerId && !includeShared) {
      query = query.eq('owner_id', ownerId)
    }
    
    if (ownerType) query = query.eq('owner_type', ownerType)
    if (contactType) query = query.eq('contact_type', contactType)
    if (isVendor === 'true') query = query.eq('is_vendor', true)
    if (isPreferred === 'true') query = query.eq('is_preferred', true)

    // If including shared, get public vendor listings too
    if (includeShared) {
      query = query.or(`owner_id.eq.${ownerId},visibility.eq.public`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ 
      contacts: data || [],
      contact_types: CONTACT_TYPES
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST - Create contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      owner_id,
      owner_type, // 'customer' or 'agent'
      // Contact info
      name,
      company,
      email,
      phone,
      address,
      website,
      // Classification
      contact_type,
      is_vendor,
      is_preferred,
      // Visibility controls
      visibility, // 'private', 'shared_with_agent', 'shared_with_customer', 'public'
      added_by, // ID of who added
      added_by_type, // 'customer' or 'agent'
      // Vendor specific
      license_number,
      insurance_verified,
      rating,
      notes,
      tags,
      // MLS/Integration
      mls_id,
      external_id,
    } = body

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        owner_id,
        owner_type,
        name,
        company,
        email,
        phone,
        address,
        website,
        contact_type,
        is_vendor: is_vendor || false,
        is_preferred: is_preferred || false,
        visibility: visibility || 'private',
        added_by,
        added_by_type,
        license_number,
        insurance_verified,
        rating,
        notes,
        tags: tags || [],
        mls_id,
        external_id,
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

// PATCH - Update contact
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

// DELETE
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  try {
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
