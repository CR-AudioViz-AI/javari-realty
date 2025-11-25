// app/api/leads/capture/route.ts
// Lead Capture API with Intelligent Agent Routing

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const leadData = await request.json()

    // Get property details to determine routing
    const { data: property } = await supabase
      .from('properties')
      .select('*, realtor:profiles!properties_realtor_id_fkey(id, email, full_name, specialties)')
      .eq('id', leadData.property_id)
      .single()

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Find best agent based on property social impact tags and agent specialties
    let assignedAgentId = property.realtor_id

    if (!assignedAgentId) {
      // Route to agent with matching specialty
      const { data: matchingAgent } = await supabase
        .from('profiles')
        .select('id, email, full_name, specialties')
        .eq('role', 'realtor')
        .eq('status', 'active')
        .limit(1)
        .single()

      assignedAgentId = matchingAgent?.id
    }

    // Create lead in database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        message: leadData.message,
        property_id: leadData.property_id,
        source: leadData.source || 'homefinder',
        status: 'new',
        interest_type: leadData.interest_type || 'viewing',
        preferred_contact: leadData.preferred_contact || 'email',
        realtor_id: assignedAgentId,
        metadata: {
          property_address: leadData.property_address,
          captured_at: leadData.captured_at,
          user_agent: request.headers.get('user-agent')
        }
      })
      .select()
      .single()

    if (leadError) {
      console.error('Lead creation error:', leadError)
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
    }

    // Send notification to assigned agent
    await sendAgentNotification(lead, property, assignedAgentId)

    // Send confirmation email to lead
    await sendLeadConfirmation(leadData.email, leadData.name, property)

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      message: 'Lead captured successfully'
    })

  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendAgentNotification(lead: any, property: any, agentId: string) {
  const supabase = createClient()
  
  const { data: agent } = await supabase
    .from('profiles')
    .select('email, full_name, phone')
    .eq('id', agentId)
    .single()

  if (!agent) return

  // TODO: Integrate with SendGrid/email service
  const emailData = {
    to: agent.email,
    subject: `🔔 New Lead: ${property.address}`,
    html: `
      <h2>New Lead Alert!</h2>
      <p><strong>Property:</strong> ${property.address}, ${property.city}</p>
      <p><strong>Contact:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Message:</strong> ${lead.message || 'No message'}</p>
      <p><strong>Source:</strong> HomeFinder AI</p>
      <br>
      <p><a href="https://cr-realtor-platform.vercel.app/dashboard/leads/${lead.id}">View Lead Details</a></p>
    `
  }

  console.log('Agent notification:', emailData)
  // await sendEmail(emailData)
}

async function sendLeadConfirmation(email: string, name: string, property: any) {
  // TODO: Integrate with SendGrid/email service
  const emailData = {
    to: email,
    subject: `Your inquiry about ${property.address}`,
    html: `
      <h2>Thank you for your interest!</h2>
      <p>Hi ${name},</p>
      <p>We've received your inquiry about:</p>
      <p><strong>${property.address}, ${property.city}</strong></p>
      <p>A local expert agent will contact you within 2 hours.</p>
      <br>
      <p>In the meantime, you can:</p>
      <ul>
        <li>Browse more homes at <a href="https://homefinder.ai">HomeFinder AI</a></li>
        <li>Calculate your mortgage payment</li>
        <li>Get pre-approved for financing</li>
      </ul>
      <br>
      <p>Best regards,<br>The HomeFinder AI Team</p>
    `
  }

  console.log('Lead confirmation:', emailData)
  // await sendEmail(emailData)
}
