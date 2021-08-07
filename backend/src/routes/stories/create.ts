/* eslint-disable import/prefer-default-export */
import type { FastifyInstance } from 'fastify';
import { generateRandomCode } from '../auth/components/utils';

const opts = {
  pg: {
    transact: true,
  },
  schema: {
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

export const createStory = async (fastify: FastifyInstance) => {
  fastify.post<{ Headers: { authorization: string }, Body: { slug: string; story: object } }>(
    '/stories',
    {
      ...opts,
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const params = [`${request.body.slug}-${generateRandomCode(6)}`, request.user.id, request.body.story];
      try {
        const { rows } = await fastify.pg.query('INSERT INTO cartostory.story (slug, user_id, story) VALUES ($1, $2, $3) RETURNING id, slug', params);
        const { id, slug } = rows[0];

        return await reply.code(200).send({ status: 'success', data: { id, slug } });
      } catch (e) {
        request.log.error(e);

        reply.code(400);
        return reply.send({ status: 'error', message: 'story cannot be saved' });
      }
    },
  );
};
