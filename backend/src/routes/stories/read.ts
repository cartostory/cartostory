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

const routeParams = {
  required: ['id'],
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
};

const handler = async ({ user, ...request }: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id: userId } = user;
    // @ts-ignore
    const { id: storyId } = request.params;
    const params = [userId];
    let query = 'SELECT * FROM cartostory.story WHERE user_id = $1';

    if (storyId) {
      query += ' AND slug = $2';
      params.push(storyId);
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

const getStoriesOpts = {
  ...opts,
  schema: {
    ...opts.schema,
    routeParams,
  },
};

const getStories = async (fastify: FastifyInstance) => {
  fastify.get<{ Headers: { authorization: string } }>(
    '/stories',
    {
      ...getStoriesOpts,
      preValidation: [fastify.authenticate],
    },
    handler,
  );
};

const getStory = async (fastify: FastifyInstance) => {
  fastify.get<{ Headers: { authorization: string }; Params: { id: string } }>(
    '/stories/:id',
    {
      ...opts,
      preValidation: [fastify.authenticate],
    },
    handler,
  );
};

export {
  getStories,
  getStory,
};
