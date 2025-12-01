import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendAgentEmail, logEmailSend } from '@/lib/agent-email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for email settings operations
const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Untyped client for tables not yet in generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = adminClient;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent_id, test_email } = body;

    if (!agent_id || !test_email) {
      return NextResponse.json(
        { error: 'agent_id and test_email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(test_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send test email
    const result = await sendAgentEmail({
      agentId: agent_id,
      to: test_email,
      subject: 'Test Email from Your Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email Successful!</h2>
          <p>This is a test email from your customer communication portal.</p>
          <p>If you received this email, your email settings are configured correctly.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            This is an automated test email. Please do not reply.
          </p>
        </div>
      `,
      text: 'Test Email Successful! This is a test email from your customer communication portal. If you received this email, your email settings are configured correctly.',
    });

    if (!result.success) {
      // Log the failure
      await logEmailSend({
        agentId: agent_id,
        recipientEmail: test_email,
        subject: 'Test Email',
        status: 'failed',
        error: result.error,
      });

      return NextResponse.json(
        { error: result.error || 'Failed to send test email' },
        { status: 500 }
      );
    }

    // Update settings to mark as verified
    await db
      .from('agent_email_settings')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        last_error: null,
      })
      .eq('agent_id', agent_id);

    // Log successful send
    await logEmailSend({
      agentId: agent_id,
      recipientEmail: test_email,
      subject: 'Test Email',
      status: 'sent',
      messageId: result.messageId,
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
    });
  } catch (err) {
    console.error('Email test error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
