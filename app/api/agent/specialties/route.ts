// app/api/agent/specialties/route.ts
// Save Agent Specialties for Lead Routing

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { user_id, specialties } = await request.json()

    // Validate user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update agent profile with specialties
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        specialties,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id)
      .select()
      .single()

    if (error) {
      console.error('Specialties update error:', error)
      return NextResponse.json({ error: 'Failed to update specialties' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      specialties: data.specialties,
      message: 'Specialties updated successfully'
    })

  } catch (error) {
    console.error('Specialties API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('specialties')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      specialties: profile?.specialties || []
    })

  } catch (error) {
    console.error('Get specialties error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
