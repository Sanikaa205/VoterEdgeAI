import request from 'supertest'
import app from '../app.js'

describe('Health API', () => {
  it('GET /api/health returns status OK', async () => {
    const res = await request(app).get('/api/health')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('status', 'OK')
    expect(res.body).toHaveProperty('timestamp')
  })
})
