import fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import fastifyPostgres from 'fastify-postgres';
import fastifyJwt from 'fastify-jwt';
import { getStories, getStory } from './routes/stories/read';
import { createStory } from './routes/stories/create';
import { deleteStory } from './routes/stories/delete';
import { updateStory } from './routes/stories/update';
import activate from './routes/auth/activate';
import refreshToken from './routes/auth/refresh-token';
import signIn from './routes/auth/sign-in';
import signUp from './routes/auth/sign-up';
import { connectionString } from './services/database';

const { NODE_JWT_SECRET } = process.env;

export const server = fastify({
  logger: true,
});

server.register(fastifyPostgres, { connectionString });
server.register(fastifyJwt, { secret: NODE_JWT_SECRET! });

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    request.log.error(err);
    reply.send(err);
  }
});

// routes
// auth
server.register(activate);
server.register(refreshToken);
server.register(signIn);
server.register(signUp);
// stories
server.register(getStories);
server.register(getStory);
server.register(createStory);
server.register(deleteStory);
server.register(updateStory);
