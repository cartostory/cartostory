import { db } from './client';
import { signUp } from './auth/sign-up';
import { getUser } from './auth/sign-in';
import { activate } from './auth/activate';

export const auth = {
  activate: activate(db),
  signUp: signUp(db),
  getUser: getUser(db),
};
