import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Add-on pricing configuration (cents)
const ADDON_PRICES: Record<string, { monthly: number; name: string }> = {
  'education': { monthly: 4900, name: 'Education Center' },
  'crm': { monthly: 7900, name: 'Lead Scoring & CRM Pro' },
  'vendors': { monthly: 2900, name: 'Vendor Network' },
  'marketing': { monthly: 3900, name: 'Property Marketing Suite' },
  'ai-assistant': { monthly: 4900, name: 'AI Assistant Pro' },
  'full-bundle': { monthly: 14900, name: 'Complete Realtor Suite' },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { addon_id, discount_percent = 0, user_id, user_email } = body

    // Validate addon
    const addon = ADDON_PRICES[addon_id]
    if (!addon) {
      return NextResponse.json({ error: 'Invalid add-on' }, { status: 400 })
    }

    // Calculate discounted price
    const originalPrice = addon.monthly
    const discountAmount = Math.round(originalPrice * (discount_percent / 100))
    const finalPrice = originalPrice - discountAmount

    // For now, record as pending and redirect to main CR AudioViz checkout
    const supabase = await createClient()
    
    await supabase.from('addon_subscriptions').upsert({
      user_id,
      addon_id,
      status: 'pending',
      price_cents: finalPrice,
      discount_percent,
    }, {
      onConflict: 'user_id,addon_id'
    })

    // Redirect to CR AudioViz payment system
    const checkoutUrl = `https://craudiovizai.com/checkout?` + new URLSearchParams({
      plan: `realtor_addon_${addon_id}`,
      price: (finalPrice / 100).toString(),
      email: user_email || '',
      return_url: `https://realtor.craudiovizai.com/dashboard/addons/success?addon=${addon_id}`,
      cancel_url: 'https://realtor.craudiovizai.com/dashboard/addons',
      metadata: JSON.stringify({ user_id, addon_id, platform: 'realtor' }),
    }).toString()

    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    )
  }
}
