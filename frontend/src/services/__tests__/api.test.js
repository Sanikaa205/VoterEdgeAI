import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '../api.js'

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed JSON for successful GET requests', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, data: [1, 2, 3] })
    })

    const result = await apiClient.get('/api/test')

    expect(result).toEqual({ success: true, data: [1, 2, 3] })
  })

  it('throws wrapped errors for failed POST requests', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ error: 'Bad request' })
    })

    await expect(apiClient.post('/api/test', { hello: 'world' })).rejects.toThrow('API POST Error: Bad request')
  })

  it('rejects invalid response shapes', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(null)
    })

    await expect(apiClient.get('/api/test')).rejects.toThrow('API GET Error: Invalid response format')
  })
})