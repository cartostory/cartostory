import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export const generateHash = async (password: string): Promise<string> => {
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)

  return hash
}

export const generateActivationCode = (): string => uuidv4()

export const generateRandomCode = (length: number): string =>
  uuidv4().replaceAll('-', '').slice(0, length)
