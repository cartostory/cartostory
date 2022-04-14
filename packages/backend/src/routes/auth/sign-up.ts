import type { FastifyInstance } from 'fastify';
import {
  generateActivationCode,
  generateHash,
  isValidEmail,
} from './components/utils';
import { auth } from '../../services/database/index';

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
  fastify.post<{ Body: { email: string; password: string } }>(
    '/auth/sign-up',
    opts,
    async (request, reply) => {
      const { email, password } = request.body;

      if (!isValidEmail(email)) {
        return reply
          .code(400)
          .send({ status: 'error', message: 'e-mail is not valid' });
      }

      const hash = await generateHash(password);
      const activationCode = generateActivationCode();
      const user = {
        email,
        displayName: email,
        hash,
      };

      try {
        const userId = await auth.signUp(user, activationCode);

        const { channel } = fastify.amqp;
        const queue = 'mailer';

        await channel.assertQueue(queue, {
          durable: true,
        });

        channel.sendToQueue(
          queue,
          Buffer.from(
            JSON.stringify({
              userId,
              email,
              activationCode,
              type: 'sign-up',
            })
          )
        );

        return await reply
          .code(200)
          .send({ status: 'success', message: 'user succesfully registered' });
      } catch (e) {
        request.log.error(e);
        // Do not let anyone know an e-mail is already taken.
        return reply
          .code(200)
          .send({ status: 'success', message: 'user succesfully registered' });
      }
    }
  );
};

export default signUp;
