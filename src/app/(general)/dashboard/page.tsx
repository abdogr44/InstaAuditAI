import { createClient as CreateServerClient } from '@/utils/supabase/server'
import { AuditList } from '@/components/dashboard'

export default async function DashboardPage() {
  const supabase = CreateServerClient({})
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <div className='p-8'>Please login to view your audits.</div>
  }

  const { data } = await supabase
    .from('audit_results')
    .select('id, result, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-4'>Your Audits</h1>
      <AuditList results={data ?? []} />
    </div>
  )
}
