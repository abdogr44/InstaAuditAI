import { AuditCard } from './AuditCard'

interface Props {
  results: { id: string; result: Record<string, unknown>; created_at?: string }[]
}

export function AuditList({ results }: Props) {
  if (!results.length) return <p>No audits yet.</p>
  return (
    <div className='space-y-4'>
      {results.map(r => (
        <AuditCard key={r.id} result={r} />
      ))}
    </div>
  )
}
