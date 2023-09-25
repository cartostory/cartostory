import { v4 as uuidv4 } from 'uuid'
import { setup } from '../../app'
import query, { shutdown } from '../../../scripts/query'
import { generateHash } from './components/utils'
import truncate from '../../../scripts/truncate-tables'
import type { FastifyInstance } from 'fastify'

const verificationCode = 'verification-code'
const email = 'hello@localhost.world'
const hash = async () => generateHash('world')
let server: FastifyInstance

describe('verify', () => {
  beforeAll(async () => {
    server = await setup()
    await server.listen({ port: 3000, host: '0.0.0.0' })
  })

  beforeEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await server.close()
    await shutdown()
  })

  it('does not verify user when invalid userId uuid is sent', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/auth/verification/userId/verificationCode',
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual('user verification failed')
  })

  it('does not verify user when not found', async () => {
    const userId = uuidv4()

    const response = await server.inject({
      method: 'GET',
      url: `/auth/verification/${userId}/verificationCode`,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual('user not found')
  })

  it('does not verify already verified user', async () => {
    const { rows: users } = await query(
      'INSERT INTO "user" (email, display_name, password, status) VALUES ($1, $1, $2, $3) RETURNING id',
      [email, await hash(), 'verified'],
    )
    const { id: userId } = users[0]
    await query(
      'INSERT INTO user_verification_code (user_id, verification_code) VALUES ($1, $2)',
      [userId, verificationCode],
    )

    const response = await server.inject({
      method: 'GET',
      url: `/auth/verification/${userId}/${verificationCode}`,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual('user already verified')
  })

  it('does not verify user with expired verification code', async () => {
    const { rows: users } = await query(
      'INSERT INTO "user" (email, display_name, password, status) VALUES ($1, $1, $2, $3) RETURNING id',
      [email, await hash(), 'verified'],
    )
    const { id: userId } = users[0]
    await query(
      'INSERT INTO user_verification_code (user_id, verification_code, expires_at) VALUES ($1, $2, $3)',
      [userId, verificationCode, '2015-01-01'],
    )

    const response = await server.inject({
      method: 'GET',
      url: `/auth/verification/${userId}/${verificationCode}`,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual('user not found')
  })

  it('verifies user', async () => {
    const { rows: users } = await query(
      'INSERT INTO "user" (email, display_name, password) VALUES ($1, $1, $2) RETURNING id',
      [email, await hash()],
    )
    const { id: userId } = users[0]
    await query(
      'INSERT INTO user_verification_code (user_id, verification_code) VALUES ($1, $2)',
      [userId, verificationCode],
    )

    const response = await server.inject({
      method: 'GET',
      url: `/auth/verification/${userId}/${verificationCode}`,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(200)
    expect(json.message).toEqual('user verified')
  })
})
