import type { ConsumeMessage } from 'amqplib'
import { RESOLVER } from 'awilix'
import { z } from 'zod'
import type { Logger } from '../../logger/logger'
import { ReadError } from '../../errors/read-error'

const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('sign-up'),
    email: z.string().email(),
    userId: z.string().uuid(),
    activationCode: z.string().uuid(),
  }),
])

type Message = z.infer<typeof messageSchema>

class MessageResolver {
  static [RESOLVER] = {}

  private readonly logger: Logger

  constructor(opts: { logger: Logger }) {
    this.logger = opts.logger
  }

  public resolve(message: ConsumeMessage) {
    try {
      const parsedMessage = messageSchema.parse(
        JSON.parse(message.content.toString()),
      )

      return parsedMessage
    } catch (e) {
      this.logger.error('MessageResolver failed to resolve message', e, {
        message: message.content.toString(),
      })

      if (e instanceof SyntaxError) {
        throw new ReadError('message cannot be parsed')
      }

      throw e
    }
  }
}

export { MessageResolver }
export type { Message }
