import Stripe from 'stripe'

const secret = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy'
export const stripe = new Stripe(secret, { apiVersion: '2024-09-30.acacia' })
