export const dynamic = 'force-dynamic'
export const revalidate = 0
// app/api/cron/saved-search-alerts/route.ts
// Cron job to send saved search email alerts
// Run daily via Vercel Cron
// Created: December 1, 2025 - 2:15 PM EST

import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  var createClient = require('@supabase/supabase-js').createClient
  var url = process.env.NEXT_PUBLIC_SUPABASE_URL
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}nction getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}


// Initialize Supabase with service role for cron jobs