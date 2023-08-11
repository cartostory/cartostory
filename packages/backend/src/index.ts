import { server } from './app'

server.listen(
  {
    host: '0.0.0.0',
    port: 3000,
  },
  (err, address) => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
    server.log.info(`server listening on ${address}`)
  },
)

const closeGracefully = async () => {
  await server.close()
  process.exit()
}

process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)
