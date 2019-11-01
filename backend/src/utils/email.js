const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({
  html,
  text,
  subject,
  emailTo,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const msg = getMailOptions({ html, text, subject, emailTo });

  await sgMail.send(msg, error => {
    if (error) {
      onError();
    } else {
      onSuccess();
    }
  });
};

const getMailOptions = ({ html, text, subject, emailTo }) => ({
  to: emailTo,
  from: 'notification@theleague4.com',
  subject,
  text,
  html,
});
