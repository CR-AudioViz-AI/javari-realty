// =====================================================
// CR REALTOR PLATFORM - GMAIL OAUTH CALLBACK
// Path: app/api/agent/email-settings/gmail/callback/route.ts
// Timestamp: 2025-12-01 5:11 PM EST
// Purpose: Handle Gmail OAuth callback and store tokens
// =====================================================

import { createAdminClient } from '@/lib/supabase-helpers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/agent/email-settings/gmail/callback`
  : 'http://localhost:3000/api/agent/email-settings/gmail/callback'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // Contains user ID
    const error = searchParams.get('error')

    // Handle errors from Google
    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard/settings/email?email_error=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/settings/email?email_error=missing_params', request.url)
      )
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(
        new URL('/dashboard/settings/email?email_error=oauth_not_configured', request.url)
      )
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI
      })
    })

    const tokens = await tokenResponse.json()

    if (tokens.error) {
      console.error('Gmail token error:', tokens)
      return NextResponse.redirect(
        new URL(`/dashboard/settings/email?email_error=${encodeURIComponent(tokens.error)}`, request.url)
      )
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })
    const userInfo = await userInfoResponse.json()

    // Store tokens in database using admin client
    // Use raw SQL approach since table may not be in generated types yet
    const adminClient = createAdminClient()
    
    const { error: upsertError } = await adminClient
      .from('agent_email_settings' as any)
      .upsert({
        agent_id: state,
        provider: 'gmail',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        sender_email: userInfo.email,
        sender_name: userInfo.name,
        is_verified: true,
        verified_at: new Date().toISOString(),
        last_error: null
      } as any, {
        onConflict: 'agent_id'
      })

    if (upsertError) {
      console.error('Error storing Gmail tokens:', upsertError)
      return NextResponse.redirect(
        new URL(`/dashboard/settings/email?email_error=storage_failed`, request.url)
      )
    }

    // Success - redirect back to settings
    return NextResponse.redirect(
      new URL('/dashboard/settings/email?email_connected=gmail', request.url)
    )

  } catch (error: any) {
    console.error('Gmail callback error:', error)
    return NextResponse.redirect(
      new URL(`/dashboard/settings/email?email_error=${encodeURIComponent(error.message)}`, request.url)
    )
  }
}
