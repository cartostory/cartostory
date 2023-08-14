import type fastifyAmqp from 'fastify-amqp'

const config: fastifyAmqp.FastifyAmqpOptions = {
  hostname: 'rabbitmq',
  port: 5672,
  username: 'guest',
  password: 'guest',
}

export default config
