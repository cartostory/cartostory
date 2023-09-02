import { RESOLVER } from 'awilix'
import type { IMailer } from './imailer'
import type { TemplateReader } from './template-reader'
import type { ISender } from './isender'

class Mailer implements IMailer {
  static [RESOLVER] = {}

  readonly templateReader: TemplateReader
  readonly sender: ISender

  constructor(opts: {
    logger: Logger
    sender: ISender
    templateReader: TemplateReader
  }) {
    this.sender = opts.sender
    this.templateReader = opts.templateReader
  }

  public async sendSignup(to: string, userId: string, activationCode: string) {
    const templateSpec = await this.templateReader.readTemplate('sign-up')
    await this.sender.send(to, {
      text: templateSpec({ userId, activationCode }),
      subject: 'Welcome aboard!',
    })
  }
}

export { Mailer }
