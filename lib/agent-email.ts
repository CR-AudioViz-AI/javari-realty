// =====================================================
// CR REALTOR PLATFORM - AGENT EMAIL SERVICE
// Path: lib/agent-email.ts
// Timestamp: 2025-12-01 5:28 PM EST
// Purpose: Send emails FROM agent's own email address
// =====================================================

import { createAdminClient } from './supabase-helpers'

interface AgentEmailSettings {
  id: string
  agent_id: string
  provider: 'gmail' | 'outlook' | 'smtp' | 'none'
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  smtp_host?: string
  smtp_port?: number
  smtp_username?: string
  smtp_password?: string
  smtp_secure?: boolean
  sender_email: string
  sender_name?: string
  reply_to?: string
  signature_html?: string
  signature_text?: string
  is_verified: boolean
  send_copy_to_self: boolean
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  provider?: string
}

/**
 * Get agent's email settings
 */
export async function getAgentEmailSettings(agentId: string): Promise<AgentEmailSettings | null> {
  const adminClient = createAdminClient()
  
  // @ts-ignore - table not in generated types yet
  const { data, error } = await adminClient
    .from('agent_email_settings')
    .select('*')
    .eq('agent_id', agentId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as AgentEmailSettings
}

/**
 * Refresh Gmail access token if expired
 */
async function refreshGmailToken(settings: AgentEmailSettings): Promise<string | null> {
  if (!settings.refresh_token) return null

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('[AgentEmail] Google OAuth not configured')
    return null
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: settings.refresh_token,
        grant_type: 'refresh_token'
      })
    })

    const tokens = await response.json()

    if (tokens.error) {
      console.error('[AgentEmail] Gmail token refresh failed:', tokens.error)
      return null
    }

    // Update stored token
    const adminClient = createAdminClient()
    // @ts-ignore - table not in generated types yet
    await adminClient
      .from('agent_email_settings')
      .update({
        access_token: tokens.access_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      })
      .eq('id', settings.id)

    return tokens.access_token

  } catch (error) {
    console.error('[AgentEmail] Token refresh error:', error)
    return null
  }
}

/**
 * Send email via Gmail API
 */
async function sendViaGmail(
  settings: AgentEmailSettings, 
  params: SendEmailParams
): Promise<EmailResult> {
  // Check if token is expired
  let accessToken = settings.access_token
  
  if (settings.token_expires_at) {
    const expiresAt = new Date(settings.token_expires_at)
    if (expiresAt <= new Date()) {
      accessToken = await refreshGmailToken(settings)
      if (!accessToken) {
        return { success: false, error: 'Failed to refresh Gmail token. Please reconnect your email.' }
      }
    }
  }

  if (!accessToken) {
    return { success: false, error: 'Gmail not connected' }
  }

  // Build email with signature
  let htmlContent = params.html
  if (settings.signature_html) {
    htmlContent += `<br><br>${settings.signature_html}`
  }

  // Build raw email
  const senderName = settings.sender_name || settings.sender_email
  const fromHeader = `${senderName} <${settings.sender_email}>`
  
  const emailLines = [
    `From: ${fromHeader}`,
    `To: ${params.to}`,
    `Subject: ${params.subject}`,
    `Reply-To: ${params.replyTo || settings.reply_to || settings.sender_email}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlContent
  ]

  // Add CC to self if enabled
  if (settings.send_copy_to_self) {
    emailLines.splice(2, 0, `Cc: ${settings.sender_email}`)
  }

  const rawEmail = emailLines.join('\r\n')
  const encodedEmail = Buffer.from(rawEmail).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: encodedEmail })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('[AgentEmail] Gmail send failed:', result)
      
      // Update last error
      const adminClient = createAdminClient()
      // @ts-ignore - table not in generated types yet
      await adminClient
        .from('agent_email_settings')
        .update({ last_error: result.error?.message || 'Send failed' })
        .eq('id', settings.id)

      return { 
        success: false, 
        error: result.error?.message || 'Failed to send email via Gmail',
        provider: 'gmail'
      }
    }

    // Update last used
    const adminClient = createAdminClient()
    // @ts-ignore - table not in generated types yet
    await adminClient
      .from('agent_email_settings')
      .update({ last_used_at: new Date().toISOString(), last_error: null })
      .eq('id', settings.id)

    return { 
      success: true, 
      messageId: result.id,
      provider: 'gmail'
    }

  } catch (error: unknown) {
    console.error('[AgentEmail] Gmail error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message, provider: 'gmail' }
  }
}

/**
 * Send email via SMTP (using Nodemailer-like approach)
 */
async function sendViaSMTP(
  settings: AgentEmailSettings, 
  params: SendEmailParams
): Promise<EmailResult> {
  // For SMTP, we'll use a simple fetch to an SMTP relay service
  // In production, you'd use nodemailer or similar
  
  // For now, return a placeholder - SMTP requires server-side nodemailer
  return { 
    success: false, 
    error: 'SMTP sending requires additional server configuration. Please use Gmail or Outlook.',
    provider: 'smtp'
  }
}

/**
 * Send email via Microsoft Graph API (Outlook)
 */
async function sendViaOutlook(
  settings: AgentEmailSettings, 
  params: SendEmailParams
): Promise<EmailResult> {
  // Similar to Gmail, but using Microsoft Graph API
  // Placeholder for now
  return { 
    success: false, 
    error: 'Outlook integration coming soon. Please use Gmail for now.',
    provider: 'outlook'
  }
}

/**
 * Main function - Send email from agent's configured email
 */
export async function sendAgentEmail(
  agentId: string,
  params: SendEmailParams
): Promise<EmailResult> {
  // Get agent's email settings
  const settings = await getAgentEmailSettings(agentId)

  if (!settings) {
    return { 
      success: false, 
      error: 'Email not configured. Please connect your email in Settings.' 
    }
  }

  if (!settings.is_verified) {
    return { 
      success: false, 
      error: 'Email not verified. Please verify your email settings.' 
    }
  }

  // Route to appropriate provider
  switch (settings.provider) {
    case 'gmail':
      return sendViaGmail(settings, params)
    
    case 'outlook':
      return sendViaOutlook(settings, params)
    
    case 'smtp':
      return sendViaSMTP(settings, params)
    
    default:
      return { 
        success: false, 
        error: 'No email provider configured' 
      }
  }
}

/**
 * Log email send attempt
 */
export async function logEmailSend(
  agentId: string,
  customerId: string | null,
  recipientEmail: string,
  subject: string,
  emailType: string,
  result: EmailResult
) {
  const adminClient = createAdminClient()
  
  // @ts-ignore - table not in generated types yet
  await adminClient
    .from('agent_email_log')
    .insert({
      agent_id: agentId,
      customer_id: customerId,
      recipient_email: recipientEmail,
      subject,
      email_type: emailType,
      status: result.success ? 'sent' : 'failed',
      provider: result.provider,
      provider_message_id: result.messageId,
      error_message: result.error
    })
}

/**
 * Check if agent has email configured
 */
export async function hasAgentEmailConfigured(agentId: string): Promise<boolean> {
  const settings = await getAgentEmailSettings(agentId)
  return settings !== null && settings.is_verified
}
