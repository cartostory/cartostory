import type Knex from 'knex';
import type { User, UserActivationCode } from '../types';

export class ActivationCodeNotFoundError extends Error {
  constructor() {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ActivationCodeNotFoundError);
    }

    this.name = 'ActivationCodeNotFoundError';
  }
}

export const activate =
  (db: Knex) => async (userId: string, activationCode: string) => {
    await db.transaction(async trx => {
      const found = await db<UserActivationCode>('user_activation_code')
        .join('user', 'user.id', '=', 'user_activation_code.user_id')
        .select('user_activation_code.activation_code')
        .where({
          'user_activation_code.activation_code': activationCode,
          'user_activation_code.user_id': userId,
          'user.status': 'registered',
          'user_activation_code.used_date': null,
        })
        .andWhere('user_activation_code.valid_until_date', '>', new Date())
        .transacting(trx);

      if (!found || found.length !== 1) {
        throw new ActivationCodeNotFoundError();
      }

      await db<User>('user')
        .where('id', '=', userId)
        .update({
          status: 'verified',
          activation_date: new Date(),
        })
        .transacting(trx);

      await db<UserActivationCode>('user_activation_code')
        .where({
          user_id: userId,
          activation_code: activationCode,
        })
        .update({
          used_date: new Date(),
        })
        .transacting(trx);
    });
  };
