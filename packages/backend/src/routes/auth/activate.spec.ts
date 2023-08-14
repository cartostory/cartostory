import { v4 as uuidv4 } from 'uuid'
import { setup } from '../../app'
import query, { shutdown } from '../../../scripts/query'
import { generateHash } from './components/utils'
import truncate from '../../../scripts/truncate-tables'
import type { FastifyInstance } from 'fastify'

const activationCode = 'activation-code'
const email = 'hello@localhost.world'
const hash = async () => generateHash('world')
let server: FastifyInstance

describe('activate', () => {
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

  it('does not activate user when invalid userId uuid is sent', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/auth/activate/userId/activationCode',
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual('user activation failed')
  })

  it('does not activate user when not found', async () => {
    const userId = uuidv4()

    const response = await server.inject({
      method: 'GET',
      url: `/auth/activate/${userId}/activationCode`,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual('user cannot be activated')
  })

  it('does not activate already active user', async () => {
    const { rows: users } = await query(
      'INSERT INTO "user" (email, display_name, password, status) VALUES ($1, $1, $2, $3) RETURNING id',
      [email, await hash(), 'verified'],
    )
    const { id: userId } = users[0]
    await query(
      'INSERT INTO user_activation_code (user_id, activation_code) VALUES ($1, $2)',
      [userId, activationCode],
    )

    const response = await server.inject({
      method: 'GET',
      url: `/auth/activate/${userId}/${activationCode}`,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual('user cannot be activated')
  })

  it('does not activate user with expired activation code', async () => {
    const { rows: users } = await query(
      'INSERT INTO "user" (email, display_name, password, status) VALUES ($1, $1, $2, $3) RETURNING id',
      [email, await hash(), 'verified'],
    )
    const { id: userId } = users[0]
    await query(
      'INSERT INTO user_activation_code (user_id, activation_code, valid_until_date) VALUES ($1, $2, $3)',
      [userId, activationCode, '2015-01-01'],
    )

    const response = await server.inject({
      method: 'GET',
      url: `/auth/activate/${userId}/${activationCode}`,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual('user cannot be activated')
  })

  it('activates user', async () => {
    const { rows: users } = await query(
      'INSERT INTO "user" (email, display_name, password) VALUES ($1, $1, $2) RETURNING id',
      [email, await hash()],
    )
    const { id: userId } = users[0]
    await query(
      'INSERT INTO user_activation_code (user_id, activation_code) VALUES ($1, $2)',
      [userId, activationCode],
    )

    const response = await server.inject({
      method: 'GET',
      url: `/auth/activate/${userId}/${activationCode}`,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(200)
    expect(json.message).toEqual('user activated')
  })
})
