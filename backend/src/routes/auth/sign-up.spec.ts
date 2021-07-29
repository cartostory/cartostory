import { server } from '../../app';

describe('sign-up', () => {
  test('', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/hello',
    });

    expect(response.statusCode).toEqual(200);
  });
});
