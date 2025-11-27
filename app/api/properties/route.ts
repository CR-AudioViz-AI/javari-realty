import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const transactionType = searchParams.get('transaction_type')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const bedrooms = searchParams.get('bedrooms')
    const featured = searchParams.get('featured')

    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (transactionType) query = query.eq('transaction_type', transactionType)
    if (city) query = query.ilike('city', `%${city}%`)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))
    if (bedrooms) query = query.gte('bedrooms', parseInt(bedrooms))
    if (featured === 'true') query = query.eq('featured', true)

    const { data: properties, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ properties: properties || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const propertyData = {
      ...body,
      listing_agent_id: user.id,
      status: body.status || 'active',
    }

    const { data, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ property: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
