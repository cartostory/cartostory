import fastify from 'fastify'
import fastifyAmqp from 'fastify-amqp'
import type { FastifyRequest, FastifyReply } from 'fastify'
import fastifyJwt from 'fastify-jwt'
import { getStories, getStory } from './routes/stories/read'
import { createStory } from './routes/stories/create'
import { deleteStory } from './routes/stories/delete'
import { updateStory } from './routes/stories/update'
import activate from './routes/auth/activate'
import refreshToken from './routes/auth/refresh-token'
import signIn from './routes/auth/sign-in'
import signUp from './routes/auth/sign-up'

const { NODE_JWT_SECRET } = process.env

export const server = fastify({
  logger: true,
})

// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(fastifyJwt, { secret: NODE_JWT_SECRET! })

// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(fastifyAmqp, {
  hostname: 'rabbitmq',
  port: 5672,
  username: 'guest',
  password: 'guest',
})

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
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(activate)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(refreshToken)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(signIn)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(signUp)

// stories
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(getStories)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(getStory)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(createStory)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(deleteStory)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(updateStory)
