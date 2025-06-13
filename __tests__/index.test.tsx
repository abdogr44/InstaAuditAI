import { render, screen } from '@testing-library/react'
import { Banner } from '@/components/home/Banner'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/image', () => ({ __esModule: true, default: (props: any) => {
  return <img {...props} />
}}))

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

describe('Home page', () => {
  it('renders heading', () => {
    render(<Banner />)
    expect(screen.getByRole('heading', { name: /Fix Your Instagram in 10 Minutes/i })).toBeInTheDocument()
  })
})
