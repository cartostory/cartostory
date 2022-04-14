import type { FastifyInstance } from 'fastify';
import { story } from '../../services/database/index';

const opts = {
  schema: {
    params: {
      required: ['id'],
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
    },
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

type Shape = {
  Params: { id: string };
  Headers: { authorization: string };
};

export const deleteStory = async (fastify: FastifyInstance) => {
  fastify.delete<Shape>(
    '/stories/:id',
    {
      ...opts,
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const slug = request.params.id;
        const found = await story.getUserId(slug);

        if (!found || found.length !== 1) {
          return await reply
            .code(404)
            .send({ status: 'error', message: 'story was not found' });
        }

        if (found[0].user_id !== request.user.id) {
          return await reply.code(401).send({
            status: 'error',
            message: 'user is not authorized to delete the story',
          });
        }

        await story.delete(slug);

        return await reply
          .code(200)
          .send({ status: 'success', message: 'story was deleted' });
      } catch (e) {
        request.log.error(e);

        return reply
          .code(400)
          .send({ status: 'error', message: 'story cannot be deleted' });
      }
    }
  );
};
