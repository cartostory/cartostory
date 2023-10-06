import type { FastifyInstance } from 'fastify'
import { setup } from './app'

const closeGracefully = async (server: FastifyInstance) => {
  await server.close()
  process.exit()
}

setup()
  .then(server => {
    process.on('SIGINT', closeGracefully)
    process.on('SIGTERM', closeGracefully)
    return server
  })
  .then(server => {
    server.ready(() => {
      server.swagger()
    })
    return server
  })
  .then(async server => {
    return server
      .listen({
        host: '0.0.0.0',
        port: 3000,
      })
      .catch(e => {
        process.stderr.write('Backend failed with an error', e)
        process.exit(1)
      })
  })
  .catch(e => {
    process.stderr.write('Backend failed with an error', e)
    process.exit(1)
  })
