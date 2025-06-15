import { Redis } from '@upstash/redis'
import axios from 'axios'
import { createClient } from '@/utils/supabase/server'

type Post = { likes: number; comments: number }

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

  const posts: Post[] =
    igData?.recentPosts ||
    igData?.graphql?.user?.edge_owner_to_timeline_media?.edges?.map(
      (e: { node: { edge_liked_by: { count: number }; edge_media_to_comment: { count: number } } }) => ({
        likes: e.node.edge_liked_by.count,
        comments: e.node.edge_media_to_comment.count,
      })
    ) ||
    []
  const followers =
    igData?.followers || igData?.graphql?.user?.edge_followed_by?.count || 0
  const engagementRate =
    posts.length && followers
      ?
          (posts.reduce((sum: number, p: Post) => sum + p.likes + p.comments, 0) /
            posts.length /
            followers) *
          100
      : 0

  let ai
  try {
    ai = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek-ai/r1-0528',
        messages: [
          {
            role: 'user',
            content: JSON.stringify({ igData, goal: request.goal, engagementRate }),
          },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
    )
  } catch {
    ai = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-pro',
        messages: [
          {
            role: 'user',
            content: JSON.stringify({ igData, goal: request.goal, engagementRate }),
          },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
    )
  }

  await supabase
    .from('audit_results')
    .insert({
      request_id: request.id,
      user_id: request.user_id,
      result: { engagementRate, recommendations: ai.data },
    })
  return true
}
