import type Knex from 'knex';
import { User } from '../types';

export class UserNotFoundError extends Error {
  constructor() {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserNotFoundError);
    }

    this.name = 'UserNotFoundError';
  }
}

export const getUser = (db: Knex) => async (email: string) => {
  const found = await db<User>('user').select('*').where({
    email,
  });

  if (!found || found.length !== 1) {
    throw new UserNotFoundError();
  }

  return found[0];
};
