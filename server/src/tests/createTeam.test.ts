import {describe, it, expect} from 'vitest';
import request from 'supertest'
import {app} from '../index';

describe('POST /team', () => {
    it('rejects request with no auth token', async()=>{
        const res = await request(app)
        .post('/team')
        .send({name: 'Test Team',players: []})
  expect(res.status).toBe(401)
    
    })
    it('creates a team when authenticated with valid data', async () => {
  // Step 1: login
  const loginRes = await request(app)
    .post('/auth/register')  
    .send({ email: `test-${Date.now()}@gmail.com`,username: 'testuser',password: '123456' })

  const token = loginRes.body.token

  // Step 2: use token on POST /team

    const players = [
  { player_id: '0e911203-b345-49b2-bcaf-569b30292ae7', is_captain: true, is_on_bench: false },
  { player_id: '7f1569da-4997-42a0-afbb-f811af9703e6', is_captain: false, is_on_bench: false },
  { player_id: '651d1918-ffe1-4ec2-9f9b-10014bee3219', is_captain: false, is_on_bench: false },
  { player_id: '19b0b382-854f-441b-a3b4-4c5166ce2086', is_captain: false, is_on_bench: false },
  { player_id: '339161f9-9d0d-4a26-9c03-51f5f6a87585', is_captain: false, is_on_bench: false },
  { player_id: '98e654b6-5621-43d7-a8ea-546a800d20f9', is_captain: false, is_on_bench: false },
  { player_id: '1ee9c22f-b97b-4689-89c1-542944da1612', is_captain: false, is_on_bench: false },
  { player_id: '73a2bb20-f3b9-4493-85e0-fe53dc01b197', is_captain: false, is_on_bench: false },
  { player_id: '1c1fa247-4c9b-4cef-9a29-1367cce7c17a', is_captain: false, is_on_bench: false },
  { player_id: '115ef273-b77e-43a1-b483-924c707fb6ec', is_captain: false, is_on_bench: false },
  { player_id: '65a72660-a5aa-4117-b401-2510a62d2182', is_captain: false, is_on_bench: false },
  { player_id: 'b52cd9bb-adc7-401b-b2bf-2159110bd896', is_captain: false, is_on_bench: false },
  { player_id: '70f71f04-cc81-4d6b-bb2f-c4134a19e92f', is_captain: false, is_on_bench: false },
  { player_id: 'a817d2c2-9d69-4b63-bfe5-813e48502ce4', is_captain: false, is_on_bench: false },
  { player_id: '9916166f-4360-4b79-a4a2-eb543cdbc271', is_captain: false, is_on_bench: false },
]
  

  const res = await request(app)
    .post('/team')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Team', players })

  expect(res.status).toBe(201)
 
})
})