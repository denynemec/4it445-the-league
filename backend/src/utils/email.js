const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({
  html,
  text,
  emailTo,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const msg = getMailOptions({ html, text, emailTo });

  const result = await sgMail.send(msg, (error) => {
    if (error) {
      onError();
    } else {
      onSuccess();
    }
  });
};


const getMailOptions = ({ html, text, emailTo }) => ({
  to: emailTo,
  from: 'notification@theleague4.com',
  subject: 'The League Registration Confirmation',
  text,
  html,
});
