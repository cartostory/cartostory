import { server } from '../../app';
import query from '../../../scripts/query';
import truncate from '../../../scripts/truncate-tables';
import { generateHash } from './components/utils';

const inject = async (payload: object): Promise<ReturnType<typeof server.inject>> => server.inject({
  method: 'POST',
  url: '/auth/sign-in',
  payload,
});

describe('sign-in', () => {
  beforeEach(async () => {
    await truncate();
  });

  test('does not accept invalid e-mail address', async () => {
    const response = await inject({
      email: 'hello',
      password: 'world',
    });

    const json = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(400);
    expect(json.message).toEqual('e-mail is not valid');
  });

  test('does not login when user is not found', async () => {
    const response = await inject({
      email: 'hello@localhost.world',
      password: 'world',
    });

    const json = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(400);
    expect(json.message).toEqual('user cannot log in');
  });

  test('does not log in when passwords do not match', async () => {
    const email = 'hello@localhost.world';
    const hash = await generateHash('world');

    await query('INSERT INTO "user" (email, display_name, password) VALUES ($1, $1, $2)', [email, hash]);

    const response = await inject({
      email: 'hello@localhost.world',
      password: 'foo',
    });

    const json = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(401);
    expect(json.message).toEqual('wrong password');
  });

  test('logs in', async () => {
    const email = 'hello@localhost.world';
    const hash = await generateHash('world');

    await query('INSERT INTO "user" (email, display_name, password) VALUES ($1, $1, $2)', [email, hash]);

    const response = await inject({
      email: 'hello@localhost.world',
      password: 'world',
    });

    const json = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(200);
    expect(json).toEqual({
      status: 'success',
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    });
  });
});
