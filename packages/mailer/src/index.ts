#! /usr/bin/env node

import type { AwilixContainer } from 'awilix'
import { bootstrap } from './bootstrap'
import type { Registrations } from './bootstrap'
import { safeEnvironment } from './services/environment/environment'

const { NODE_ENV } = safeEnvironment(process.env)

let container: AwilixContainer<Registrations> | undefined

const main = async () => {
  container = await bootstrap(NODE_ENV)
  const signUp = container.resolve('signUpQueueConsumer')
  await signUp.consume()
}

main()
  .then(() => {
    container?.resolve('logger').info('mailer is ready')
  })
  .catch(e => {
    container?.resolve('logger').error('mailer top level exception', e)
  })

const logUncaughtException = (e: Error) => {
  container?.resolve('logger').error('unexpected error', e)
}

process.on('exit', async () => {
  await container?.dispose()
})
process.on('uncaughtException', logUncaughtException)
process.on('unhandledRejection', logUncaughtException)
