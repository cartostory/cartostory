import { server } from '../../app';
import truncate from '../../../scripts/truncate-tables';

describe('sign-up', () => {
  beforeEach(async () => {
    await truncate();
  });

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
        email: 'hello@localhost.world',
        password: 'world',
      },
    });

    const json = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(200);
    expect(json.status).toEqual('success');
    expect(json.message).toEqual('user succesfully registered');
  });

  test('pretends to create a new user twice and does not return an error', async () => {
    const inject = async () => server.inject({
      method: 'POST',
      url: '/auth/sign-up',
      payload: {
        email: 'duplicate@localhost.world',
        password: 'world',
      },
    });

    const response = await inject();

    expect(response.statusCode).toEqual(200);

    const anotherResponse = await inject();

    expect(anotherResponse.statusCode).toEqual(200);
  });
});
