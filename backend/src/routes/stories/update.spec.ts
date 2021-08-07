import { createUser } from '../../../scripts/create-user';
import { createStory } from '../../../scripts/create-story';
import { getToken } from '../../../scripts/get-token';
import { server } from '../../app';
import truncate from '../../../scripts/truncate-tables';

describe('update-story', () => {
  let accessToken: string;
  let slug: string;

  beforeAll(async () => {
    await server.listen(3000, '0.0.0.0');
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    const email = 'hello@localhost.world';
    const password = 'password';
    await truncate();
    await createUser(email, password);
    const token = (await getToken(email, password));
    accessToken = `Bearer ${token.accessToken}`;
    const { data } = await createStory('my-first-story', { hello: 'world' }, accessToken);
    slug = data.slug;
  });

  it('does not accept anonymous request', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: `/stories/${slug}`,
      payload: {
        story: {
          goodbye: 'earth',
        },
      },
    });

    expect(response.statusCode).toEqual(401);
  });

  it('updates story', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: `/stories/${slug}`,
      headers: {
        authorization: accessToken,
      },
      payload: {
        story: {
          goodbye: 'earth',
        },
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json().status).toEqual('success');
  });

  it('does not update other user\'s story', async () => {
    const email = 'anotheruser@localhost.world';
    const password = 'password';
    await createUser(email, password);
    const token = (await getToken(email, password));
    const anotherAccessToken = `Bearer ${token.accessToken}`;
    const { data } = await createStory('my-first-story', { hello: 'world' }, anotherAccessToken);

    const response = await server.inject({
      method: 'PUT',
      url: `/stories/${data.slug}`,
      headers: {
        authorization: accessToken,
      },
      payload: {
        story: {
          goodbye: 'earth',
        },
      },
    });

    expect(response.statusCode).toEqual(401);
    expect(response.json().status).toEqual('error');
    expect(response.json().message).toEqual('user is not authorized to update the story');
  });
});
