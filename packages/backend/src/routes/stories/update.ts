import type { FastifyInstance } from 'fastify'
import { story } from '../../services/database/index'

const opts = {
  schema: {
    tags: ['stories'],
    params: {
      required: ['id'],
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
    },
    body: {
      required: ['story'],
      type: 'object',
      properties: {
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

type Shape = {
  Params: { id: string }
  Headers: { authorization: string }
  Body: { slug: string; story: object }
}

export const updateStory = async (fastify: FastifyInstance) => {
  fastify.put<Shape>(
    '/stories/:id',
    {
      ...opts,
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const slug = request.params.id
        const found = await story.getUserId(slug)

        if (!found || found.length !== 1) {
          return await reply
            .code(404)
            .send({ status: 'error', message: 'story was not found' })
        }

        if (found[0].user_id !== request.user.id) {
          return await reply.code(401).send({
            status: 'error',
            message: 'user is not authorized to update the story',
          })
        }

        await story.update(slug, request.body.story)

        return await reply
          .code(200)
          .send({ status: 'success', data: { id: slug } })
      } catch (e) {
        request.log.error(e)

        return reply
          .code(400)
          .send({ status: 'error', message: 'story cannot be saved' })
      }
    },
  )
}
