interface Props {
  result: { id: string; result: Record<string, unknown>; created_at?: string }
}

export function AuditCard({ result }: Props) {
  return (
    <div className='border rounded p-4 shadow bg-white'>
      <div className='text-sm text-gray-500'>{result.created_at}</div>
      <pre className='whitespace-pre-wrap'>{JSON.stringify(result.result, null, 2)}</pre>
    </div>
  )
}
