import { jest } from '@jest/globals'
import { getAllCandidates, getCandidateById, getCandidatesByState, getCandidatesByParty } from '../candidateController.js'

function mockRes() {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('candidateController unit tests', () => {
  it('getAllCandidates returns array', () => {
    const req = { query: {} }
    const res = mockRes()
    getAllCandidates(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(Array.isArray(res.json.mock.calls[0][0])).toBe(true)
  })

  it('getCandidateById returns candidate object for valid id', () => {
    const req = { params: { id: '1' } }
    const res = mockRes()
    getCandidateById(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(typeof res.json.mock.calls[0][0]).toBe('object')
    expect(res.json.mock.calls[0][0]).toHaveProperty('id', 1)
  })

  it('getCandidateById returns 400 for invalid id', () => {
    const req = { params: { id: 'abc' } }
    const res = mockRes()
    getCandidateById(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('getCandidatesByState returns array (may be empty)', () => {
    const req = { params: { state: 'Maharashtra' } }
    const res = mockRes()
    getCandidatesByState(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(Array.isArray(res.json.mock.calls[0][0])).toBe(true)
  })

  it('getCandidatesByParty returns array (may be empty)', () => {
    const req = { params: { party: 'Independent' } }
    const res = mockRes()
    getCandidatesByParty(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(Array.isArray(res.json.mock.calls[0][0])).toBe(true)
  })
})
