import { describe, it, expect, vi } from 'vitest'
import { processNextJob } from '@/jobs/auditWorker'

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({ lpop: vi.fn().mockResolvedValue(JSON.stringify({ requestId: '1' })) })),
}))
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: { followers: 100, recentPosts: [{ likes: 20, comments: 5 }, { likes: 30, comments: 10 }] },
    }),
    post: vi.fn().mockResolvedValue({ data: 'ai' }),
  },
}))

const insertMock = vi.fn().mockResolvedValue({})
vi.mock('@/utils/supabase/server', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '1', handle: 'h', goal: 'g', user_id: 'u1' } }),
      insert: insertMock,
    })),
  }),
}))

describe('audit worker', () => {
  it('processes a job', async () => {
    const ok = await processNextJob()
    expect(ok).toBe(true)
    expect(insertMock).toHaveBeenCalled()
  })
})
