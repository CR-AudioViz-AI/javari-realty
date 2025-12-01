// =====================================================
// CR REALTOR PLATFORM - EMAIL SERVICE
// Path: lib/email.ts
// Timestamp: 2025-12-01 4:43 PM EST
// Purpose: Send customer invitation emails
// =====================================================

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send email using Resend API
 * Get your free API key at: https://resend.com
 * Free tier: 3,000 emails/month
 */
export async function sendEmail(params: SendEmailParams): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    console.log('[Email] RESEND_API_KEY not configured - email not sent')
    return { 
      success: false, 
      error: 'Email service not configured. Add RESEND_API_KEY to environment variables.' 
    }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: params.from || 'CR Realtor Platform <noreply@craudiovizai.com>',
        to: params.to,
        subject: params.subject,
        html: params.html
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Email] Send failed:', data)
      return { success: false, error: data.message || 'Failed to send email' }
    }

    console.log('[Email] Sent successfully to:', params.to)
    return { success: true, messageId: data.id }

  } catch (error: any) {
    console.error('[Email] Error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send customer invitation email with login credentials
 */
export async function sendCustomerInviteEmail(params: {
  customerEmail: string
  customerName: string
  agentName: string
  agentEmail?: string
  agentPhone?: string
  tempPassword: string
  loginUrl: string
  companyName?: string
}): Promise<EmailResult> {
  const { 
    customerEmail, 
    customerName, 
    agentName, 
    agentEmail,
    agentPhone,
    tempPassword, 
    loginUrl,
    companyName = 'CR Realtor Platform'
  } = params

  const firstName = customerName.split(' ')[0]

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Your Home Search!</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 18px; color: #1f2937; margin: 0 0 20px;">Hi ${firstName},</p>
              
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
                Great news! <strong>${agentName}</strong> has set up a personal account for you on our real estate platform. 
                You now have access to browse properties, save favorites, request showings, and communicate directly with your agent.
              </p>
              
              <!-- Credentials Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="font-size: 14px; color: #64748b; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;">Your Login Credentials</p>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #64748b; font-size: 14px;">Email:</span><br>
                          <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${customerEmail}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #64748b; font-size: 14px;">Temporary Password:</span><br>
                          <span style="color: #1f2937; font-size: 18px; font-weight: 600; font-family: monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${tempPassword}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Login to Your Account →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 20px 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <strong>What you can do:</strong><br>
                ✓ Browse and search properties<br>
                ✓ Save your favorite listings<br>
                ✓ Request property showings<br>
                ✓ Message ${agentName} directly<br>
                ✓ View documents shared with you
              </p>
            </td>
          </tr>
          
          <!-- Agent Contact -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 14px; color: #64748b; margin: 0 0 8px;">Your Agent</p>
              <p style="font-size: 16px; color: #1f2937; margin: 0; font-weight: 600;">${agentName}</p>
              ${agentEmail ? `<p style="font-size: 14px; color: #3b82f6; margin: 4px 0 0;"><a href="mailto:${agentEmail}" style="color: #3b82f6; text-decoration: none;">${agentEmail}</a></p>` : ''}
              ${agentPhone ? `<p style="font-size: 14px; color: #4b5563; margin: 4px 0 0;">${agentPhone}</p>` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                This email was sent by ${companyName}.<br>
                If you didn't expect this email, please contact your agent.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendEmail({
    to: customerEmail,
    subject: `${agentName} has set up your home search account`,
    html
  })
}
