import type Knex from 'knex'
import { TABLE_USER, TABLE_USER_ACTIVATION_CODE } from '../config'
import type { User, UserActivationCode } from '../types'

export const signUp =
  (db: Knex) =>
  async (
    user: { email: string; displayName: string; hash: string },
    activationCode: string,
  ) => {
    const { email, displayName, hash } = user

    await db.transaction(async trx => {
      const [userId] = await db<User, Pick<User, 'id'>>(TABLE_USER)
        .insert({
          email,
          display_name: displayName,
          password: hash,
        })
        .returning('id')
        .transacting(trx)

      await db<UserActivationCode>(TABLE_USER_ACTIVATION_CODE)
        .insert({
          user_id: userId,
          activation_code: activationCode,
        })
        .transacting(trx)

      return userId
    })
  }
