import superagent from 'superagent';
import { advanceBy } from 'jest-date-mock';
import { server } from '../../app';
import truncate from '../../../scripts/truncate-tables';
import { createUser } from '../../../scripts/create-user';

describe('refresh-token', () => {
  beforeEach(async () => {
    truncate();
  });

  it('denies to refresh invalid token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/auth/refresh-token',
      headers: {
        authorization: 'Bearer invalid-token',
      },
      payload: {
        refreshToken: 'Bearer invalid-token',
      },
    });

    expect(response.statusCode).toEqual(401);
  });

  it('refreshes valid token and denies to refresh expired token', async () => {
    const email = 'hello@localhost.world';
    const password = 'world';
    await createUser(email, password);

    let refreshToken: string = 'Bearer ';
    let accessToken: string = 'Bearer ';

    try {
      await server.listen(3000, '0.0.0.0');
      const { body: { data } } = await superagent
        .post('0.0.0.0:3000/auth/sign-in')
        .send({ email, password: 'world' });

      accessToken += data.accessToken;
      refreshToken += data.refreshToken;

      const response = await server.inject({
        method: 'POST',
        url: '/auth/refresh-token',
        headers: {
          authorization: accessToken,
        },
        payload: {
          refreshToken,
        },
      });

      const json = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(json.data).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });

      advanceBy(7 * 24 * 60 * 60 * 1000);

      const expiredResponse = await server.inject({
        method: 'POST',
        url: '/auth/refresh-token',
        headers: {
          authorization: accessToken,
        },
        payload: {
          refreshToken,
        },
      });

      const expiredJson = JSON.parse(expiredResponse.payload);

      expect(expiredResponse.statusCode).toEqual(401);
      expect(expiredJson.message).toEqual('Authorization token expired');
    } finally {
      await server.close();
    }
  });
});
