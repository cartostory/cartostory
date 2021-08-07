import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const opts = {
  pg: {
    transact: true,
  },
  schema: {
    headers: {
      required: ['authorization'],
      type: 'object',
      properties: {
        authorization: {
          type: 'string',
        },
      },
    },
  },
};

const handler = async ({ user, ...request }: FastifyRequest, reply: FastifyReply) => {
  try {
    // @ts-ignore
    const userId = user.id;
    // @ts-ignore
    const storyId = request.params.id;
    const params = [userId];
    let query = 'SELECT * FROM cartostory.story WHERE user_id = $1';

    // @ts-ignore
    if (storyId) {
      query += ' AND slug = $2';
      // @ts-ignore
      params.push(request.params.id);
    }

    // @ts-ignore
    const { rows: stories } = await request.pg.query(query, params);

    if (storyId) {
      return { status: 'success', data: { story: stories[0] } };
    }

    return { status: 'success', data: { stories } };
  } catch (e) {
    request.log.error(e);

    reply.code(400);
    return { status: 'error', message: 'stories retrieval failed' };
  }
};

const getStories = async (fastify: FastifyInstance) => {
  fastify.get<{ Headers: { authorization: string } }>(
    '/stories',
    {
      ...opts,
      // @ts-ignore
      preValidation: [fastify.authenticate],
    },
    handler,
  );
};

const getStory = async (fastify: FastifyInstance) => {
  fastify.get<{ Headers: { authorization: string } }>(
    '/stories/:id',
    {
      ...opts,
      // @ts-ignore
      preValidation: [fastify.authenticate],
    },
    handler,
  );
};

export {
  getStories,
  getStory,
};
