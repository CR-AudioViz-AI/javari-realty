// Force dynamic rendering - this route uses request.nextUrl.searchParams
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/agent/email-settings/gmail/callback`
  : 'http://localhost:3000/api/agent/email-settings/gmail/callback';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for upserting email settings
const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Untyped client for tables not yet in generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = adminClient;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the agent_id
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL('/dashboard/settings/email?error=oauth_denied', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/settings/email?error=missing_params', request.url)
      );
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/dashboard/settings/email?error=token_exchange_failed', request.url)
      );
    }

    const tokens = await tokenResponse.json();

    // Get user info (email, name)
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const userInfo = await userInfoResponse.json();

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Store tokens in database using untyped client
    const { error: upsertError } = await db
      .from('agent_email_settings')
      .upsert({
        agent_id: state,
        provider: 'gmail',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: expiresAt,
        sender_email: userInfo.email,
        sender_name: userInfo.name,
        is_verified: true,
        verified_at: new Date().toISOString(),
        last_error: null,
      }, { onConflict: 'agent_id' });

    if (upsertError) {
      console.error('Database error:', upsertError);
      return NextResponse.redirect(
        new URL('/dashboard/settings/email?error=database_error', request.url)
      );
    }

    // Redirect back to settings page with success
    return NextResponse.redirect(
      new URL('/dashboard/settings/email?success=gmail_connected', request.url)
    );
  } catch (err) {
    console.error('Gmail callback error:', err);
    return NextResponse.redirect(
      new URL('/dashboard/settings/email?error=unknown', request.url)
    );
  }
}
