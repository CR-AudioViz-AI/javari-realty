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
    const { userId, newEmail, oldEmail } = body
    
    if (!newEmail || (!userId && !oldEmail)) {
      return NextResponse.json({ error: 'Missing userId/oldEmail or newEmail' }, { status: 400 })
    }
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    
    let targetUserId = userId
    
    // Find user by old email if no userId provided
    if (!targetUserId && oldEmail) {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const user = users?.users?.find(u => u.email === oldEmail)
      if (!user) {
        return NextResponse.json({ error: `User not found: ${oldEmail}` }, { status: 404 })
      }
      targetUserId = user.id
    }
    
    // Update auth user email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { 
        email: newEmail,
        email_confirm: true  // Auto-confirm the new email
      }
    )
    
    if (authError) {
      return NextResponse.json({ error: `Auth update failed: ${authError.message}` }, { status: 500 })
    }
    
    // Update profile email
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ email: newEmail })
      .eq('id', targetUserId)
    
    if (profileError) {
      return NextResponse.json({ 
        warning: `Auth updated but profile failed: ${profileError.message}`,
        authUpdated: true,
        userId: targetUserId,
        newEmail
      })
    }
    
    return NextResponse.json({
      success: true,
      message: `Email updated to ${newEmail}`,
      userId: targetUserId,
      authEmail: authData.user?.email,
      profileUpdated: true
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
