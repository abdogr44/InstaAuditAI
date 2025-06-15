import { describe, it, expect, vi } from 'vitest'
import { processNextJob } from '@/jobs/auditWorker'

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({ lpop: vi.fn().mockResolvedValue(JSON.stringify({ requestId: '1' })) })),
}))

vi.mock('axios', () => ({
  default: { get: vi.fn().mockResolvedValue({ data: { followers: 1 } }), post: vi.fn().mockResolvedValue({ data: 'ai' }) },
}))

vi.mock('@/utils/supabase/server', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '1', handle: 'h', goal: 'g' } }),
      insert: vi.fn().mockResolvedValue({}),
    })),
  }),
}))

describe('audit worker', () => {
  it('processes a job', async () => {
    const ok = await processNextJob()
    expect(ok).toBe(true)
  })
})
