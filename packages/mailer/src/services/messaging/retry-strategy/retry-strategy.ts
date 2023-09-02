import type amqp from 'amqplib'
import type { Logger } from '../../logger/logger'

interface IRetryStrategy {
  retry(message: amqp.Message, handle: () => Promise<void>): Promise<void>
}

class RetryStrategy implements IRetryStrategy {
  private readonly MAX_RETRIES: number = 3
  private readonly channel: amqp.Channel
  private readonly logger: Logger

  constructor(opts: { logger: Logger; amqpChannel: amqp.Channel }) {
    this.channel = opts.amqpChannel
    this.logger = opts.logger
  }

  public async retry(message: amqp.Message, handle: () => Promise<void>) {
    try {
      await handle()
      this.channel.ack(message, false)
      this.logger.debug('acknowledged the message')
    } catch (e) {
      const currentRetries = message.properties.headers.retries ?? 0

      if (currentRetries >= this.MAX_RETRIES) {
        this.channel.reject(message, false)
        this.logger.error(
          'message retry limit reached',
          JSON.parse(message.content.toString()),
        )
        return
      }

      const retryAfter = this.getNextRetry(currentRetries + 1)

      this.channel.ack(message, false)
      this.logger.debug(`message to be processed again in ${retryAfter}`)

      setTimeout(() => {
        this.channel.sendToQueue(message.fields.routingKey, message.content, {
          headers: {
            ...message.properties.headers,
            retries: currentRetries + 1,
          },
        })
      }, retryAfter)
    }
  }

  private getNextRetry(retry: number) {
    return (retry + 1) * 10_000
  }
}

export { RetryStrategy }
export type { IRetryStrategy }
