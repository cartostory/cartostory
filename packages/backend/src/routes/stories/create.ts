import type { FastifyInstance } from 'fastify'
import { generateRandomCode } from '../auth/components/utils'
import { story } from '../../services/database/index'

const opts = {
  schema: {
    body: {
      required: ['slug', 'story'],
      type: 'object',
      properties: {
        slug: {
          type: 'string',
        },
        story: {
          type: 'object',
        },
      },
    },
    headers: {
      required: ['authorization'],
      type: 'object',
      properties: {
        authorization: {
          type: 'string',
        },
      },
    },
  },
}

export const createStory = async (fastify: FastifyInstance) => {
  fastify.post<{
    Headers: { authorization: string }
    Body: { slug: string; story: object }
  }>(
    '/stories',
    {
      ...opts,
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const randomSlug = `${request.body.slug}-${generateRandomCode(6)}`
        const result = await story.create(
          request.user.id,
          randomSlug,
          request.body.story,
        )
        const id = result[0]

        return await reply
          .code(200)
          .send({ status: 'success', data: { id, slug: randomSlug } })
      } catch (e) {
        request.log.error(e)

        await reply.code(400)
        return reply.send({
          status: 'error',
          message: 'story cannot be saved',
        })
      }
    },
  )
}
