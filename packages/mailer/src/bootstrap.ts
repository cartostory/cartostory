import amqp from 'amqplib'
import {
  InjectionMode,
  Lifetime,
  asClass,
  asValue,
  createContainer,
} from 'awilix'
import { TemplateReader } from './services/mailer/template-reader'
import { DummySender } from './services/mailer/dummy-sender'
import type { ISender } from './services/mailer/isender'
import { Mailer } from './services/mailer/mailer'
import type { IMailer } from './services/mailer/imailer'
import { MailchimpSender } from './services/mailer/mailchimp-sender'
import { MessageResolver } from './services/messaging/message-resolver/message-resolver'
import { MessageHandler } from './services/messaging/message-handler/message-handler'
import { Logger } from './services/logger/logger'
import {
  Environment,
  safeEnvironment,
} from './services/environment/environment'
import type { IRetryStrategy } from './services/messaging/retry-strategy/retry-strategy'
import { RetryStrategy } from './services/messaging/retry-strategy/retry-strategy'
import { QueueConsumer } from './services/messaging/queue-consumer/queue-consumer'
import _ from 'lodash'
import { enableDeadLetter } from './utils/amqp'

type Registrations = {
  amqpChannel: amqp.Channel
  environment: Environment
  logger: Logger
  mailer: IMailer
  messageResolver: MessageResolver
  messageHandler: MessageHandler
  retryStrategy: IRetryStrategy
  sender: ISender
  signUpQueueConsumer: QueueConsumer
  templateReader: TemplateReader
}

const emptyContainer = createContainer<Registrations>({
  injectionMode: InjectionMode.PROXY,
})

const _bootstrap = async (mode: 'prod' | 'dev') => {
  const container = emptyContainer
    .register({
      sender: asClass(mode === 'prod' ? MailchimpSender : DummySender),
    })
    .register({ templateReader: asClass(TemplateReader) })
    .register({ mailer: asClass(Mailer) })
    .register({ messageResolver: asClass(MessageResolver) })
    .register<MessageHandler>('messageHandler', asClass(MessageHandler))
    .register({
      environment: asClass(Environment, {
        lifetime: Lifetime.SINGLETON,
      }).inject(() => ({
        env: process.env,
      })),
    })
    .register({ logger: asClass(Logger, { lifetime: Lifetime.SINGLETON }) })
    .register({ retryStrategy: asClass(RetryStrategy) })
    .register({
      signUpQueueConsumer: asClass(QueueConsumer, {
        injector: () => {
          const environment = safeEnvironment(process.env)
          const queue = environment.MAILER_SIGN_UP_QUEUE
          const exchange = environment.MAILER_SIGN_UP_EXCHANGE

          return {
            queue: {
              name: queue,
              options: {
                durable: true,
                ...enableDeadLetter(exchange, queue),
              },
            },
            exchange: {
              name: exchange,
              options: {
                durable: true,
              },
            },
          }
        },
      }),
    })

  const environment = container.resolve<Environment>('environment')
  const connection = await amqp.connect(environment.getAmqpConnectionString())
  const channel = await connection.createChannel()

  container.register<amqp.Channel>('amqpChannel', asValue(channel))

  return container
}
const bootstrap = _.once(_bootstrap)

export { bootstrap }
export type { Registrations }
