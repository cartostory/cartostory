import { RESOLVER } from 'awilix'
import z from 'zod'

const environmentSchema = z.object({
  MAILER_SIGN_UP_QUEUE: z.string().endsWith('_q'),
  MAILER_SIGN_UP_EXCHANGE: z.string().endsWith('_x'),
  MAILER_MANDRILL_API_KEY: z.string(),
  AMQP_PORT: z.string(),
  AMQP_HOST: z.string(),
  NODE_ENV: z.enum(['prod', 'dev']),
})

const safeEnvironment = (maybeEnvironment: Record<string, unknown>) =>
  environmentSchema.parse(maybeEnvironment)

class Environment {
  static [RESOLVER] = {}

  private readonly environment: z.infer<typeof environmentSchema>

  constructor(opts: { env: Record<string, unknown> }) {
    this.environment = safeEnvironment(opts.env)
  }

  public getMailerSignUpQueueSetup() {
    return {
      queue: this.environment.MAILER_SIGN_UP_QUEUE,
      exchange: this.environment.MAILER_SIGN_UP_EXCHANGE,
    }
  }

  public getAmqpConnectionString() {
    return `amqp://${this.environment.AMQP_HOST}:${this.environment.AMQP_PORT}`
  }

  public getMandrillApiKey() {
    return this.environment.MAILER_MANDRILL_API_KEY
  }
}

export { Environment, safeEnvironment }
