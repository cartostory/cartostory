import type { FastifyInstance } from 'fastify';
import { generateActivationCode, generateHash, isValidEmail } from './components/utils';

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

// curl -X POST -d '{"email": "hello@world.xyz", "password": "password"}' 'http://0.0.0.0:8080/backend/auth/sign-up' -H 'Content-Type: application/json'
const signUp = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: { email: string; password: string }}>(
    '/auth/sign-up',
    opts,
    async (request, reply) => {
      const { email, password } = request.body;

      if (!isValidEmail(email)) {
        return reply.code(400).send({ status: 'error', message: 'e-mail is not valid' });
      }

      const hash = await generateHash(password);

      return fastify.pg.transact(async (client) => {
        try {
          const { rows } = await client.query('INSERT INTO cartostory.user (email, display_name, password, signup_date) VALUES ($1, $1, $2, now()) RETURNING id;', [email, hash]);
          const userId = rows[0].id;
          fastify.log.info({ userId }, 'New user registered');

          const activationCode = generateActivationCode();
          await client.query('INSERT INTO cartostory.user_activation_code (user_id, activation_code) VALUES ($1, $2)', [userId, activationCode]);
          fastify.log.info({ userId }, 'New activation code created');

          return reply.code(200).send({ status: 'success', message: 'user succesfully registered' });
        } catch (e) {
          request.log.error(e);
          // Do not let anyone know an e-mail is already taken.
          return reply.code(200).send({ status: 'success', message: 'user succesfully registered' });
        }
      });
    },
  );
};

export default signUp;
