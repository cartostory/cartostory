import { createUser } from '../../../scripts/create-user'
import { createStory } from '../../../scripts/create-story'
import { getToken } from '../../../scripts/get-token'
import { server } from '../../app'
import { shutdown } from '../../../scripts/query'
import truncate from '../../../scripts/truncate-tables'

describe('get-story/get-stories', () => {
  let accessToken: string
  let slug: string

  beforeAll(async () => {
    await server.listen(3000, '0.0.0.0')
  })

  afterAll(async () => {
    await shutdown()
    await server.close()
  })

  beforeEach(async () => {
    const email = 'hello@localhost.world'
    const password = 'password'
    await truncate()
    await createUser(email, password)
    const token = await getToken(email, password)
    accessToken = `Bearer ${token.accessToken}`
    const { data } = await createStory(
      'my-first-story',
      { hello: 'world' },
      accessToken,
    )
    slug = data.slug
  })

  it('does not accept anonymous request', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/stories/${slug}`,
    })

    expect(response.statusCode).toEqual(401)
  })

  it('reads story', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/stories/${slug}`,
      headers: {
        authorization: accessToken,
      },
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json().status).toEqual('success')
    expect(response.json().data).toEqual({ story: expect.any(Object) })
  })

  it('reads all stories', async () => {
    await createStory('my-first-story', { hello: 'world' }, accessToken)

    const response = await server.inject({
      method: 'GET',
      url: '/stories',
      headers: {
        authorization: accessToken,
      },
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json().status).toEqual('success')
    expect(response.json().data).toEqual({ stories: expect.any(Array) })
    expect(response.json().data.stories).toHaveLength(2)
  })
})
