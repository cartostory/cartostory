import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { story } from '../../services/database/index';
import { Story } from '../../services/database/types';

const opts = {
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
    let result: Story | Array<Story>;

    if (storyId) {
      result = await story.readOne(userId, storyId);

      return { status: 'success', data: { story: result } };
    }

    result = await story.readAll(userId);

    return { status: 'success', data: { stories: result } };
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
