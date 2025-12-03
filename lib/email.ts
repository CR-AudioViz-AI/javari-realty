// lib/email.ts - Email service using Resend for CR Realtor Platform
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@cr-realtor.com';

// Generic sendEmail function for flexibility
export async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set, skipping email');
    return { success: true, demo: true };
  }
  try {
    const result = await resend.emails.send({
      from: data.from || `CR Realtor Platform <${FROM_EMAIL}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

// Alias for backward compatibility
export async function sendCustomerInviteEmail(data: {
  email: string;
  customerName: string;
  agentName: string;
  tempPassword: string;
  loginUrl: string;
}) {
  return sendCustomerInvite(data);
}

export async function sendCustomerInvite(data: {
  email: string;
  customerName: string;
  agentName: string;
  tempPassword: string;
  loginUrl: string;
}) {
  const { email, customerName, agentName, tempPassword, loginUrl } = data;
  return sendEmail({
    to: email,
    subject: `Welcome to ${agentName}'s Client Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Your Client Portal</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hi ${customerName},</p>
          <p style="font-size: 16px; color: #374151;">${agentName} has invited you to their exclusive client portal.</p>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your login credentials:</p>
            <p style="margin: 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">Access Your Portal</a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendNewListingAlert(data: {
  email: string;
  customerName: string;
  searchName: string;
  properties: Array<{ address: string; city: string; price: number; bedrooms: number; bathrooms: number; squareFeet: number; imageUrl?: string; listingUrl: string; }>;
}) {
  const { email, customerName, searchName, properties } = data;
  const propertyCards = properties.map(p => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 15px;">
      ${p.imageUrl ? `<img src="${p.imageUrl}" style="width: 100%; height: 150px; object-fit: cover;" />` : ''}
      <div style="padding: 15px;">
        <p style="font-size: 18px; font-weight: bold; color: #1e3a5f; margin: 0 0 5px 0;">$${p.price.toLocaleString()}</p>
        <p style="margin: 0 0 10px 0; color: #374151;">${p.address}, ${p.city}</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">${p.bedrooms} bed • ${p.bathrooms} bath • ${p.squareFeet.toLocaleString()} sqft</p>
        <a href="${p.listingUrl}" style="display: inline-block; margin-top: 10px; color: #2563eb; font-size: 14px;">View Details →</a>
      </div>
    </div>
  `).join('');
  
  return sendEmail({
    to: email,
    subject: `🏠 ${properties.length} New Properties Match "${searchName}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">New Listings Alert</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p style="color: #374151;">Hi ${customerName},</p>
          <p style="color: #374151;">${properties.length} new properties match your saved search "<strong>${searchName}</strong>":</p>
          ${propertyCards}
        </div>
      </div>
    `,
  });
}

export async function sendShowingConfirmation(data: {
  customerEmail: string;
  customerName: string;
  propertyAddress: string;
  showingDate: string;
  showingTime: string;
  agentName: string;
  agentPhone: string;
}) {
  const { customerEmail, customerName, propertyAddress, showingDate, showingTime, agentName, agentPhone } = data;
  return sendEmail({
    to: customerEmail,
    subject: `Showing Confirmed: ${propertyAddress}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; padding: 20px; text-align: center;"><h1 style="color: white; margin: 0;">✓ Showing Confirmed</h1></div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="color: #374151;">Hi ${customerName},</p>
          <p style="color: #374151;">Your property showing has been confirmed:</p>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Property:</strong> ${propertyAddress}</p>
            <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${showingDate}</p>
            <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${showingTime}</p>
            <p style="margin: 0;"><strong>Your Agent:</strong> ${agentName} • ${agentPhone}</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendNewLeadNotification(data: {
  agentEmail: string;
  agentName: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  source: string;
  notes?: string;
}) {
  const { agentEmail, agentName, leadName, leadEmail, leadPhone, source, notes } = data;
  return sendEmail({
    to: agentEmail,
    subject: `🔥 New Lead: ${leadName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 20px; text-align: center;"><h1 style="color: white; margin: 0;">New Lead Alert!</h1></div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="color: #374151;">Hi ${agentName},</p>
          <p style="color: #374151; font-weight: bold;">You have a new lead - respond within 5 minutes for best results!</p>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${leadName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${leadEmail}</p>
            ${leadPhone ? `<p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${leadPhone}</p>` : ''}
            <p style="margin: 0 0 10px 0;"><strong>Source:</strong> ${source}</p>
            ${notes ? `<p style="margin: 0;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
        </div>
      </div>
    `,
  });
}
