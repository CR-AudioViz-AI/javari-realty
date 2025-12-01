// =====================================================
// CR REALTOR PLATFORM - CUSTOMER INVITE API
// Path: app/api/customers/invite/route.ts
// Timestamp: 2025-12-01 3:58 PM EST
// Purpose: Agent creates customer → system emails credentials
// =====================================================

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-helpers'
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

    // Verify user is an agent
    const { data: agentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, first_name, last_name, email, organization_id')
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
      // Customer exists - check if already assigned to this agent
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
        temp_password: tempPassword, // Store for re-send capability
        token: inviteToken,
        status: 'pending',
        customer_id: customer.id,
        notes
      })
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      // Continue anyway - invitation tracking is optional
    }

    // Prepare email content
    const agentName = `${agentProfile.first_name} ${agentProfile.last_name}`
    const loginUrl = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/customer/login`
      : 'https://cr-realtor-platform.vercel.app/customer/login'

    // Try to send email via Supabase (if configured)
    // Note: Supabase auth email is already sent on user creation
    // This is for additional custom notification

    return NextResponse.json({
      success: true,
      message: 'Customer account created successfully',
      customer: {
        id: customer.id,
        email: customer.email,
        full_name: customer.full_name
      },
      invitation: invitation ? {
        id: invitation.id,
        token: invitation.token
      } : null,
      // Credentials for agent to share manually if email fails
      credentials: {
        email: email.toLowerCase(),
        temporary_password: tempPassword,
        login_url: loginUrl,
        agent_name: agentName,
        message: `Your real estate agent ${agentName} has created an account for you. Login at ${loginUrl} with email: ${email} and password: ${tempPassword}`
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
    const status = searchParams.get('status') // pending, accepted, expired, all
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

// PATCH - Resend invitation or update status
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { invitation_id, action } = body

    if (!invitation_id) {
      return NextResponse.json({ error: 'Invitation ID required' }, { status: 400 })
    }

    // Get invitation
    const { data: invitation, error: fetchError } = await supabase
      .from('customer_invitations')
      .select('*')
      .eq('id', invitation_id)
      .eq('agent_id', user.id) // Ensure agent owns this invitation
      .single()

    if (fetchError || !invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    if (action === 'resend') {
      // Generate new password and update
      const newPassword = generateTempPassword()
      const newToken = generateToken()

      // Update auth user password
      const adminClient = createAdminClient()
      
      if (invitation.customer_id) {
        const { data: customer } = await supabase
          .from('customers')
          .select('user_id')
          .eq('id', invitation.customer_id)
          .single()

        if (customer?.user_id) {
          await adminClient.auth.admin.updateUserById(customer.user_id, {
            password: newPassword
          })
        }
      }

      // Update invitation
      const { data: updated, error: updateError } = await supabase
        .from('customer_invitations')
        .update({
          temp_password: newPassword,
          token: newToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', invitation_id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Invitation credentials updated',
        credentials: {
          email: invitation.customer_email,
          temporary_password: newPassword
        }
      })
    }

    if (action === 'expire') {
      const { error: updateError } = await supabase
        .from('customer_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation_id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Invitation expired'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
