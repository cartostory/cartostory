import type { FastifyInstance } from 'fastify';
import { comparePasswordAndHash, isValidEmail } from './components/utils';
import { auth } from '../../services/database/index';
import { UserNotFoundError } from '../../services/database/auth/sign-in';

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
  fastify.post<{ Body: { email: string; password: string } }>(
    '/auth/sign-in',
    opts,
    async (request, reply) => {
      const { email, password } = request.body;

      if (!isValidEmail(email)) {
        return reply
          .code(400)
          .send({ status: 'error', message: 'e-mail is not valid' });
      }

      try {
        const found = await auth.getUser(email);
        const { password: hash, ...user } = found;
        const rightPassword = await comparePasswordAndHash(password, hash);

        if (!rightPassword) {
          await reply
            .code(401)
            .send({ status: 'error', message: 'wrong password' });
        }

        return await reply.send({
          status: 'success',
          data: {
            accessToken: fastify.jwt.sign(user, { expiresIn: '15m' }),
            refreshToken: fastify.jwt.sign(user, { expiresIn: '24h' }),
          },
        });
      } catch (e) {
        request.log.error(e);

        if (e instanceof UserNotFoundError) {
          return reply
            .code(400)
            .send({ status: 'error', message: 'user cannot log in' });
        }

        return reply
          .code(400)
          .send({ status: 'error', message: 'sign in failed' });
      }
    }
  );
};

export default signIn;
