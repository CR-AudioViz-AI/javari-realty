import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const supabase = createClient()
  
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') || ''
  const type = searchParams.get('type') || ''
  const min = parseInt(searchParams.get('min') || '0')
  const max = parseInt(searchParams.get('max') || '10000000')

  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')

  if (location) {
    query = query.or(`city.ilike.%${location}%,state.ilike.%${location}%,zip_code.ilike.%${location}%`)
  }

  if (type && type !== 'any') {
    query = query.eq('property_type', type)
  }

  if (min > 0) query = query.gte('price', min)
  if (max < 10000000) query = query.lte('price', max)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ properties: data })
}