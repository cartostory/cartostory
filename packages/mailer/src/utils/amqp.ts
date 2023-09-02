import type amqp from 'amqplib'

const enableDeadLetter = (
  exchange: string,
  queue: string,
): Partial<amqp.Options.AssertQueue> => ({
  deadLetterExchange: exchange.replaceAll('_x', '_dlx'),
  deadLetterRoutingKey: queue.replace('_q', '_dlq'),
})

export { enableDeadLetter }
