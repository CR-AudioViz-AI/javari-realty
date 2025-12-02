// lib/email.ts
// Email service using Resend for CR Realtor Platform
// Handles all transactional emails

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@cr-realtor.com';
const PLATFORM_NAME = 'CR Realtor Platform';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================
// CUSTOMER EMAILS
// ============================================

export async function sendCustomerInvite(
  email: string,
  customerName: string,
  agentName: string,
  tempPassword: string,
  loginUrl: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${PLATFORM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `${agentName} has invited you to ${PLATFORM_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .credentials { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${PLATFORM_NAME}!</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p><strong>${agentName}</strong> has invited you to join their client portal. This is your personal space to:</p>
              <ul>
                <li>🏠 View properties shared with you</li>
                <li>💾 Save your favorite homes</li>
                <li>📄 Access important documents</li>
                <li>💬 Message your agent directly</li>
                <li>🔍 Search for new properties</li>
              </ul>
              
              <div class="credentials">
                <p><strong>Your Login Credentials:</strong></p>
                <p>Email: <code>${email}</code></p>
                <p>Temporary Password: <code>${tempPassword}</code></p>
              </div>
              
              <p style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to Your Portal</a>
              </p>
              
              <p style="color: #6b7280; font-size: 14px;">
                For security, please change your password after your first login.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${PLATFORM_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendNewListingAlert(
  email: string,
  customerName: string,
  searchName: string,
  properties: Array<{
    address: string;
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    imageUrl?: string;
    propertyUrl: string;
  }>,
  searchUrl: string
): Promise<EmailResult> {
  try {
    const propertyCards = properties.map(p => `
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin: 10px 0; overflow: hidden;">
        ${p.imageUrl ? `<img src="${p.imageUrl}" style="width: 100%; height: 150px; object-fit: cover;" alt="${p.address}">` : ''}
        <div style="padding: 15px;">
          <h3 style="margin: 0 0 5px 0; color: #1e40af;">$${p.price.toLocaleString()}</h3>
          <p style="margin: 0 0 5px 0; font-weight: bold;">${p.address}</p>
          <p style="margin: 0 0 10px 0; color: #6b7280;">${p.city}</p>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            ${p.bedrooms} bed • ${p.bathrooms} bath • ${p.sqft.toLocaleString()} sqft
          </p>
          <a href="${p.propertyUrl}" style="display: inline-block; margin-top: 10px; color: #1e40af; text-decoration: none;">View Details →</a>
        </div>
      </div>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: `${PLATFORM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `🏠 ${properties.length} New ${properties.length === 1 ? 'Property' : 'Properties'} Match "${searchName}"`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 New Listings Alert!</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p><strong>${properties.length} new ${properties.length === 1 ? 'property matches' : 'properties match'}</strong> your saved search "<strong>${searchName}</strong>":</p>
              
              ${propertyCards}
              
              <p style="text-align: center; margin-top: 20px;">
                <a href="${searchUrl}" class="button">View All Matches</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendShowingConfirmation(
  email: string,
  customerName: string,
  propertyAddress: string,
  showingDate: string,
  showingTime: string,
  agentName: string,
  agentPhone: string,
  notes?: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${PLATFORM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `✅ Showing Confirmed: ${propertyAddress}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Showing Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>Your property showing has been confirmed!</p>
              
              <div class="details">
                <h3 style="margin-top: 0;">📍 ${propertyAddress}</h3>
                <p><strong>📅 Date:</strong> ${showingDate}</p>
                <p><strong>🕐 Time:</strong> ${showingTime}</p>
                <p><strong>👤 Agent:</strong> ${agentName}</p>
                <p><strong>📞 Contact:</strong> ${agentPhone}</p>
                ${notes ? `<p><strong>📝 Notes:</strong> ${notes}</p>` : ''}
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                Need to reschedule? Contact your agent directly or reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendDocumentShared(
  email: string,
  customerName: string,
  documentName: string,
  agentName: string,
  documentUrl: string,
  message?: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${PLATFORM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `📄 ${agentName} shared a document with you`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📄 New Document Shared</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p><strong>${agentName}</strong> has shared a document with you:</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                <h3 style="margin-top: 0;">📄 ${documentName}</h3>
                ${message ? `<p style="color: #6b7280;">"${message}"</p>` : ''}
              </div>
              
              <p style="text-align: center;">
                <a href="${documentUrl}" class="button">View Document</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================
// AGENT EMAILS
// ============================================

export async function sendNewLeadNotification(
  agentEmail: string,
  agentName: string,
  lead: {
    name: string;
    email: string;
    phone?: string;
    source: string;
    message?: string;
    propertyInterest?: string;
  },
  dashboardUrl: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${PLATFORM_NAME} <${FROM_EMAIL}>`,
      to: agentEmail,
      subject: `🔥 New Lead: ${lead.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .lead-card { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔥 New Lead!</h1>
            </div>
            <div class="content">
              <p>Hi ${agentName},</p>
              <p>You have a new lead! Contact them within 5 minutes for the best conversion rate.</p>
              
              <div class="lead-card">
                <h3 style="margin-top: 0;">👤 ${lead.name}</h3>
                <p><strong>📧 Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
                ${lead.phone ? `<p><strong>📞 Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>` : ''}
                <p><strong>📍 Source:</strong> ${lead.source}</p>
                ${lead.propertyInterest ? `<p><strong>🏠 Property Interest:</strong> ${lead.propertyInterest}</p>` : ''}
                ${lead.message ? `<p><strong>💬 Message:</strong> "${lead.message}"</p>` : ''}
              </div>
              
              <p style="text-align: center;">
                <a href="${dashboardUrl}" class="button">View in Dashboard</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendShowingRequest(
  agentEmail: string,
  agentName: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  propertyAddress: string,
  preferredDates: string[],
  message?: string,
  dashboardUrl?: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${PLATFORM_NAME} <${FROM_EMAIL}>`,
      to: agentEmail,
      subject: `🏠 Showing Request: ${propertyAddress}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 Showing Request</h1>
            </div>
            <div class="content">
              <p>Hi ${agentName},</p>
              <p><strong>${customerName}</strong> wants to see a property!</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                <h3 style="margin-top: 0;">📍 ${propertyAddress}</h3>
                <p><strong>👤 Client:</strong> ${customerName}</p>
                <p><strong>📧 Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
                <p><strong>📞 Phone:</strong> <a href="tel:${customerPhone}">${customerPhone}</a></p>
                <p><strong>📅 Preferred Times:</strong></p>
                <ul>
                  ${preferredDates.map(d => `<li>${d}</li>`).join('')}
                </ul>
                ${message ? `<p><strong>💬 Message:</strong> "${message}"</p>` : ''}
              </div>
              
              <p style="text-align: center;">
                <a href="mailto:${customerEmail}?subject=Showing Confirmation: ${encodeURIComponent(propertyAddress)}" class="button">📧 Email Client</a>
                <a href="tel:${customerPhone}" class="button">📞 Call Client</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export default {
  sendCustomerInvite,
  sendNewListingAlert,
  sendShowingConfirmation,
  sendDocumentShared,
  sendNewLeadNotification,
  sendShowingRequest,
};
