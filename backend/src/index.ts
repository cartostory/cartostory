import fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import fastifyPostgres from 'fastify-postgres';
import fastifyJwt from 'fastify-jwt';
import activate from './routes/auth/activate';
import refreshToken from './routes/auth/refresh-token';
import signIn from './routes/auth/sign-in';
import signUp from './routes/auth/sign-up';

const {
  POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER, NODE_JWT_SECRET,
} = process.env;

const server = fastify({
  logger: true,
});

server.register(fastifyPostgres, { connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}` });
server.register(fastifyJwt, { secret: NODE_JWT_SECRET! });

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// routes
server.register(activate);
server.register(refreshToken);
server.register(signIn);
server.register(signUp);

// Declare a route
// @ts-ignore
server.get('/hello', { preValidation: [server.authenticate] }, async (_request, reply) => {
  reply.send({ hello: 'world' });
});

server.listen(3000, '0.0.0.0', (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});
