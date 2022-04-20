import fs from 'fs/promises'
import path from 'path'
import { send as sendInBlueSend } from './mailer-sendinblue'
import handlebars from 'handlebars'

type Provider = 'sendinblue' | 'filesystem'

let provider: Provider = 'filesystem'

export const useProvider = (newProvider: Provider) => {
  provider = newProvider
}

const send =
  (subject: string) =>
  (template: 'sign-up') =>
  (params: Record<string, string>) =>
  async (to: Array<string>) => {
    if (provider === 'filesystem') {
      console.log('******** using filesystem *********')
    }
    try {
      const templateFile = await fs.readFile(
        path.resolve(__dirname, `../../templates/${template}.handlebars`),
        'utf-8',
      )
      const templateSpec = handlebars.compile(templateFile)

      switch (provider) {
        case 'sendinblue':
          return sendInBlueSend(
            to.map(email => ({ email })),
            subject,
            templateSpec(params),
          )
        case 'filesystem':
          console.log('******', templateSpec(params))
          return templateSpec(params)
      }
    } catch (e) {
      console.error(e)
    }
  }

export const sendSignUp = send('Welcome to Cartostory')('sign-up')
