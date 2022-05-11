// @ts-expect-error
import SibApiV3Sdk from 'sib-api-v3-sdk'

const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = ''
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

export const send = (
  to: Array<{ email: string }>,
  subject: string,
  message: string,
) => {
  sendSmtpEmail.sender = {
    name: 'Michal Zimmermann',
    email: 'cartostory@gmail.com',
  }
  sendSmtpEmail.to = to
  sendSmtpEmail.htmlContent = message
  sendSmtpEmail.subject = subject
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: unknown) {
      console.log('API called successfully. Returned data: ' + data)
    },
    function (error: unknown) {
      console.error(error)
    },
  )
}
