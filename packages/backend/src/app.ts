import fastify from 'fastify'
import fastifyAmqp from 'fastify-amqp'
import type { FastifyRequest, FastifyReply } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { getStories, getStory } from './routes/stories/read'
import { createStory } from './routes/stories/create'
import { deleteStory } from './routes/stories/delete'
import { updateStory } from './routes/stories/update'
import activate from './routes/auth/activate'
import refreshToken from './routes/auth/refresh-token'
import signIn from './routes/auth/sign-in'
import signUp from './routes/auth/sign-up'
import queueConfig from './config/queue'
import {
  config as swaggerConfig,
  uiConfig as swaggerUiConfig,
} from './config/swagger'

const { NODE_JWT_SECRET } = process.env

const setup = async () => {
  const server = fastify({
    logger: true,
  })

  await server.register(fastifyJwt, { secret: NODE_JWT_SECRET! })
  await server.register(fastifyAmqp, queueConfig)
  await server.register(fastifySwagger, swaggerConfig)
  await server.register(fastifySwaggerUi, swaggerUiConfig)

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
  await server.register(activate)
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
