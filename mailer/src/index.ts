#! /usr/bin/env node
import amqp from 'amqplib';
import { sendSignUp } from './services/mailer';

const CONNECTION_STRING = 'amqp://rabbitmq:5672';
const QUEUE = 'mailer';

const setup = async () => {
  try {
    const connection = await amqp.connect(CONNECTION_STRING);
    const channel = await connection.createChannel();

    channel.assertQueue(QUEUE, {
      durable: true,
    });

    channel.consume(QUEUE, msg => {
      if (!msg) {
        return;
      }

      try {
        const content = JSON.parse(msg.content.toString());

        switch (content.type) {
          case 'sign-up': {
            const { email, activationCode } = content;
            sendSignUp('Welcome to Cartostory', ['zimmicz@gmail.com']);
          }
        }
      } catch (e) {
        console.error('e-mail failed', e);
      }
    }, {
      noAck: true
    })
  } catch (e) {
  }
}

setup();
