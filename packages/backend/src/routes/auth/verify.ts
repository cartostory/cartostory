import type { FastifyInstance } from 'fastify'
import { container } from '../../bootstrap'

const opts = {
  schema: {
    tags: ['auth'],
    params: {
      userId: { type: 'string' },
      verificationCode: { $ref: 'uuidParam' },
    },
  },
}

// curl http://0.0.0.0:8080/backend/auth/verification/7ec88dff-6be5-4112-825e-2f5dfac645d3/af2f8285ad0dfbd7c2d33712330de97ad519325c -H 'Content-Type: application/json'
const verify = async (fastify: FastifyInstance) => {
  fastify.addSchema({
    $id: 'uuidParam',
    type: 'string',
    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  })
  fastify.get<{ Params: { userId: string; verificationCode: string } }>(
    '/auth/verification/:userId/:verificationCode',
    opts,
    async request => {
      const { userId, verificationCode } = request.params
      const controller = container.resolve('userController')

      await controller.verify(userId, verificationCode)
      return { status: 'success', message: 'user verified' }
    },
  )
}

export default verify
