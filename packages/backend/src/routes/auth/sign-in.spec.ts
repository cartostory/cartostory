import { setup } from '../../app'
import truncate from '../../../scripts/truncate-tables'
import { shutdown } from '../../../scripts/query'
import { createUser } from '../../../scripts/create-user'
import type { FastifyInstance } from 'fastify'
import {
  BadPasswordError,
  InvalidEmailError,
  UserNotFoundError,
} from '../../api/user/errors'

const email = 'hello@localhost.world'
const password = 'world'
let server: FastifyInstance
const inject = async (
  payload: object,
): Promise<ReturnType<typeof server.inject>> =>
  server.inject({
    method: 'POST',
    url: '/auth/sign-in',
    payload,
  })

describe('sign-in', () => {
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

  test('does not accept invalid e-mail address', async () => {
    const response = await inject({
      email: 'hello',
      password: 'world',
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(422)
    expect(json.message).toEqual(new InvalidEmailError().message)
  })

  test('does not login when user is not found', async () => {
    const response = await inject({
      email: 'hello@localhost.world',
      password: 'world',
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(400)
    expect(json.message).toEqual(new UserNotFoundError().message)
  })

  test('does not login when passwords do not match', async () => {
    await createUser(email, password)

    const response = await inject({
      email,
      password: 'foo',
    })

    const json = JSON.parse(response.payload)
    console.log(JSON.stringify(json))

    expect(response.statusCode).toEqual(401)
    expect(json.message).toEqual(new BadPasswordError().message)
  })

  test('logs in', async () => {
    await createUser(email, password)

    const response = await inject({
      email,
      password,
    })

    const json = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(200)
    expect(json).toEqual({
      status: 'success',
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    })
  })
})
