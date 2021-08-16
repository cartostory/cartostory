import { send as sendInBlueSend } from './mailer-sendinblue';

type Provider = 'sendinblue' | 'filesystem';

let provider: Provider = 'sendinblue';

export const useProvider = (newProvider: Provider) => {
  provider = newProvider;
}

const send = (subject: string) => (message: string, to: Array<string>) => {
  switch (provider) {
    case 'sendinblue':
      return sendInBlueSend(to.map(email => ({ email })), subject, message);
  }
}

export const sendSignUp = send('Welcome to Cartostory');
