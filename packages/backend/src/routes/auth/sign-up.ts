import type { FastifyInstance } from 'fastify'
import { generateActivationCode } from './components/utils'
import { container } from '../../bootstrap'
import { InvalidEmailError } from '../../api/user/errors'

const opts = {
  schema: {
    tags: ['auth'],
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
}

// curl -X POST -d '{"email": "hello@world.xyz", "password": "password"}' 'http://0.0.0.0:8080/backend/auth/sign-up' -H 'Content-Type: application/json'
const signUp = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: { email: string; password: string } }>(
    '/auth/sign-up',
    opts,
    async request => {
      const { email, password } = request.body
      const controller = container.resolve('userController')
      const verificationCode = generateActivationCode()

      try {
        const user = await controller.signUp(email, password, verificationCode)

        const { channel } = fastify.amqp
        const queue = 'mailer_sign_up_q'

        await channel.assertExchange('mailer_sign_up_x', 'direct', {
          durable: true,
        })
        await channel.assertQueue(queue, {
          durable: true,
          deadLetterExchange: 'mailer_sign_up_dlx',
          deadLetterRoutingKey: 'mailer_sign_up_dlq',
        })
        await channel.bindQueue(
          'mailer_sign_up_q',
          'mailer_sign_up_x',
          'mailer_sign_up_q',
        )

        channel.sendToQueue(
          queue,
          Buffer.from(
            JSON.stringify({
              userId: user.id,
              email,
              activationCode: verificationCode,
              type: 'sign-up',
            }),
          ),
          {
            persistent: true,
          },
        )

        return { status: 'success', message: 'user succesfully registered' }
      } catch (e) {
        if (e instanceof InvalidEmailError) {
          throw e
        }
        request.log.error({ err: e, ...request.body }, 'user sign up failed')
        // Do not let anyone know an e-mail is already taken.
        return { status: 'success', message: 'user succesfully registered' }
      }
    },
  )
}

export default signUp
