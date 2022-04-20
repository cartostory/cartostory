#! /usr/bin/env node
import amqp from 'amqplib'
import { sendSignUp } from './services/mailer'

const CONNECTION_STRING = 'amqp://rabbitmq:5672'
const QUEUE = 'mailer'

const setup = async () => {
  try {
    const connection = await amqp.connect(CONNECTION_STRING)
    const channel = await connection.createChannel()

    await channel.assertQueue(QUEUE, {
      durable: true,
    })

    await channel.consume(
      QUEUE,
      async msg => {
        if (!msg) {
          return
        }

        try {
          const content = JSON.parse(msg.content.toString())
          const { type, userId, email, activationCode } = content

          if (!userId) {
            throw new Error('user id is missing')
          }

          if (!email) {
            throw new Error('e-mail is missing')
          }

          switch (type) {
            case 'sign-up': {
              await sendSignUp({
                activation_code: activationCode,
                user_id: userId,
              })([email])
            }
          }
        } catch (e) {
          console.error('failed to send e-mail', e)
        }
      },
      {
        noAck: true,
      },
    )
  } catch (e) {
    // TODO handle error
  }
}

setup().catch(() => {
  // TODO handle error
})
