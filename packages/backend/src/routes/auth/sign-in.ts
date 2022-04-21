import type { FastifyInstance } from 'fastify'
import { comparePasswordAndHash, isValidEmail } from './components/utils'
import { auth } from '../../services/database/index'
import { UserNotFoundError } from '../../services/database/auth/sign-in'

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
      const { email, password } = request.body

      if (!isValidEmail(email)) {
        // eslint-disable-next-line no-throw-literal
        throw {
          statusCode: 400,
          status: 'error',
          message: 'e-mail is not valid',
        }
      }

      try {
        const found = await auth.getUser(email)
        const { password: hash, ...user } = found
        const rightPassword = await comparePasswordAndHash(password, hash)

        if (!rightPassword) {
          // eslint-disable-next-line no-throw-literal
          throw { statusCode: 401, status: 'error', message: 'wrong password' }
        }

        return {
          status: 'success',
          data: {
            accessToken: fastify.jwt.sign(user, { expiresIn: '15m' }),
            refreshToken: fastify.jwt.sign(user, { expiresIn: '24h' }),
          },
        }
      } catch (e) {
        request.log.error(e)

        if (e instanceof UserNotFoundError) {
          // eslint-disable-next-line no-throw-literal
          throw {
            statusCode: 400,
            status: 'error',
            message: 'user cannot log in',
          }
        }

        // eslint-disable-next-line no-throw-literal
        throw { statusCode: 400, status: 'error', message: 'sign in failed' }
      }
    },
  )
}

export default signIn
