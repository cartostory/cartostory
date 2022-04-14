import { createUser } from '../../../scripts/create-user';
import { getToken } from '../../../scripts/get-token';
import truncate from '../../../scripts/truncate-tables';
import { shutdown } from '../../../scripts/query';
import { server } from '../../app';

describe('create-story', () => {
  beforeEach(truncate);

  afterAll(shutdown);

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
    });

    expect(response.statusCode).toEqual(401);
  });

  it('creates new story', async () => {
    const email = 'hello@localhost.world';
    const password = 'password';

    try {
      await server.listen(3000, '0.0.0.0');
      await createUser(email, password);
      const { accessToken } = await getToken(email, password);

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
      });

      const json = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(json.status).toEqual('success');
      expect(json.data).toEqual({
        id: expect.any(String),
        slug: expect.stringContaining('my-first-story'),
      });

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
      });

      const duplicateJson = JSON.parse(duplicateResponse.payload);

      expect(duplicateResponse.statusCode).toEqual(200);
      expect(duplicateJson.status).toEqual('success');
      expect(duplicateJson.data).toEqual({
        id: expect.any(String),
        slug: expect.stringContaining('my-first-story'),
      });
    } finally {
      await server.close();
    }
  });
});
