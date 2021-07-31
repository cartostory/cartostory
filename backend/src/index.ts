import { server } from './app';

server.listen(3000, '0.0.0.0', (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});

const closeGracefully = async (signal: string) => {
  console.log(`*^!@4=> Received signal to terminate: ${signal}`);

  await server.close();
  process.exit();
};

process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);
