import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Admin endpoint to fix RLS policies
// Call with: GET /api/admin/fix-rls?key=YOUR_SERVICE_KEY
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')
    
    // Verify admin access
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!adminKey || adminKey !== serviceKey?.slice(-10)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Create admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )
    
    const results: string[] = []
    
    // Test if we can access properties
    const { data: props, error: propsError } = await supabase
      .from('properties')
      .select('id, title')
      .limit(5)
    
    if (propsError) {
      results.push(`Properties error: ${propsError.message}`)
    } else {
      results.push(`Properties accessible: ${props?.length || 0} found`)
    }
    
    // Test profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email, full_name, role')
      .eq('role', 'realtor')
    
    if (profilesError) {
      results.push(`Profiles error: ${profilesError.message}`)
    } else {
      results.push(`Realtor profiles: ${profiles?.length || 0} found`)
      profiles?.forEach(p => results.push(`  - ${p.full_name}: ${p.email}`))
    }
    
    // Test knowledge base
    const { data: kb, error: kbError } = await supabase
      .from('javari_knowledge_base')
      .select('topic')
      .limit(5)
    
    if (kbError) {
      results.push(`Knowledge base error: ${kbError.message}`)
    } else {
      results.push(`Knowledge base: ${kb?.length || 0} entries`)
    }
    
    // Test market data
    const { data: market, error: marketError } = await supabase
      .from('javari_market_data')
      .select('metric_type, value')
    
    if (marketError) {
      results.push(`Market data error: ${marketError.message}`)
    } else {
      results.push(`Market data: ${market?.length || 0} entries`)
      market?.forEach(m => results.push(`  - ${m.metric_type}: ${m.value}%`))
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database status check complete',
      results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
