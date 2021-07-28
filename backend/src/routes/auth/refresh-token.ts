import type { FastifyInstance } from 'fastify';

const opts = {
  schema: {
    headers: {
      additionalProperties: false,
      required: ['authorization'],
      type: 'object',
      properties: {
        authorization: {
          type: 'string',
        },
      },
    },
    body: {
      additionalProperties: false,
      required: ['refreshToken'],
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
        },
      },
    },
  },
};

const refreshToken = async (fastify: FastifyInstance) => {
  fastify.post<{ Headers: { authorization: string }; Body: { refreshToken: string }}>(
    '/auth/refresh-token',
    {
      ...opts,
      // @ts-ignore
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      // @ts-ignore
      const { exp, iat, ...oldAccessTokenDecoded } = request.user;

      if (oldAccessTokenDecoded) {
        return reply.send({
          status: 'success',
          data: {
            accessToken: fastify.jwt.sign(oldAccessTokenDecoded, { expiresIn: '15m' }),
            refreshToken: fastify.jwt.sign(oldAccessTokenDecoded, { expiresIn: '24h' }),
          },
        });
      }

      reply.code(401);
      return reply.send({
        status: 'error',
        message: 'token refresh failed',
      });
    },
  );
};

export default refreshToken;
