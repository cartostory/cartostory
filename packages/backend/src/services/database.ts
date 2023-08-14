import type { Knex } from 'knex'
import knex from 'knex'

const { POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER } = process.env

const TABLE_USER = 'user'
const TABLE_USER_ACTIVATION_CODE = 'user_activation_code'

const signUp =
  (db: Knex) =>
  async (
    user: { email: string; displayName: string; hash: string },
    activationCode: string,
  ) => {
    const { email, displayName, hash } = user
    return db.transaction(async trx => {
      const [userId] = await db(TABLE_USER)
        .returning('id')
        .insert({
          email,
          display_name: displayName,
          password: hash,
        })
        .transacting(trx)

      await db(TABLE_USER_ACTIVATION_CODE)
        .insert({
          user_id: userId,
          activation_code: activationCode,
        })
        .transacting(trx)

      return userId
    })
  }

export const db = knex({
  client: 'pg',
  connection: `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`,
})

export const persistSignUp = signUp(db)

export const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`
