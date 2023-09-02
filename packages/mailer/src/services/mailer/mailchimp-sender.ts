import mailchimp from '@mailchimp/mailchimp_transactional'
import { RESOLVER } from 'awilix'
import type { TemplateReader } from './template-reader'
import type { ISender } from './isender'
import type { Logger } from '../logger/logger'
import type { Environment } from '../environment/environment'

class MailchimpSender implements ISender {
  static [RESOLVER] = {}

  readonly templateReader: TemplateReader
  readonly logger: Logger
  readonly apiClient: mailchimp.ApiClient

  constructor(opts: {
    environment: Environment
    templateReader: TemplateReader
    logger: Logger
  }) {
    this.templateReader = opts.templateReader
    this.logger = opts.logger
    this.apiClient = mailchimp(opts.environment.getMandrillApiKey())
  }

  public async send(to: string, message: { text: string; subject: string }) {
    try {
      const result = await this.apiClient.messages.send({
        message: {
          from_email: 'hello@cartostory.com',
          subject: message.subject,
          text: message.text,
          to: [
            {
              email: to,
              type: 'to',
            },
          ],
        },
      })

      if (Array.isArray(result) && result[0].status === 'rejected') {
        throw new Error('e-mail rejected')
      }
    } catch (e) {
      this.logger.error('failed to send e-mail', e, { to, message })
      throw e
    }
  }
}

export { MailchimpSender }
