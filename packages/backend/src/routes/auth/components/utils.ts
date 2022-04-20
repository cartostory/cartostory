import { v4 as uuidv4 } from 'uuid'
import isEmail from '@rearguard/is-email'
import bcrypt from 'bcrypt'

export const generateHash = async (password: string): Promise<string> => {
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)

  return hash
}

export const comparePasswordAndHash = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(password, hash)

  return result
}

export const generateActivationCode = (): string => uuidv4()

export const generateRandomCode = (length: number): string =>
  uuidv4().replaceAll('-', '').slice(0, length)

// TODO enable @localhost outside PROD env
// @ts-expect-error @rearguard/is-email uses default export but typings seem to use named export
export const isValidEmail = (email: string): boolean => isEmail(email)
