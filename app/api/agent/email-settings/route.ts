// =====================================================
// CR REALTOR PLATFORM - AGENT EMAIL SETTINGS API
// Path: app/api/agent/email-settings/route.ts
// Timestamp: 2025-12-01 5:30 PM EST
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

    // @ts-ignore - table not in generated types yet
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
      const s = settings as Record<string, unknown>
      return NextResponse.json({
        settings: {
          id: s.id,
          provider: s.provider,
          sender_email: s.sender_email,
          sender_name: s.sender_name,
          reply_to: s.reply_to,
          signature_html: s.signature_html,
          signature_text: s.signature_text,
          is_verified: s.is_verified,
          verified_at: s.verified_at,
          last_used_at: s.last_used_at,
          last_error: s.last_error,
          is_active: s.is_active,
          send_copy_to_self: s.send_copy_to_self,
          // For SMTP, indicate if configured (but don't show password)
          smtp_configured: s.provider === 'smtp' && !!s.smtp_host,
          smtp_host: s.smtp_host,
          smtp_port: s.smtp_port,
          // For OAuth, indicate if connected
          oauth_connected: ['gmail', 'outlook'].includes(s.provider as string) && !!s.refresh_token
        }
      })
    }

    return NextResponse.json({ settings: null })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
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
    const settingsData: Record<string, unknown> = {
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
    // @ts-ignore - table not in generated types yet
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

    const s = settings as Record<string, unknown>
    return NextResponse.json({
      success: true,
      message: 'Email settings saved',
      settings: {
        id: s.id,
        provider: s.provider,
        sender_email: s.sender_email,
        is_verified: s.is_verified
      }
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
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

    // @ts-ignore - table not in generated types yet
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

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
