import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest'
import { ApiKeysTable } from './ApiKeysTable'

const mockData = {
  data: [
    { id: '1', name: 'Key One', key: 'sk_1', status: 'Active', createdAt: '2024-01-01T00:00:00Z' },
  ],
}

describe('ApiKeysTable', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders loading then data rows', async () => {
    // @ts-ignore
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData })

    render(<ApiKeysTable />)

    // Loading skeleton present
    expect(screen.getByText(/API Keys/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Key One')).toBeInTheDocument()
    })
  })

  it('shows empty state when no keys', async () => {
    // @ts-ignore
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })

    render(<ApiKeysTable />)

    await waitFor(() => {
      expect(screen.getByText(/No API keys/i)).toBeInTheDocument()
    })
  })

  it('shows error state on fetch failure', async () => {
    // @ts-ignore
    fetch.mockResolvedValueOnce({ ok: false, status: 500 })

    render(<ApiKeysTable />)

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    })
  })
})
