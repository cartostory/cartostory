import fastify from 'fastify'
import fastifyAmqp from 'fastify-amqp'
import type { FastifyRequest, FastifyReply, FastifyError } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { getStories, getStory } from './routes/stories/read'
import { createStory } from './routes/stories/create'
import { deleteStory } from './routes/stories/delete'
import { updateStory } from './routes/stories/update'
import verify from './routes/auth/verify'
import refreshToken from './routes/auth/refresh-token'
import signIn from './routes/auth/sign-in'
import signUp from './routes/auth/sign-up'
import queueConfig from './config/queue'
import {
  config as swaggerConfig,
  uiConfig as swaggerUiConfig,
} from './config/swagger'
import { _bootstrap, container } from './bootstrap'
import { RequestContext } from '@mikro-orm/core'
import { ApiError } from './api/user/errors'

const { NODE_JWT_SECRET } = process.env

const setup = async () => {
  await _bootstrap('dev')
  const orm = container.resolve('orm')
  const server = fastify({
    logger: true,
  })

  server.addHook('onRequest', (_request, _reply, done) => {
    RequestContext.create(orm.em, done)
  })

  server.addHook('onClose', async () => {
    await orm.close()
  })

  await server.register(fastifyJwt, { secret: NODE_JWT_SECRET! })
  await server.register(fastifyAmqp, queueConfig)
  await server.register(fastifySwagger, swaggerConfig)
  await server.register(fastifySwaggerUi, swaggerUiConfig)

  server.setErrorHandler(
    async (
      error: FastifyError,
      request: FastifyRequest<{ Body: Record<string, unknown> }>,
      reply: FastifyReply,
    ) => {
      if ('statusCode' in error) {
        return await reply.code(error.statusCode!).send({
          status: 'error',
          statusCode: error.statusCode,
          message: error.message,
        })
      }

      if (error instanceof ApiError) {
        return await reply.code(error.statusCode).send({
          status: 'error',
          statusCode: error.statusCode,
          message: error.message,
        })
      }

      request.log.error(
        { err: error, ...request.body },
        'neither validation nor api error returned to the client',
      )

      await reply.code(500).send({
        status: 'error',
        statusCode: 500,
        message: 'unexpected error',
      })
    },
  )

  server.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        request.log.error(err)
        await reply.send(err)
      }
    },
  )

  // auth
  await server.register(verify)
  await server.register(refreshToken)
  await server.register(signIn)
  await server.register(signUp)

  // stories
  await server.register(getStories)
  await server.register(getStory)
  await server.register(createStory)
  await server.register(deleteStory)
  await server.register(updateStory)

  return server
}

export { setup }
