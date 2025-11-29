import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple email notification using fetch to external service
// In production, integrate with SendGrid, Postmark, or AWS SES

interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string
}

async function sendEmail(payload: EmailPayload) {
  // For now, log the email - in production, use a real service
  console.log('📧 Email notification:', {
    to: payload.to,
    subject: payload.subject,
    preview: payload.html.substring(0, 100) + '...'
  })
  
  // If you have SendGrid API key, uncomment this:
  /*
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  if (SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: payload.from || 'noreply@cr-realty.com', name: 'CR Realty' },
        subject: payload.subject,
        content: [{ type: 'text/html', value: payload.html }]
      })
    })
    return response.ok
  }
  */
  
  return true
}

// POST - Send notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    let emailPayload: EmailPayload | null = null

    switch (type) {
      case 'new_showing_request':
        // Notify agent of new showing request
        emailPayload = {
          to: data.agent_email,
          subject: `New Showing Request: ${data.property_address}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Showing Request</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb;">
                <p style="font-size: 16px; color: #374151;">You have a new showing request!</p>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Property</h3>
                  <p style="color: #6b7280; margin: 0;">${data.property_address}</p>
                </div>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Requested Time</h3>
                  <p style="color: #6b7280; margin: 0;">${data.requested_date} at ${data.requested_time}</p>
                </div>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Customer</h3>
                  <p style="color: #374151; font-weight: 600; margin: 0 0 5px 0;">${data.customer_name}</p>
                  <p style="color: #6b7280; margin: 0 0 5px 0;">${data.customer_email}</p>
                  ${data.customer_phone ? `<p style="color: #6b7280; margin: 0;">${data.customer_phone}</p>` : ''}
                </div>
                
                ${data.notes ? `
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Notes</h3>
                  <p style="color: #6b7280; margin: 0;">${data.notes}</p>
                </div>
                ` : ''}
                
                <a href="${data.dashboard_url || 'https://cr-realtor-platform.vercel.app/dashboard/showings'}" 
                   style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px;">
                  View in Dashboard
                </a>
              </div>
              <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>CR Realty • Powered by CR AudioViz AI</p>
              </div>
            </div>
          `
        }
        break

      case 'showing_confirmed':
        // Notify customer their showing is confirmed
        emailPayload = {
          to: data.customer_email,
          subject: `Showing Confirmed: ${data.property_address}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">✓ Showing Confirmed</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb;">
                <p style="font-size: 16px; color: #374151;">Great news! Your showing has been confirmed.</p>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Property</h3>
                  <p style="color: #6b7280; margin: 0;">${data.property_address}</p>
                </div>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Confirmed Time</h3>
                  <p style="color: #374151; font-size: 18px; font-weight: 600; margin: 0;">
                    ${data.confirmed_date} at ${data.confirmed_time}
                  </p>
                </div>
                
                ${data.agent_name ? `
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Your Agent</h3>
                  <p style="color: #374151; font-weight: 600; margin: 0 0 5px 0;">${data.agent_name}</p>
                  ${data.agent_phone ? `<p style="color: #6b7280; margin: 0;">${data.agent_phone}</p>` : ''}
                </div>
                ` : ''}
                
                ${data.agent_notes ? `
                <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                  <p style="color: #1e40af; margin: 0;"><strong>Agent Note:</strong> ${data.agent_notes}</p>
                </div>
                ` : ''}
                
                <a href="${data.customer_dashboard_url || 'https://cr-realtor-platform.vercel.app/customer/dashboard'}" 
                   style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px;">
                  View Your Showings
                </a>
              </div>
              <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>CR Realty • Powered by CR AudioViz AI</p>
              </div>
            </div>
          `
        }
        break

      case 'new_message':
        // Notify of new message
        emailPayload = {
          to: data.recipient_email,
          subject: `New Message from ${data.sender_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Message</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb;">
                <p style="font-size: 16px; color: #374151;">You have a new message from <strong>${data.sender_name}</strong></p>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">"${data.message}"</p>
                </div>
                
                <a href="${data.inbox_url}" 
                   style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px;">
                  Reply Now
                </a>
              </div>
              <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>CR Realty • Powered by CR AudioViz AI</p>
              </div>
            </div>
          `
        }
        break

      case 'new_lead':
        // Notify agent of new lead
        emailPayload = {
          to: data.agent_email,
          subject: `New Lead: ${data.lead_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">🔥 New Lead</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb;">
                <p style="font-size: 16px; color: #374151;">A new lead has come in!</p>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Contact Info</h3>
                  <p style="color: #374151; font-weight: 600; margin: 0 0 5px 0;">${data.lead_name}</p>
                  <p style="color: #6b7280; margin: 0 0 5px 0;">${data.lead_email}</p>
                  ${data.lead_phone ? `<p style="color: #6b7280; margin: 0;">${data.lead_phone}</p>` : ''}
                </div>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Source</h3>
                  <p style="color: #6b7280; margin: 0;">${data.source || 'Website'}</p>
                </div>
                
                ${data.budget ? `
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Budget</h3>
                  <p style="color: #6b7280; margin: 0;">${data.budget}</p>
                </div>
                ` : ''}
                
                ${data.notes ? `
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin-top: 0;">Notes</h3>
                  <p style="color: #6b7280; margin: 0;">${data.notes}</p>
                </div>
                ` : ''}
                
                <a href="${data.crm_url || 'https://cr-realtor-platform.vercel.app/dashboard/leads'}" 
                   style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px;">
                  View Lead
                </a>
              </div>
              <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>CR Realty • Powered by CR AudioViz AI</p>
              </div>
            </div>
          `
        }
        break

      default:
        return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 })
    }

    if (emailPayload) {
      const sent = await sendEmail(emailPayload)
      return NextResponse.json({ success: sent, type })
    }

    return NextResponse.json({ error: 'Failed to create email' }, { status: 500 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
