import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')
    
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey || !adminKey || adminKey !== serviceKey.slice(-10)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { userId, password, email } = body
    
    if (!password || (!userId && !email)) {
      return NextResponse.json({ 
        error: 'Missing userId/email or password' 
      }, { status: 400 })
    }
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    
    let targetUserId = userId
    
    // If email provided, find user ID first
    if (!targetUserId && email) {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const user = users?.users?.find(u => u.email === email)
      if (!user) {
        return NextResponse.json({ error: `User not found: ${email}` }, { status: 404 })
      }
      targetUserId = user.id
    }
    
    // Update password
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { password }
    )
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: `Password updated for ${data.user?.email}`,
      userId: targetUserId
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
