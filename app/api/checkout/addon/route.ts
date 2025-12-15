import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Add-on pricing configuration
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

    // Create or get Stripe customer
    const supabase = await createClient()
    
    let stripeCustomerId: string

    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user_id)
      .single()

    if (profile?.stripe_customer_id) {
      stripeCustomerId = profile.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user_email,
        metadata: {
          user_id: user_id,
          platform: 'cr-realtor',
        },
      })
      stripeCustomerId = customer.id

      // Save to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user_id)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: addon.name,
              description: `CR Realtor Platform - ${addon.name}`,
              metadata: {
                addon_id: addon_id,
              },
            },
            unit_amount: finalPrice,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://realtor.craudiovizai.com'}/dashboard/addons/success?session_id={CHECKOUT_SESSION_ID}&addon=${addon_id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://realtor.craudiovizai.com'}/dashboard/addons`,
      metadata: {
        user_id: user_id,
        addon_id: addon_id,
        discount_percent: discount_percent.toString(),
        original_price: originalPrice.toString(),
        final_price: finalPrice.toString(),
      },
      subscription_data: {
        metadata: {
          user_id: user_id,
          addon_id: addon_id,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
