// app/api/leads/capture/route.ts
// Lead Capture API - Routes leads to agents based on specialty

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {}
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {}
        },
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    
    const { 
      propertyId, 
      name, 
      email, 
      phone, 
      message, 
      preferredContact,
      interestType 
    } = body

    // Get property details to route lead correctly
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    // Determine which agent to route to
    let assignedRealtorId = null
    
    // 1. If property has assigned realtor, route there
    if (property?.realtor_id) {
      assignedRealtorId = property.realtor_id
    } 
    // 2. Otherwise match by social impact specialty
    else if (property?.social_impact_type) {
      const { data: matchingAgent } = await supabase
        .from('profiles')
        .select('id')
        .contains('specialties', [property.social_impact_type])
        .eq('role', 'realtor')
        .limit(1)
        .single()
      
      if (matchingAgent) {
        assignedRealtorId = matchingAgent.id
      }
    }

    // Create lead record
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        phone,
        message,
        property_id: propertyId,
        realtor_id: assignedRealtorId,
        status: 'new',
        source: 'homefinder',
        preferred_contact: preferredContact || 'email',
        interest_type: interestType || 'viewing',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Lead creation error:', error)
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
    }

    // TODO: Send email notification to assigned agent
    // await sendAgentNotification(assignedRealtorId, lead, property)
    
    // TODO: Send confirmation email to lead
    // await sendLeadConfirmation(email, name, property)

    return NextResponse.json({ 
      success: true, 
      leadId: lead?.id,
      message: 'Thank you! An agent will contact you within 2 hours.'
    })

  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
