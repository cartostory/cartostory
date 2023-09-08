import type { FastifyInstance } from 'fastify'
import { container } from '../../bootstrap'

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

// curl -X POST -d '{"email": "hello@world.xyz", "password": "password"}' 'http://0.0.0.0:8080/backend/auth/sign-in' -H 'Content-Type: application/json'
const signIn = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: { email: string; password: string } }>(
    '/auth/sign-in',
    opts,
    async request => {
      const controller = container.resolve('userController')
      const { email, password } = request.body
      const user = await controller.signIn(email, password)

      return {
        status: 'success',
        data: {
          accessToken: fastify.jwt.sign(user, { expiresIn: '15m' }),
          refreshToken: fastify.jwt.sign(user, { expiresIn: '24h' }),
        },
      }
    },
  )
}

export default signIn
