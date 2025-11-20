import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, property_id } = body

    const supabase = createClient()

    // Get property details to assign lead to property's realtor
    let assigned_to = null
    if (property_id) {
      const { data: property } = await supabase
        .from('properties')
        .select('realtor_id')
        .eq('id', property_id)
        .single()
      
      if (property) {
        assigned_to = property.realtor_id
      }
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        phone,
        message,
        property_id,
        assigned_to,
        status: 'new',
        source: 'website'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}