import { render, screen, fireEvent } from '@testing-library/react'
import { HeroForm } from '@/components/home/HeroForm'
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/image', () => ({ __esModule: true, default: (props: any) => <img {...props} /> }))

describe('HeroForm', () => {
  it('submits handle, email, niche and goal', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }))
    global.fetch = fetchMock as any
    render(<HeroForm />)
    fireEvent.change(screen.getByLabelText(/Instagram Handle/i), { target: { value: '@test' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/Niche/i), { target: { value: 'Tech' } })
    fireEvent.change(screen.getByLabelText(/Goal/i), { target: { value: 'Growth' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(fetchMock).toHaveBeenCalledWith('/api/stripe/create-checkout-session', expect.objectContaining({ method: 'POST' }))
  })
})
