import { createClient as CreateServerClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = CreateServerClient({})
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { handle, email, niche, goal } = await request.json()

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, name')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id
  const name = profile?.name || undefined

  if (!customerId) {
    const customer = await stripe.customers.create({ email, name })
    customerId = customer.id
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const { data: audit } = await supabase
    .from('audit_requests')
    .insert({ user_id: user.id, handle, email, niche, goal })
    .select()
    .single()

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 900,
          product_data: { name: 'Instagram Audit' },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_SITE_URL}dashboard`,
    cancel_url: `${process.env.NEXT_SITE_URL}`,
    metadata: { audit_request_id: audit.id },
  })

  return NextResponse.json({ url: session.url })
}
