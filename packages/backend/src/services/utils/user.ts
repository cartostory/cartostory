import isEmail from '@rearguard/is-email'
import bcrypt from 'bcrypt'

class UserUtils {
  public async generatePasswordHash(password: string) {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)

    return hash
  }

  public async comparePasswordAndHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }

  public isValidEmail(email: string) {
    // @ts-expect-error @rearguard/is-email uses default export but typings seem to use named export
    return isEmail(email)
  }
}

export { UserUtils }
