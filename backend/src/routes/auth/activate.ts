import type { FastifyInstance } from 'fastify';

const opts = {
  schema: {
    params: {
      userId: { type: 'string' },
      activationCode: { type: 'string' },
    },
  },
};

// curl http://0.0.0.0:8080/backend/auth/activate/7ec88dff-6be5-4112-825e-2f5dfac645d3/af2f8285ad0dfbd7c2d33712330de97ad519325c -H 'Content-Type: application/json'
const activate = async (fastify: FastifyInstance) => {
  fastify.get<{ Params: { userId: string; activationCode: string } }>(
    '/auth/activate/:userId/:activationCode',
    opts,
    async (request, reply) => {
      const { userId, activationCode } = request.params;

      return fastify.pg.transact(async (client) => {
        try {
          const { rows } = await client.query(SELECT_USER_ACTIVATION_CODE, [userId, activationCode]);

          if (!rows || rows.length !== 1) {
            reply.code(400);
            return await reply.send({ status: 'error', message: 'user cannot be activated' });
          }

          const now = new Date();

          await client.query(UPDATE_USER, [now, userId]);
          await client.query(UPDATE_USER_ACTIVATION_CODE, [userId, activationCode]);

          reply.code(200);
          return await reply.send({ status: 'success', message: 'user activated' });
        } catch (e) {
          request.log.error(e);
          reply.code(400);
          return reply.send({ status: 'error', message: 'user activation failed' });
        }
      });
    },
  );
};

const SELECT_USER_ACTIVATION_CODE = `
SELECT 1
FROM cartostory.user_activation_code uac
JOIN cartostory."user" u ON (uac.user_id = u.id)
WHERE uac.user_id = $1
  AND uac.activation_code = $2
  AND u.status = 'registered'
  AND uac.valid_until_date >= now()
  AND uac.used_date IS NULL
`;

const UPDATE_USER = `
UPDATE cartostory."user"
SET
  status = 'verified',
  activation_date = $1
WHERE id = $2
`;

const UPDATE_USER_ACTIVATION_CODE = `
UPDATE cartostory.user_activation_code
SET
  used_date = now()
WHERE user_id = $1
  AND activation_code = $2
`;

export default activate;
