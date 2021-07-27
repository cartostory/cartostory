import { isEmail } from '@rearguard/is-email';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateHash = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  return hash;
};

export const comparePasswordAndHash = async (password: string, hash: string): Promise<boolean> => {
  const result = await bcrypt.compare(password, hash);

  return result;
};

export const generateActivationCode = (): string => {
  const buffer = crypto.randomBytes(20);

  return buffer.toString('hex');
};

export const isValidEmail = (email: string): boolean => isEmail(email);
