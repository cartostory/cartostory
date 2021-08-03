import { generateHash } from '../src/routes/auth/components/utils';
import query from './query';

export const createUser = async (email: string, password: string) => {
  const hash = await generateHash(password);
  await query('INSERT INTO "user" (email, display_name, password) VALUES ($1, $1, $2)', [email, hash]);
};
