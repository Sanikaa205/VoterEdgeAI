import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validateVoterId,
  sanitizeText,
  validateState,
  validateName
} from './validation'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.user@domain.co.in')).toBe(true)
    })

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid.email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
    })

    it('should handle non-string inputs', () => {
      expect(validateEmail(null)).toBe(false)
      expect(validateEmail(undefined)).toBe(false)
    })
  })

  describe('validateName', () => {
    it('should validate names with 2-100 characters', () => {
      expect(validateName('Raj Kumar')).toBe(true)
      expect(validateName('AB')).toBe(true)
    })

    it('should reject names outside length range', () => {
      expect(validateName('A')).toBe(false)
      expect(validateName('A'.repeat(101))).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateName('  Valid Name  ')).toBe(true)
      expect(validateName('')).toBe(false)
    })
  })

  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('script>alertxss/script>')
      expect(sanitizeText('Safe text')).toBe('Safe text')
    })

    it('should trim whitespace', () => {
      expect(sanitizeText('  test  ')).toBe('test')
    })

    it('should limit length to 500 characters', () => {
      const longText = 'a'.repeat(600)
      const result = sanitizeText(longText)
      expect(result.length).toBe(500)
    })

    it('should handle non-string inputs', () => {
      expect(sanitizeText(null)).toBe('')
      expect(sanitizeText(undefined)).toBe('')
    })
  })

  describe('validateState', () => {
    it('should validate correct Indian states', () => {
      expect(validateState('Maharashtra')).toBe(true)
      expect(validateState('Gujarat')).toBe(true)
      expect(validateState('Delhi')).toBe(true)
    })

    it('should reject invalid states', () => {
      expect(validateState('Invalid State')).toBe(false)
      expect(validateState('USA')).toBe(false)
    })

    it('should handle whitespace', () => {
      expect(validateState('  Maharashtra  ')).toBe(true)
    })
  })

  describe('validateVoterId', () => {
    it('should validate correct voter ID format', () => {
      // Format: 10 digits + 1 uppercase letter + 4 digits
      expect(validateVoterId('1234567890A1234')).toBe(true)
      expect(validateVoterId('9876543210Z9999')).toBe(true)
    })

    it('should reject invalid formats', () => {
      expect(validateVoterId('123456789')).toBe(false) // Too short
      expect(validateVoterId('12345678901A234')).toBe(false) // Invalid format
      expect(validateVoterId('1234567890a1234')).toBe(false) // Lowercase letter
    })

    it('should handle whitespace', () => {
      expect(validateVoterId('  1234567890A1234  ')).toBe(true)
    })
  })
})
