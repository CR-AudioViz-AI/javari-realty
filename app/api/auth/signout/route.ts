import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * 2026-09-07: this answered 500 with an empty body on every request.
 *
 * It redirected to `new URL('/auth/login', process.env.NEXT_PUBLIC_SITE_URL)`.
 * When that variable is not an absolute URL - a bare host, a trailing path, an
 * empty string - new URL throws a TypeError before any handler code runs, which
 * is why the body was empty and no log line named a cause.
 *
 * The base now comes from the REQUEST, which is an absolute URL by definition.
 * A sign-out route cannot depend on a variable being formatted correctly: the
 * one moment somebody needs to sign out is the moment it must not fail.
 *
 * The unused getSupabase() helper is gone with it - it was dead, and it called
 * require() at module scope in a route declared force-dynamic.
 */
async function signOutAndRedirect(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // Signing out must succeed from the caller's point of view even when the
    // session was already gone. Redirecting them away is the whole point.
  }
  return NextResponse.redirect(new URL('/auth/login', request.url))
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return signOutAndRedirect(request)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return signOutAndRedirect(request)
}
