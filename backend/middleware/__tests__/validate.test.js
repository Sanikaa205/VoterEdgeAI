import { jest } from '@jest/globals'
import { validate, sanitizeString, validateEmail, validateVoterId } from '../validate.js'

function mockRes() {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('validate middleware', () => {
  it('sanitizes strings', () => {
    expect(sanitizeString('  <b>Hello</b>  ')).toBe('bHello/b')
  })

  it('validates email format', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('bad-email')).toBe(false)
  })

  it('validates voter id format', () => {
    expect(validateVoterId('1234567890A1234')).toBe(true)
    expect(validateVoterId('123')).toBe(false)
  })

  it('returns 400 when fields are missing', () => {
    const req = { body: {} }
    const res = mockRes()
    const next = jest.fn()

    validate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  it('sanitizes and passes valid requests', () => {
    const req = { body: { name: '  Test User  ', email: 'TEST@EXAMPLE.COM', voterId: '1234567890A1234' } }
    const res = mockRes()
    const next = jest.fn()

    validate(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.body.name).toBe('Test User')
    expect(req.body.email).toBe('test@example.com')
    expect(req.body.voterId).toBe('1234567890A1234')
  })
})
