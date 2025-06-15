import { Redis } from '@upstash/redis'
import axios from 'axios'
import { createClient } from '@/utils/supabase/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function processNextJob() {
  const job = await redis.lpop<string>('audit-queue')
  if (!job) return false
  const { requestId } = JSON.parse(job) as { requestId: string }
  const supabase = createClient({ isServiceWorker: true })
  const { data: request } = await supabase
    .from('audit_requests')
    .select('id, handle, niche, goal, user_id')
    .eq('id', requestId)
    .single()
  if (!request) return false

  const igData = await axios
    .get('https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync', {
      params: { username: request.handle, token: process.env.APIFY_TOKEN },
    })
    .then(r => r.data)

  const ai = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'mistral/mistral-tiny',
      messages: [{ role: 'user', content: JSON.stringify({ igData, goal: request.goal }) }],
    },
    { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
  )

  await supabase.from('audit_results').insert({ request_id: request.id, user_id: request.user_id, result: ai.data })
  return true
}
