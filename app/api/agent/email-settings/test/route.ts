// =====================================================
// CR REALTOR PLATFORM - TEST EMAIL SETTINGS
// Path: app/api/agent/email-settings/test/route.ts
// Timestamp: 2025-12-01 5:32 PM EST
// Purpose: Send test email to verify configuration
// =====================================================

import { createClient } from '@/lib/supabase/server'
import { sendAgentEmail, logEmailSend } from '@/lib/agent-email'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST - Send test email
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get agent profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .single()

    const body = await request.json()
    const p = profile as Record<string, unknown> | null
    const testEmail = body.test_email || p?.email

    if (!testEmail) {
      return NextResponse.json({ error: 'No test email provided' }, { status: 400 })
    }

    // Send test email
    const result = await sendAgentEmail(user.id, {
      to: testEmail as string,
      subject: 'Test Email - CR Realtor Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">✅ Email Configuration Successful!</h2>
          <p>Hi ${p?.first_name || 'there'},</p>
          <p>This test email confirms your email integration is working correctly.</p>
          <p>When you message customers through the CR Realtor Platform, emails will be sent from your connected email address.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Sent via CR Realtor Platform<br>
            ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
          </p>
        </div>
      `
    })

    // Log the attempt
    await logEmailSend(
      user.id,
      null,
      testEmail as string,
      'Test Email - CR Realtor Platform',
      'test',
      result
    )

    if (result.success) {
      // Mark as verified if test succeeds
      // @ts-ignore - table not in generated types yet
      await supabase
        .from('agent_email_settings')
        .update({ 
          is_verified: true, 
          verified_at: new Date().toISOString(),
          last_error: null
        })
        .eq('agent_id', user.id)

      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}`,
        provider: result.provider,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: 'Test email failed. Please check your settings.'
      }, { status: 400 })
    }

  } catch (error: unknown) {
    console.error('Test email error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
