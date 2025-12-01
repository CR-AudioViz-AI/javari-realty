// =====================================================
// CR REALTOR PLATFORM - CUSTOMER MESSAGES API
// Path: app/api/messages/customer/route.ts
// Timestamp: 2025-12-01 4:05 PM EST
// Purpose: Secure messaging between agents and customers
// =====================================================

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Get messages for a customer conversation
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unread_only') === 'true'

    // Determine user type (agent or customer)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    const isAgent = profile?.role === 'agent'

    // Get customer record
    let customerFilter = customerId
    if (!isAgent) {
      // Customer viewing their own messages
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      if (!customer) {
        return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 })
      }
      customerFilter = customer.id
    }

    if (!customerFilter) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    // Build query
    let query = supabase
      .from('customer_messages')
      .select(`
        *,
        properties:property_id (id, address, city)
      `)
      .eq('customer_id', customerFilter)

    // If agent, ensure they own this customer
    if (isAgent) {
      query = query.eq('agent_id', user.id)
    }

    if (unreadOnly) {
      // For agents, show unread from customers
      // For customers, show unread from agents
      query = query
        .eq('is_read', false)
        .eq('sender_type', isAgent ? 'customer' : 'agent')
    }

    query = query
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: messages, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('customer_messages')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customerFilter)
      .eq('is_read', false)
      .eq('sender_type', isAgent ? 'customer' : 'agent')

    return NextResponse.json({
      messages: messages || [],
      count: messages?.length || 0,
      unread_count: unreadCount || 0
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      customer_id, 
      content, 
      property_id,
      message_type = 'general',
      attachments = []
    } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }

    // Determine sender type
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    const isAgent = profile?.role === 'agent'
    let finalCustomerId = customer_id
    let agentId: string

    if (isAgent) {
      // Agent sending message - need customer_id
      if (!customer_id) {
        return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
      }

      // Verify agent owns this customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id, assigned_agent_id')
        .eq('id', customer_id)
        .eq('assigned_agent_id', user.id)
        .single()

      if (customerError || !customer) {
        return NextResponse.json({ error: 'Customer not found or not assigned to you' }, { status: 404 })
      }

      agentId = user.id
    } else {
      // Customer sending message
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id, assigned_agent_id')
        .eq('user_id', user.id)
        .single()

      if (customerError || !customer) {
        return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 })
      }

      if (!customer.assigned_agent_id) {
        return NextResponse.json({ error: 'No agent assigned to your account' }, { status: 400 })
      }

      finalCustomerId = customer.id
      agentId = customer.assigned_agent_id
    }

    // Create message
    const { data: message, error: insertError } = await supabase
      .from('customer_messages')
      .insert({
        customer_id: finalCustomerId,
        agent_id: agentId,
        sender_type: isAgent ? 'agent' : 'customer',
        sender_id: user.id,
        content: content.trim(),
        property_id: property_id || null,
        message_type,
        attachments,
        is_read: false,
        metadata: {}
      })
      .select(`
        *,
        properties:property_id (id, address, city)
      `)
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH - Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message_ids, customer_id, mark_all } = body

    // Determine user type
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    const isAgent = profile?.role === 'agent'

    if (mark_all && customer_id) {
      // Mark all messages in conversation as read
      const { error } = await supabase
        .from('customer_messages')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('customer_id', customer_id)
        .eq('is_read', false)
        .eq('sender_type', isAgent ? 'customer' : 'agent')

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'All messages marked as read' })
    }

    if (message_ids && message_ids.length > 0) {
      // Mark specific messages as read
      const { error } = await supabase
        .from('customer_messages')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .in('id', message_ids)
        .eq('sender_type', isAgent ? 'customer' : 'agent')

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Messages marked as read' })
    }

    return NextResponse.json({ error: 'No messages specified' }, { status: 400 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
