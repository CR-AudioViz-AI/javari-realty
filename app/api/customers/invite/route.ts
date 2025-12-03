// =====================================================
// CR REALTOR PLATFORM - CUSTOMER INVITE API
// Path: app/api/customers/invite/route.ts
// Timestamp: 2025-12-02 3:15 PM EST
// Purpose: Agent creates customer → system auto-emails credentials
// FIX: Changed emailResult.messageId to emailResult.id
// =====================================================

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-helpers'
import { sendCustomerInviteEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// Generate a secure temporary password
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password + '!' // Add special char for complexity
}

// Generate invitation token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// POST - Agent creates customer invitation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user (must be an agent)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is an agent and get their profile
    const { data: agentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, first_name, last_name, email, phone, organization_id')
      .eq('id', user.id)
      .single()

    if (profileError || !agentProfile || agentProfile.role !== 'agent') {
      return NextResponse.json({ error: 'Only agents can invite customers' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      email, 
      full_name, 
      phone,
      notes,
      budget_min,
      budget_max,
      timeline,
      property_type_preference,
      bedroom_preference
    } = body

    // Validate required fields
    if (!email || !full_name) {
      return NextResponse.json({ 
        error: 'Email and full name are required' 
      }, { status: 400 })
    }

    // Check if customer already exists with this email
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, email, assigned_agent_id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingCustomer) {
      if (existingCustomer.assigned_agent_id === user.id) {
        return NextResponse.json({ 
          error: 'This customer is already assigned to you',
          customer_id: existingCustomer.id
        }, { status: 400 })
      }
      return NextResponse.json({ 
        error: 'A customer with this email already exists',
        suggestion: 'Contact admin to transfer customer to your account'
      }, { status: 400 })
    }

    // Check for pending invitation with this email
    const { data: existingInvite } = await supabase
      .from('customer_invitations')
      .select('id, status, expires_at')
      .eq('customer_email', email.toLowerCase())
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (existingInvite) {
      return NextResponse.json({ 
        error: 'A pending invitation already exists for this email',
        invitation_id: existingInvite.id
      }, { status: 400 })
    }

    // Generate credentials
    const tempPassword = generateTempPassword()
    const inviteToken = generateToken()

    // Create admin client for user creation
    const adminClient = createAdminClient()
    
    // Create auth user with temporary password
    const { data: authData, error: createUserError } = await adminClient.auth.admin.createUser({
      email: email.toLowerCase(),
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name,
        phone,
        user_type: 'customer',
        invited_by: user.id
      }
    })

    if (createUserError) {
      console.error('Error creating auth user:', createUserError)
      return NextResponse.json({ 
        error: 'Failed to create user account',
        details: createUserError.message
      }, { status: 500 })
    }

    // Create customer record
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        user_id: authData.user?.id,
        assigned_agent_id: user.id,
        full_name,
        email: email.toLowerCase(),
        phone,
        notes,
        budget_min: budget_min || null,
        budget_max: budget_max || null,
        timeline: timeline || null,
        property_type_preference: property_type_preference || null,
        bedroom_preference: bedroom_preference || null,
        status: 'active',
        source: 'agent_invite'
      })
      .select()
      .single()

    if (customerError) {
      console.error('Error creating customer:', customerError)
      // Try to clean up auth user if customer creation failed
      await adminClient.auth.admin.deleteUser(authData.user!.id)
      return NextResponse.json({ 
        error: 'Failed to create customer record',
        details: customerError.message
      }, { status: 500 })
    }

    // Create invitation record for tracking
    const { data: invitation, error: inviteError } = await supabase
      .from('customer_invitations')
      .insert({
        agent_id: user.id,
        customer_email: email.toLowerCase(),
        customer_name: full_name,
        customer_phone: phone,
        temp_password: tempPassword,
        token: inviteToken,
        status: 'pending',
        customer_id: customer.id,
        notes
      })
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
    }

    // Prepare credentials
    const agentName = `${agentProfile.first_name} ${agentProfile.last_name}`
    const loginUrl = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/customer/login`
      : 'https://cr-realtor-platform.vercel.app/customer/login'

    // ========================================
    // AUTO-SEND EMAIL TO CUSTOMER
    // ========================================
    const emailResult = await sendCustomerInviteEmail({
      customerEmail: email.toLowerCase(),
      customerName: full_name,
      agentName,
      agentEmail: agentProfile.email,
      agentPhone: agentProfile.phone,
      tempPassword,
      loginUrl
    })

    // Update invitation with email status
    // FIX: Use 'id' instead of 'messageId' and safely access with optional chaining
    if (invitation) {
      await supabase
        .from('customer_invitations')
        .update({
          metadata: {
            email_sent: emailResult.success,
            email_sent_at: emailResult.success ? new Date().toISOString() : null,
            email_error: 'error' in emailResult ? emailResult.error : null,
            email_message_id: 'id' in emailResult ? emailResult.id : null
          }
        })
        .eq('id', invitation.id)
    }

    return NextResponse.json({
      success: true,
      message: emailResult.success 
        ? 'Customer account created and email sent!' 
        : 'Customer account created. Email not configured - share credentials manually.',
      email_sent: emailResult.success,
      email_error: 'error' in emailResult ? emailResult.error : undefined,
      customer: {
        id: customer.id,
        email: customer.email,
        full_name: customer.full_name
      },
      invitation: invitation ? {
        id: invitation.id,
        token: invitation.token
      } : null,
      // Always include credentials for agent to copy if needed
      credentials: {
        email: email.toLowerCase(),
        temporary_password: tempPassword,
        login_url: loginUrl,
        agent_name: agentName,
        message: `Hi ${full_name.split(' ')[0]}! Your agent ${agentName} has created an account for you. Login at ${loginUrl} with email: ${email} and password: ${tempPassword}`
      }
    })

  } catch (error: any) {
    console.error('Invite error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

// GET - List agent's customer invitations
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('customer_invitations')
      .select(`
        *,
        customers (id, full_name, email, status)
      `)
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: invitations, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      invitations: invitations || [],
      count: invitations?.length || 0
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
