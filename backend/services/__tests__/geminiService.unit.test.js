import { jest } from '@jest/globals'
import { askGemini } from '../geminiService.js'

describe('geminiService', () => {
  it('returns fallback message when GEMINI_API_KEY missing', async () => {
    const old = process.env.GEMINI_API_KEY
    delete process.env.GEMINI_API_KEY
    const res = await askGemini('hello')
    expect(typeof res).toBe('string')
    process.env.GEMINI_API_KEY = old
  })
})
