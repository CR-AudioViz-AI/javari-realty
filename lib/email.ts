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

// Customer invite email - accepts customerEmail OR email for backward compatibility
export async function sendCustomerInviteEmail(data: {
  customerEmail?: string;
  email?: string;
  customerName: string;
  agentName: string;
  agentEmail?: string;
  tempPassword: string;
  loginUrl: string;
}) {
  const recipientEmail = data.customerEmail || data.email;
  if (!recipientEmail) {
    return { success: false, error: 'No recipient email provided' };
  }
  
  return sendEmail({
    to: recipientEmail,
    subject: `Welcome to Your Real Estate Portal - ${data.agentName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Your Personal Portal!</h1>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Hi ${data.customerName},</p>
          <p>${data.agentName} has created a personalized real estate portal just for you. You can now:</p>
          <ul style="padding-left: 20px;">
            <li>Browse properties tailored to your preferences</li>
            <li>Save favorites and compare homes</li>
            <li>Schedule showings instantly</li>
            <li>Message your agent directly</li>
            <li>Track your home search journey</li>
          </ul>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your Login Details:</strong></p>
            <p style="margin: 10px 0;">Email: <strong>${recipientEmail}</strong></p>
            <p style="margin: 0;">Temporary Password: <strong>${data.tempPassword}</strong></p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="background: #2563eb; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Your Portal</a>
          </div>
          <p style="color: #666; font-size: 14px;">For security, please change your password after your first login.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #888; font-size: 12px; text-align: center;">Questions? Reply to this email or contact ${data.agentName}${data.agentEmail ? ` at ${data.agentEmail}` : ''}.</p>
        </div>
      </body>
      </html>
    `,
  });
}

// New listing alert for customers
export async function sendNewListingAlert(data: {
  customerEmail: string;
  customerName: string;
  properties: Array<{
    address: string;
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    imageUrl?: string;
    propertyUrl: string;
  }>;
  searchName: string;
  agentName: string;
}) {
  const propertyCards = data.properties.map(p => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 15px;">
      ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.address}" style="width: 100%; height: 180px; object-fit: cover;">` : ''}
      <div style="padding: 15px;">
        <h3 style="margin: 0 0 5px 0; color: #1e3a5f;">${p.address}</h3>
        <p style="margin: 0 0 10px 0; color: #666;">${p.city}</p>
        <p style="margin: 0; font-size: 20px; font-weight: bold; color: #2563eb;">$${p.price.toLocaleString()}</p>
        <p style="margin: 5px 0; color: #666;">${p.bedrooms} bed • ${p.bathrooms} bath • ${p.sqft.toLocaleString()} sqft</p>
        <a href="${p.propertyUrl}" style="display: inline-block; margin-top: 10px; color: #2563eb; text-decoration: none; font-weight: 500;">View Details →</a>
      </div>
    </div>
  `).join('');

  return sendEmail({
    to: data.customerEmail,
    subject: `🏠 ${data.properties.length} New ${data.properties.length === 1 ? 'Property Matches' : 'Properties Match'} Your Search: ${data.searchName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">New Properties for You!</h1>
        </div>
        <div style="background: #fff; padding: 25px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Hi ${data.customerName},</p>
          <p>Great news! ${data.properties.length} new ${data.properties.length === 1 ? 'property matches' : 'properties match'} your saved search "<strong>${data.searchName}</strong>":</p>
          ${propertyCards}
          <p style="color: #666; font-size: 14px; margin-top: 20px;">Your agent ${data.agentName} is here to help with any questions!</p>
        </div>
      </body>
      </html>
    `,
  });
}

// Showing confirmation email
export async function sendShowingConfirmation(data: {
  customerEmail: string;
  customerName: string;
  propertyAddress: string;
  showingDate: string;
  showingTime: string;
  agentName: string;
  agentPhone?: string;
  notes?: string;
}) {
  return sendEmail({
    to: data.customerEmail,
    subject: `✅ Showing Confirmed: ${data.propertyAddress}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">✅ Your Showing is Confirmed!</h1>
        </div>
        <div style="background: #fff; padding: 25px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Hi ${data.customerName},</p>
          <p>Your showing has been confirmed:</p>
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Property:</strong> ${data.propertyAddress}</p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${data.showingDate}</p>
            <p style="margin: 10px 0;"><strong>Time:</strong> ${data.showingTime}</p>
            <p style="margin: 0;"><strong>Your Agent:</strong> ${data.agentName}${data.agentPhone ? ` • ${data.agentPhone}` : ''}</p>
          </div>
          ${data.notes ? `<p style="color: #666;"><strong>Notes:</strong> ${data.notes}</p>` : ''}
          <p style="color: #666; font-size: 14px;">Need to reschedule? Contact ${data.agentName} directly.</p>
        </div>
      </body>
      </html>
    `,
  });
}

// New lead notification for agents
export async function sendNewLeadNotification(data: {
  agentEmail: string;
  agentName: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  source: string;
  propertyInterest?: string;
  message?: string;
  dashboardUrl: string;
}) {
  return sendEmail({
    to: data.agentEmail,
    subject: `🔥 New Lead: ${data.leadName} - Respond Within 5 Minutes!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f97316); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">🔥 New Lead Alert!</h1>
          <p style="color: #fef2f2; margin: 10px 0 0 0;">Leads contacted within 5 minutes are 21x more likely to convert</p>
        </div>
        <div style="background: #fff; padding: 25px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 15px 0; color: #1e3a5f;">${data.leadName}</h2>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.leadEmail}">${data.leadEmail}</a></p>
            ${data.leadPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${data.leadPhone}">${data.leadPhone}</a></p>` : ''}
            <p style="margin: 5px 0;"><strong>Source:</strong> ${data.source}</p>
            ${data.propertyInterest ? `<p style="margin: 5px 0;"><strong>Interested In:</strong> ${data.propertyInterest}</p>` : ''}
          </div>
          ${data.message ? `<div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;"><p style="margin: 0; font-style: italic;">"${data.message}"</p></div>` : ''}
          <div style="text-align: center;">
            <a href="${data.dashboardUrl}" style="background: #dc2626; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Lead in Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

// Showing request notification for agents
export async function sendShowingRequest(data: {
  agentEmail: string;
  agentName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyAddress: string;
  requestedDate: string;
  requestedTime: string;
  alternateDate?: string;
  alternateTime?: string;
  message?: string;
  dashboardUrl: string;
}) {
  return sendEmail({
    to: data.agentEmail,
    subject: `🏠 Showing Request: ${data.propertyAddress}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">New Showing Request</h1>
        </div>
        <div style="background: #fff; padding: 25px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Hi ${data.agentName},</p>
          <p>You have a new showing request:</p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Property:</strong> ${data.propertyAddress}</p>
            <p style="margin: 10px 0;"><strong>Requested Date:</strong> ${data.requestedDate} at ${data.requestedTime}</p>
            ${data.alternateDate ? `<p style="margin: 10px 0;"><strong>Alternate:</strong> ${data.alternateDate} at ${data.alternateTime}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Client:</strong> ${data.customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
            <p style="margin: 0;"><strong>Phone:</strong> <a href="tel:${data.customerPhone}">${data.customerPhone}</a></p>
          </div>
          ${data.message ? `<div style="background: #fefce8; padding: 15px; border-radius: 8px; margin-bottom: 20px;"><p style="margin: 0;"><strong>Message:</strong> ${data.message}</p></div>` : ''}
          <div style="text-align: center;">
            <a href="${data.dashboardUrl}" style="background: #2563eb; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Confirm Showing</a>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
