import { server } from '../../app';

describe('sign-up', () => {
  test('does not accept invalid e-mail address', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/auth/sign-up',
      payload: {
        email: 'hello',
        password: 'world',
      },
    });

    const json = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(400);
    expect(json.status).toEqual('error');
    expect(json.message).toEqual('e-mail is not valid');
  });

  test('creates new user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/auth/sign-up',
      payload: {
        email: 'zimmi@localhost.zimmi',
        password: 'zimmi',
      },
    });

    const json = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(200);
    expect(json.status).toEqual('success');
    expect(json.message).toEqual('user succesfully registered');
  });
});
