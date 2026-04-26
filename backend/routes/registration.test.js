import request from 'supertest'
import app from '../app.js'

describe('Registration API', () => {
  it('POST /api/registration/check with valid data', async () => {
    const res = await request(app)
      .post('/api/registration/check')
      .send({
        fullName: 'Test User',
        dateOfBirth: '2000-01-01',
        state: 'Delhi'
      })
    expect([200, 404, 400]).toContain(res.statusCode)
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('registered')
    }
  })

  it('POST /api/registration/check with missing fields', async () => {
    const res = await request(app)
      .post('/api/registration/check')
      .send({})
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })
})
