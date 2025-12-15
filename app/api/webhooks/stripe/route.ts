import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Use service role for webhook (not user authenticated)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { user_id, addon_id, final_price, discount_percent } = session.metadata || {}

      if (user_id && addon_id) {
        await supabase.from('addon_subscriptions').upsert({
          user_id,
          addon_id,
          status: 'active',
          price_cents: parseInt(final_price || '0'),
          discount_percent: parseInt(discount_percent || '0'),
          stripe_subscription_id: session.subscription as string,
          stripe_session_id: session.id,
          started_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,addon_id'
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const { user_id, addon_id } = subscription.metadata || {}

      if (user_id && addon_id) {
        await supabase.from('addon_subscriptions')
          .update({
            status: subscription.status === 'active' ? 'active' : subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user_id)
          .eq('addon_id', addon_id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const { user_id, addon_id } = subscription.metadata || {}

      if (user_id && addon_id) {
        await supabase.from('addon_subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user_id)
          .eq('addon_id', addon_id)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription as string
      
      // Get subscription metadata
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const { user_id, addon_id } = subscription.metadata || {}

        if (user_id && addon_id) {
          await supabase.from('addon_subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user_id)
            .eq('addon_id', addon_id)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
