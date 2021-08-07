/* eslint-disable import/prefer-default-export */
import type { FastifyInstance } from 'fastify';

const opts = {
  pg: {
    transact: true,
  },
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
    body: {
      required: ['slug', 'story'],
      type: 'object',
      properties: {
        slug: {
          type: 'string',
        },
        story: {
          type: 'object',
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
  Body: { slug: string; story: object };
};

export const updateStory = async (fastify: FastifyInstance) => {
  fastify.put<Shape>(
    '/stories/:id',
    {
      ...opts,
      // @ts-ignore
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        // @ts-ignore
        const { rows } = await fastify.pg.query('SELECT user_id FROM cartostory.story WHERE slug = $1', [request.params.id]);

        if (!rows || rows.length === 0) {
          return await reply.code(404).send({ status: 'error', message: 'story was not found' });
        }

        // @ts-ignore
        if (rows[0].user_id !== request.user.id) {
          // @ts-ignore
          return await reply.code(401).send({ status: 'error', message: 'user is not authorized to update the story' });
        }

        const { rows: updated } = await fastify.pg.query('UPDATE cartostory.story SET story = $1 WHERE id = $2 RETURNING id', [request.body.story, request.params.id]);

        // @ts-ignore
        return await reply.code(200).send({ status: 'success', data: { id: updated[0].id } });
      } catch (e) {
        request.log.error(e);

        return reply
          .code(400)
          .send({ status: 'error', message: 'story cannot be saved' });
      }
    },
  );
};
