// =====================================================
// CR REALTOR PLATFORM - AGENT EMAIL SETTINGS API
// Path: app/api/agent/email-settings/route.ts
// Timestamp: 2025-12-01 4:58 PM EST
// Purpose: Configure agent's email integration
// =====================================================

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Retrieve agent's email settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: settings, error } = await supabase
      .from('agent_email_settings')
      .select('*')
      .eq('agent_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Don't expose sensitive tokens to frontend
    if (settings) {
      return NextResponse.json({
        settings: {
          id: settings.id,
          provider: settings.provider,
          sender_email: settings.sender_email,
          sender_name: settings.sender_name,
          reply_to: settings.reply_to,
          signature_html: settings.signature_html,
          signature_text: settings.signature_text,
          is_verified: settings.is_verified,
          verified_at: settings.verified_at,
          last_used_at: settings.last_used_at,
          last_error: settings.last_error,
          is_active: settings.is_active,
          send_copy_to_self: settings.send_copy_to_self,
          // For SMTP, indicate if configured (but don't show password)
          smtp_configured: settings.provider === 'smtp' && !!settings.smtp_host,
          smtp_host: settings.smtp_host,
          smtp_port: settings.smtp_port,
          // For OAuth, indicate if connected
          oauth_connected: ['gmail', 'outlook'].includes(settings.provider) && !!settings.refresh_token
        }
      })
    }

    return NextResponse.json({ settings: null })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create or update email settings
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      provider,
      sender_email,
      sender_name,
      reply_to,
      signature_html,
      signature_text,
      smtp_host,
      smtp_port,
      smtp_username,
      smtp_password,
      smtp_secure,
      send_copy_to_self
    } = body

    // Validate provider
    if (!['gmail', 'outlook', 'smtp', 'none'].includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    // Validate SMTP settings if provider is smtp
    if (provider === 'smtp') {
      if (!smtp_host || !smtp_port || !smtp_username || !sender_email) {
        return NextResponse.json({ 
          error: 'SMTP requires host, port, username, and sender email' 
        }, { status: 400 })
      }
    }

    // Build settings object
    const settingsData: any = {
      agent_id: user.id,
      provider,
      sender_email: sender_email || null,
      sender_name: sender_name || null,
      reply_to: reply_to || null,
      signature_html: signature_html || null,
      signature_text: signature_text || null,
      send_copy_to_self: send_copy_to_self || false,
      is_verified: false, // Reset on update
      last_error: null
    }

    // Add SMTP settings if applicable
    if (provider === 'smtp') {
      settingsData.smtp_host = smtp_host
      settingsData.smtp_port = smtp_port
      settingsData.smtp_username = smtp_username
      settingsData.smtp_secure = smtp_secure !== false
      
      // Only update password if provided (allows updating other fields without re-entering password)
      if (smtp_password) {
        settingsData.smtp_password = smtp_password // Should be encrypted in production
      }
    } else {
      // Clear SMTP settings if switching provider
      settingsData.smtp_host = null
      settingsData.smtp_port = null
      settingsData.smtp_username = null
      settingsData.smtp_password = null
    }

    // Upsert settings
    const { data: settings, error } = await supabase
      .from('agent_email_settings')
      .upsert(settingsData, {
        onConflict: 'agent_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving email settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Email settings saved',
      settings: {
        id: settings.id,
        provider: settings.provider,
        sender_email: settings.sender_email,
        is_verified: settings.is_verified
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove email settings (disconnect)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('agent_email_settings')
      .delete()
      .eq('agent_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Email settings removed'
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
