import { RESOLVER } from 'awilix'
import type { Logger } from '../logger/logger'

class DummySender {
  static [RESOLVER] = {}

  readonly logger: Logger

  constructor(opts: { logger: Logger }) {
    this.logger = opts.logger
  }

  public async send(to: string, message: { text: string; subject: string }) {
    this.logger.info(to, message)
    await Promise.resolve()
  }
}

export { DummySender }
