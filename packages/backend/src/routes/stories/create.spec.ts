import { createUser } from '../../../scripts/create-user'
import { getToken } from '../../../scripts/get-token'
import truncate from '../../../scripts/truncate-tables'
import { shutdown } from '../../../scripts/query'
import { setup } from '../../app'
import type { FastifyInstance } from 'fastify'

let server: FastifyInstance

describe('create-story', () => {
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

  it('does not accept anonymous request', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/stories',
      payload: {
        slug: 'my-first-story',
        story: {
          text: 'story text',
        },
      },
    })

    expect(response.statusCode).toEqual(401)
  })

  it('creates new story', async () => {
    const email = 'hello@localhost.world'
    const password = 'password'

    try {
      await createUser(email, password)
      const { accessToken } = await getToken(email, password)

      const response = await server.inject({
        method: 'POST',
        url: '/stories',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          slug: 'my-first-story',
          story: {
            text: 'story text',
          },
        },
      })

      const json = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(json.status).toEqual('success')
      expect(json.data).toEqual({
        id: expect.any(String),
        slug: expect.stringContaining('my-first-story'),
      })

      const duplicateResponse = await server.inject({
        method: 'POST',
        url: '/stories',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          slug: 'my-first-story',
          story: {
            text: 'story text',
          },
        },
      })

      const duplicateJson = JSON.parse(duplicateResponse.payload)

      expect(duplicateResponse.statusCode).toEqual(200)
      expect(duplicateJson.status).toEqual('success')
      expect(duplicateJson.data).toEqual({
        id: expect.any(String),
        slug: expect.stringContaining('my-first-story'),
      })
    } finally {
      await server.close()
    }
  })
})
