'use client'

import { useState } from 'react'

export function HeroForm() {
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('')
  const [niche, setNiche] = useState('')
  const [goal, setGoal] = useState('')
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, email, niche, goal }),
    })
  }

  return (
    <form onSubmit={onSubmit} className='mt-6 flex flex-col items-center gap-4'>
      <input
        aria-label='Instagram Handle'
        placeholder='@handle'
        value={handle}
        onChange={e => setHandle(e.target.value)}
        className='px-3 py-2 border rounded w-64'
      />
      <input
        aria-label='Email'
        placeholder='you@example.com'
        value={email}
        onChange={e => setEmail(e.target.value)}
        className='px-3 py-2 border rounded w-64'
      />
      <input
        aria-label='Niche'
        placeholder='Fashion, Tech, etc.'
        value={niche}
        onChange={e => setNiche(e.target.value)}
        className='px-3 py-2 border rounded w-64'
      />
      <input
        aria-label='Goal'
        placeholder='Grow followers, sales...'
        value={goal}
        onChange={e => setGoal(e.target.value)}
        className='px-3 py-2 border rounded w-64'
      />
      <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded'>
        Submit
      </button>
    </form>
  )
}
