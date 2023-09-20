import type { UserRepository } from '../../services/repositories/user'
import type { UserUtils } from '../../services/utils/user'
import {
  BadPasswordError,
  InvalidEmailError,
  UserNotFoundError,
  UserVerificationError,
} from './errors'

class UserController {
  userRepository: UserRepository
  userUtils: UserUtils
  constructor(opts: { userRepository: UserRepository; userUtils: UserUtils }) {
    this.userRepository = opts.userRepository
    this.userUtils = opts.userUtils
  }

  public async signIn(email: string, password: string) {
    if (!this.userUtils.isValidEmail(email)) {
      throw new InvalidEmailError()
    }

    const user = await this.userRepository.findOne({
      email,
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    const passwordMatch = await this.userUtils.comparePasswordAndHash(
      password,
      user.password,
    )

    if (!passwordMatch) {
      throw new BadPasswordError()
    }

    const { status } = user
    return {
      ...user,
      status,
    }
  }

  public async signUp(
    email: string,
    password: string,
    verificationCode: string,
  ) {
    if (!this.userUtils.isValidEmail(email)) {
      throw new InvalidEmailError()
    }

    const hash = await this.userUtils.generatePasswordHash(password)
    const timestamp = new Date()
    const user = this.userRepository.create({
      email,
      displayName: email,
      password: hash,
      status: 'registered',
      createdAt: timestamp,
      signedUpAt: timestamp,
      updatedAt: timestamp,
      verificationCode: {
        verificationCode,
      },
    })

    await this.userRepository.getEntityManager().persistAndFlush(user)
    return user
  }

  public async verify(userId: string, verificationCode: string) {
    const user = await this.userRepository.findOne(
      {
        $and: [
          {
            id: userId,
          },
          {
            verificationCode: {
              $and: [
                { verificationCode: { $eq: verificationCode } },
                { usedAt: { $eq: null } },
                { expiresAt: { $gt: new Date() } },
              ],
            },
          },
        ],
      },
      {
        populate: ['verificationCode'],
      },
    )

    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.verificationCode.length !== 1) {
      throw new UserVerificationError()
    }

    user.status = 'verified'
    user.verificationCode[0].usedAt = new Date()

    await this.userRepository.getEntityManager().persistAndFlush(user)
  }
}

export { UserController }
