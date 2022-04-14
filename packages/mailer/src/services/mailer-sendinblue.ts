// @ts-ignore
import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey =
  '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';
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

export const send = (
  to: Array<{ email: string }>,
  subject: string,
  message: string
) => {
  sendSmtpEmail.sender = {
    name: 'Michal Zimmermann',
    email: 'cartostory@gmail.com',
  };
  sendSmtpEmail.to = to;
  sendSmtpEmail.htmlContent = message;
  sendSmtpEmail.subject = subject;
  // @ts-ignore
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: unknown) {
      console.log('API called successfully. Returned data: ' + data);
      // @ts-ignore
    },
    function (error: unknown) {
      console.error(error);
    }
  );
};
