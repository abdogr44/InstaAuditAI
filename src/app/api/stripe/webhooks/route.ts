import { createClient as CreateServerClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')
  const supabaseServer = CreateServerClient({ isServiceWorker: true })

  let stripeEvent

  if (!rawBody) return NextResponse.json({ error: 'Invalid request body' })
  if (!signature) return NextResponse.json({ error: 'Invalid stripe-signature' })

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({
      error: { statusCode: 400, statusMessage: `Webhook error: ${err}` },
    })
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      if (stripeEvent.data.object.metadata?.audit_request_id) {
        await redis.rpush('audit-queue', JSON.stringify({ requestId: stripeEvent.data.object.metadata.audit_request_id }))
      }
      break
    default:
      console.log(`Unhandled event type ${stripeEvent.type}.`)
  }

  return NextResponse.json({ received: true })
}
