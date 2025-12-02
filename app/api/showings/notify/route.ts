// app/api/showings/notify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customer_name, customer_email, customer_phone, property_address, showing_date, showing_time, agent_name, agent_email } = data;

    // Send confirmation to customer
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'CR Realtor Platform <noreply@cr-realtor.com>',
        to: customer_email,
        subject: `Showing Request Received: ${property_address}`,
        html: `
          <h2>Your showing request has been received!</h2>
          <p>Hi ${customer_name},</p>
          <p>We've received your request to view <strong>${property_address}</strong>.</p>
          <p><strong>Requested Date:</strong> ${showing_date}<br/>
          <strong>Requested Time:</strong> ${showing_time}</p>
          <p>${agent_name} will confirm your appointment shortly.</p>
        `,
      });

      // Notify agent
      if (agent_email) {
        await resend.emails.send({
          from: 'CR Realtor Platform <noreply@cr-realtor.com>',
          to: agent_email,
          subject: `🏠 New Showing Request: ${property_address}`,
          html: `
            <h2>New Showing Request!</h2>
            <p><strong>Property:</strong> ${property_address}</p>
            <p><strong>Client:</strong> ${customer_name}<br/>
            <strong>Email:</strong> ${customer_email}<br/>
            <strong>Phone:</strong> ${customer_phone}</p>
            <p><strong>Requested:</strong> ${showing_date} at ${showing_time}</p>
          `,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
