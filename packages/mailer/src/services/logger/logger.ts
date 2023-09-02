import { RESOLVER } from 'awilix'
import { pino } from 'pino'

class Logger {
  static [RESOLVER] = {}

  private readonly logger: ReturnType<typeof pino>

  constructor() {
    this.logger = pino({
      level: 'debug',
      name: 'mailer',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    })
  }

  public debug(message: string, data: Record<string, unknown> = {}) {
    this.logger.debug(data, message)
  }

  public info(message: string, data: Record<string, unknown> = {}) {
    this.logger.info(data, message)
  }

  public error(
    message: string,
    error: unknown,
    data: Record<string, unknown> = {},
  ) {
    this.logger.error({ data, err: error }, message)
  }
}

export { Logger }
