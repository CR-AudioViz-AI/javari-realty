import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Activity {
  id: string
  type: string
  description: string
  property_id?: string
  property_address?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customer_id')
  const agentId = searchParams.get('agent_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    const activities: Activity[] = []

    if (customerId) {
      // Get saved properties
      const { data: saved } = await supabase
        .from('saved_properties')
        .select('*, properties(address, city, price)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (saved) {
        for (const s of saved) {
          const props = s.properties as { address?: string; city?: string; price?: number } | null
          activities.push({
            id: `saved-${s.id}`,
            type: 'saved_property',
            description: `Saved property: ${props?.address || 'Unknown'}`,
            property_id: s.property_id,
            property_address: props?.address,
            metadata: { price: props?.price, city: props?.city },
            created_at: s.created_at
          })
        }
      }

      // Get showing requests
      const { data: showings } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (showings) {
        for (const s of showings) {
          activities.push({
            id: `showing-${s.id}`,
            type: 'showing_request',
            description: `Requested showing: ${s.property_address}`,
            property_id: s.property_id,
            property_address: s.property_address,
            metadata: { status: s.status, requested_date: s.requested_date },
            created_at: s.created_at
          })
        }
      }

      // Get messages
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_type', 'customer')
        .eq('sender_id', customerId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (messages) {
        for (const m of messages) {
          const content = String(m.content || '')
          const preview = content.length > 50 ? content.substring(0, 50) + '...' : content
          activities.push({
            id: `msg-${m.id}`,
            type: 'message_sent',
            description: `Sent message: "${preview}"`,
            metadata: { conversation_id: m.conversation_id },
            created_at: m.created_at
          })
        }
      }

      // Get property views
      const { data: views } = await supabase
        .from('property_views')
        .select('*, properties(address)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(30)

      if (views) {
        for (const v of views) {
          const props = v.properties as { address?: string } | null
          activities.push({
            id: `view-${v.id}`,
            type: 'property_view',
            description: `Viewed property: ${props?.address || 'Unknown'}`,
            property_id: v.property_id,
            property_address: props?.address,
            metadata: { action: v.action },
            created_at: v.created_at
          })
        }
      }

      // Get walkthrough feedback
      const { data: feedback } = await supabase
        .from('walkthrough_feedback')
        .select('*, properties(address)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (feedback) {
        for (const f of feedback) {
          const props = f.properties as { address?: string } | null
          activities.push({
            id: `feedback-${f.id}`,
            type: 'walkthrough_feedback',
            description: `Rated walkthrough: ${props?.address || 'Unknown'} (${f.overall_rating}/5 stars)`,
            property_id: f.property_id,
            property_address: props?.address,
            metadata: { rating: f.overall_rating },
            created_at: f.created_at
          })
        }
      }

    } else if (agentId) {
      // Get agent's assigned customers
      const { data: customers } = await supabase
        .from('customers')
        .select('id, full_name')
        .eq('assigned_agent_id', agentId)

      const customerIds: string[] = []
      const customerNames: Record<string, string> = {}
      
      if (customers) {
        for (const c of customers) {
          customerIds.push(c.id)
          customerNames[c.id] = c.full_name
        }
      }

      if (customerIds.length > 0) {
        // Get recent showings
        const { data: showings } = await supabase
          .from('showing_requests')
          .select('*')
          .in('customer_id', customerIds)
          .order('created_at', { ascending: false })
          .limit(30)

        if (showings) {
          for (const s of showings) {
            activities.push({
              id: `showing-${s.id}`,
              type: 'showing_request',
              description: `${customerNames[s.customer_id] || 'Customer'} requested showing: ${s.property_address}`,
              property_address: s.property_address,
              metadata: { customer_id: s.customer_id, customer_name: customerNames[s.customer_id], status: s.status },
              created_at: s.created_at
            })
          }
        }

        // Get recent saves
        const { data: saved } = await supabase
          .from('saved_properties')
          .select('*, properties(address, price)')
          .in('customer_id', customerIds)
          .order('created_at', { ascending: false })
          .limit(30)

        if (saved) {
          for (const s of saved) {
            const props = s.properties as { address?: string; price?: number } | null
            activities.push({
              id: `saved-${s.id}`,
              type: 'saved_property',
              description: `${customerNames[s.customer_id] || 'Customer'} saved: ${props?.address || 'Unknown'}`,
              property_address: props?.address,
              metadata: { customer_id: s.customer_id, customer_name: customerNames[s.customer_id], price: props?.price },
              created_at: s.created_at
            })
          }
        }

        // Get recent feedback
        const { data: feedback } = await supabase
          .from('walkthrough_feedback')
          .select('*, properties(address)')
          .in('customer_id', customerIds)
          .order('created_at', { ascending: false })
          .limit(30)

        if (feedback) {
          for (const f of feedback) {
            const props = f.properties as { address?: string } | null
            activities.push({
              id: `feedback-${f.id}`,
              type: 'walkthrough_feedback',
              description: `${customerNames[f.customer_id] || 'Customer'} rated: ${props?.address || 'Unknown'} (${f.overall_rating}/5)`,
              property_address: props?.address,
              metadata: { customer_id: f.customer_id, customer_name: customerNames[f.customer_id], rating: f.overall_rating },
              created_at: f.created_at
            })
          }
        }
      }
    }

    // Sort by date
    activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ 
      activities: activities.slice(0, limit),
      total: activities.length
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
