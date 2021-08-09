/* eslint-disable import/prefer-default-export */
import type { FastifyInstance } from 'fastify';

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
        const { rows } = await fastify.pg.query('SELECT user_id FROM cartostory.story WHERE slug = $1', [request.params.id]);

        if (!rows || rows.length === 0) {
          return await reply.code(404).send({ status: 'error', message: 'story was not found' });
        }

        if (rows[0].user_id !== request.user.id) {
          return await reply.code(401).send({ status: 'error', message: 'user is not authorized to delete the story' });
        }

        await fastify.pg.query('DELETE FROM cartostory.story WHERE slug = $1', [request.params.id]);

        return await reply.code(200).send({ status: 'success', message: 'story was deleted' });
      } catch (e) {
        console.log('******', e);
        request.log.error(e);

        return reply
          .code(400)
          .send({ status: 'error', message: 'story cannot be deleted' });
      }
    },
  );
};
