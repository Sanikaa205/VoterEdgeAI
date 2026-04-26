import { describe, it, expect } from 'vitest'
import { formatDate, isEligibleToVote, sanitizeInput } from './helpers'

describe('helpers.js', () => {
  describe('formatDate', () => {
    it('should format ISO date string to "DD Month YYYY" format', () => {
      const result = formatDate('2026-04-26')
      expect(result).toMatch(/^\d{1,2} \w+ \d{4}$/)
    })

    it('should return correct date for April 26, 2026', () => {
      const result = formatDate('2026-04-26')
      expect(result).toContain('26')
      expect(result).toContain('April')
      expect(result).toContain('2026')
    })

    it('should handle ISO datetime strings', () => {
      const result = formatDate('2026-04-26T07:13:16.535Z')
      expect(result).toContain('26')
      expect(result).toContain('April')
      expect(result).toContain('2026')
    })

    it('should return empty string for invalid input', () => {
      const result = formatDate(null)
      expect(result).toBe('')
    })

    it('should return empty string for undefined', () => {
      const result = formatDate(undefined)
      expect(result).toBe('')
    })
  })

  describe('isEligibleToVote', () => {
    it('should return true for age 18', () => {
      expect(isEligibleToVote(18)).toBe(true)
    })

    it('should return true for age greater than 18', () => {
      expect(isEligibleToVote(25)).toBe(true)
      expect(isEligibleToVote(65)).toBe(true)
      expect(isEligibleToVote(100)).toBe(true)
    })

    it('should return false for age less than 18', () => {
      expect(isEligibleToVote(17)).toBe(false)
      expect(isEligibleToVote(10)).toBe(false)
      expect(isEligibleToVote(0)).toBe(false)
    })

    it('should return false for negative age', () => {
      expect(isEligibleToVote(-5)).toBe(false)
    })

    it('should return false for non-numeric input', () => {
      expect(isEligibleToVote('18')).toBe(false)
      expect(isEligibleToVote(null)).toBe(false)
      expect(isEligibleToVote(undefined)).toBe(false)
    })
  })

  describe('sanitizeInput', () => {
    it('should remove script tags and content', () => {
      const result = sanitizeInput('<script>alert("xss")</script>Hello')
      expect(result).toBe('Hello')
      expect(result).not.toContain('script')
      expect(result).not.toContain('alert')
    })

    it('should remove multiple script tags', () => {
      const result = sanitizeInput(
        '<script>bad();</script>Safe<script>worse();</script>'
      )
      expect(result).toBe('Safe')
    })

    it('should remove HTML tags', () => {
      const result = sanitizeInput('<div><b>Hello</b></div>')
      expect(result).toBe('Hello')
    })

    it('should trim whitespace', () => {
      const result = sanitizeInput('   Hello World   ')
      expect(result).toBe('Hello World')
    })

    it('should handle nested tags', () => {
      const result = sanitizeInput(
        '<div><script>alert(1)</script><p>Safe</p></div>'
      )
      expect(result).toBe('Safe')
    })

    it('should return empty string for null or undefined', () => {
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
    })

    it('should return empty string for non-string input', () => {
      expect(sanitizeInput(123)).toBe('')
      expect(sanitizeInput({})).toBe('')
    })

    it('should preserve plain text', () => {
      const result = sanitizeInput('Hello World')
      expect(result).toBe('Hello World')
    })

    it('should handle XSS attempts with event handlers', () => {
      const result = sanitizeInput(
        '<img src="x" onerror="alert(\'xss\')">'
      )
      expect(result).not.toContain('onerror')
      expect(result).not.toContain('script')
    })
  })
})
