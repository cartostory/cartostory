import type { FastifyInstance } from 'fastify';
import { comparePasswordAndHash, isValidEmail } from './components/utils';

const opts = {
  schema: {
    body: {
      additionalProperties: false,
      required: ['email', 'password'],
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  },
};

// curl -X POST -d '{"email": "hello@world.xyz", "password": "password"}' 'http://0.0.0.0:8080/backend/auth/sign-in' -H 'Content-Type: application/json'
const signIn = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: { email: string; password: string }}>(
    '/auth/sign-in',
    opts,
    async (request, reply) => {
      const { email, password } = request.body;

      if (!isValidEmail(email)) {
        reply.code(400);
        throw new Error('E-mail is not valid.');
      }

      try {
        const { rows } = await fastify.pg.query('SELECT * FROM cartostory."user" WHERE email = $1', [email]);
        if (!rows || rows.length !== 1) {
          reply.code(400);
          return reply.send({ status: 'error', message: 'user cannot log in' });
        }

        const {
          password: hash,
          ...user
        } = rows[0];
        const rightPassword = await comparePasswordAndHash(password, hash);

        if (!rightPassword) {
          reply.code(401);
          return reply.send({ status: 'error', message: 'wrong password' });
        }

        return reply.send({
          status: 'success',
          data: {
            accessToken: fastify.jwt.sign(user, { expiresIn: '15m' }),
            refreshToken: fastify.jwt.sign(user, { expiresIn: '24h' }),
          },
        });
      } catch (e) {
        request.log.error(e);
        reply.code(400);
        return reply.send({ status: 'error', message: 'sign in failed' });
      }
    },
  );
};

export default signIn;
