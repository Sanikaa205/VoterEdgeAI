import { jest } from '@jest/globals'
import { checkRegistration, getRegistrationStatus, registerVoter } from '../registrationController.js'

function mockRes() {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('registrationController unit tests', () => {
  it('checkRegistration returns isRegistered false for unknown user', () => {
    const req = { body: { fullName: 'Nobody Here', dateOfBirth: '1970-01-01', state: 'Nowhere' } }
    const res = mockRes()
    checkRegistration(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    const body = res.json.mock.calls[0][0]
    expect(body).toHaveProperty('isRegistered')
    expect(body.registered).toBe(false)
  })

  it('getRegistrationStatus returns 404 for missing voter id', () => {
    const req = { params: { voterId: 'NONEXISTENT' } }
    const res = mockRes()
    getRegistrationStatus(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('registerVoter creates a new voter', () => {
    const payload = { firstName: 'Test', lastName: 'User', email: 't@test.com', voterId: `TS${Date.now()}`, state: 'Karnataka', dateOfBirth: '1990-01-01' }
    const req = { body: payload }
    const res = mockRes()
    registerVoter(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    const body = res.json.mock.calls[0][0]
    expect(body).toHaveProperty('data')
    expect(body.data).toHaveProperty('voterId', payload.voterId)
  })
})
