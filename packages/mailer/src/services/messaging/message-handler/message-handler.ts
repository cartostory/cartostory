import { RESOLVER } from 'awilix'
import type { Message } from '../message-resolver/message-resolver'
import type { IMailer } from '../../mailer/imailer'
import type { Logger } from '../../logger/logger'

class MessageHandler {
  private readonly mailer: IMailer
  private readonly logger: Logger

  static [RESOLVER] = {}

  constructor(opts: { logger: Logger; mailer: IMailer }) {
    this.logger = opts.logger
    this.mailer = opts.mailer
  }

  public async handle(message: Message) {
    switch (message.type) {
      case 'sign-up': {
        try {
          await this.mailer.sendSignup(
            message.email,
            message.userId,
            message.activationCode,
          )
        } catch (e) {
          this.logger.error('failed to handle message', e, message)
          throw e
        }
      }
    }
  }
}

export { MessageHandler }
