import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createClient()
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Log OAuth login to central activity system
      try {
        await fetch(`${origin}/api/activity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            action: 'oauth_login',
            appId: 'realtor-platform',
            metadata: { 
              provider: data.user.app_metadata?.provider || 'oauth',
              email: data.user.email
            }
          })
        })
      } catch (e) {
        // Don't block on logging errors
      }
    }
  }

  // Redirect to dashboard after OAuth
  return NextResponse.redirect(`${origin}/dashboard`)
}
