import type { FastifyInstance } from 'fastify'
import { ActivationCodeNotFoundError } from '../../services/database/auth/activate'
import { auth } from '../../services/database/index'

const opts = {
  schema: {
    tags: ['auth'],
    params: {
      userId: { type: 'string' },
      activationCode: { type: 'string' },
    },
  },
}

// curl http://0.0.0.0:8080/backend/auth/activate/7ec88dff-6be5-4112-825e-2f5dfac645d3/af2f8285ad0dfbd7c2d33712330de97ad519325c -H 'Content-Type: application/json'
const activate = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { userId: string; activationCode: string } }>(
    '/auth/activate/:userId/:activationCode',
    opts,
    async request => {
      const { userId, activationCode } = request.params

      try {
        await auth.activate(userId, activationCode)
        return { status: 'success', message: 'user activated' }
      } catch (e) {
        request.log.error(e)

        if (e instanceof ActivationCodeNotFoundError) {
          // eslint-disable-next-line no-throw-literal
          throw {
            statusCode: 400,
            message: 'user cannot be activated',
            status: 'error',
          }
        }

        // eslint-disable-next-line no-throw-literal
        throw {
          statusCode: 400,
          message: 'user activation failed',
          status: 'error',
        }
      }
    },
  )
}

export default activate
