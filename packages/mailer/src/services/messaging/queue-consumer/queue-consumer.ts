import type amqp from 'amqplib'
import type { MessageResolver } from '../message-resolver/message-resolver'
import type { MessageHandler } from '../message-handler/message-handler'
import type { IRetryStrategy } from '../retry-strategy/retry-strategy'
import type { Logger } from '../../logger/logger'
import { ReadError } from '../../errors/read-error'

class QueueConsumer {
  private readonly channel: amqp.Channel
  private readonly queue: { name: string; options: amqp.Options.AssertQueue }
  private readonly exchange: {
    name: string
    options: amqp.Options.AssertExchange
  }
  private readonly messageResolver: MessageResolver
  private readonly messageHandler: MessageHandler
  private readonly retryStrategy: IRetryStrategy
  private readonly logger: Logger

  constructor(opts: {
    amqpChannel: amqp.Channel
    exchange: { name: string; options: amqp.Options.AssertExchange }
    logger: Logger
    messageHandler: MessageHandler
    messageResolver: MessageResolver
    queue: { name: string; options: amqp.Options.AssertQueue }
    retryStrategy: IRetryStrategy
  }) {
    this.channel = opts.amqpChannel
    this.exchange = opts.exchange
    this.logger = opts.logger
    this.messageHandler = opts.messageHandler
    this.messageResolver = opts.messageResolver
    this.queue = opts.queue
    this.retryStrategy = opts.retryStrategy
  }

  public async consume() {
    await this.setup()
    this.channel.on('error', e => {
      this.logger.error(
        `exchange: ${this.exchange.name}, queue: ${this.queue.name} caught error`,
        e,
      )
    })
    await this.channel.consume(this.queue.name, message => {
      // seems that this will never throw synchronously as promises are not being awaited in the amqplib
      // the right way to deal with that is to listen to `error` event on channel
      // see more at https://amqp-node.github.io/amqplib/#troubleshooting
      if (!message) {
        return
      }

      const messageContent = this.messageResolver.resolve(message)
      this.retryStrategy
        .retry(message, async () => this.messageHandler.handle(messageContent))
        .catch(e => {
          if (e instanceof ReadError) {
            return
          }

          throw e
        })
    })
  }

  private async setup() {
    await this.channel.assertExchange(
      this.exchange.name,
      'direct',
      this.exchange.options,
    )
    await this.channel.assertQueue(this.queue.name, this.queue.options)
    await this.channel.bindQueue(
      this.queue.name,
      this.exchange.name,
      this.queue.name,
    )

    if (
      this.queue.options.deadLetterExchange &&
      this.queue.options.deadLetterRoutingKey
    ) {
      await this.channel.assertExchange(
        this.queue.options.deadLetterExchange,
        'direct',
      )
      await this.channel.assertQueue(this.queue.options.deadLetterRoutingKey, {
        durable: true,
      })
      await this.channel.bindQueue(
        this.queue.options.deadLetterRoutingKey,
        this.queue.options.deadLetterExchange,
        this.queue.options.deadLetterRoutingKey,
      )
    }
  }
}

export { QueueConsumer }
