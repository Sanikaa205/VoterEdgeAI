import request from 'supertest'
import app from '../app.js'

describe('Candidates API', () => {
  it('GET /api/candidates returns all candidates', async () => {
    const res = await request(app).get('/api/candidates')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/candidates/:id returns a candidate by ID', async () => {
    const res = await request(app).get('/api/candidates/1')
    expect([200, 404]).toContain(res.statusCode)
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('id', 1)
    }
  })

  it('GET /api/candidates/search/state/:state returns candidates by state', async () => {
    const res = await request(app).get('/api/candidates/search/state/Delhi')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/candidates/search/party/:party returns candidates by party', async () => {
    const res = await request(app).get('/api/candidates/search/party/Independent')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
