import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/stripe/create-checkout-session/route'

vi.mock('@/utils/supabase/server', () => ({
  createClient: () => ({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }) },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { stripe_customer_id: 'cus_123', name: 'Test' } }),
      update: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 'req1' } }) }) }),
    })),
  }),
}))

vi.mock('@/lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: vi.fn().mockResolvedValue({ url: 'test-url' }) } }, customers: { create: vi.fn().mockResolvedValue({ id: 'cus_new' }) } }
}))

describe('create-checkout-session API', () => {
  it('creates session', async () => {
    const req = new Request('http://test', { method: 'POST', body: JSON.stringify({ handle: '@t', email: 'e', niche: 'n', goal: 'g' }) })
    const res = await POST(req)
    const data = await res.json()
    expect(data.url).toBe('test-url')
  })
})
