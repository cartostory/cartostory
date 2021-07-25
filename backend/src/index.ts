import fastify from 'fastify';
import fastifyPostgres from 'fastify-postgres';

const { POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER } = process.env;

const server = fastify({
  logger: true,
});

server.register(fastifyPostgres, {
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`,
});

// Declare a route
server.get('/', (_request, reply) => {
  reply.send({ hello: 'world' });
});

server.get('/pg', (_request, reply) => {
  // @ts-ignore
  function onConnect(err, client, release) {
    if (err) {
      return reply.send(err);
    }

    // @ts-ignore
    client.query('SELECT 2', (_err, result) => {
      release();
      reply.send(err || result);
    });
  }
  server.pg.connect(onConnect);
});

server.listen(3000, '0.0.0.0', (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});
