import nodemailer from 'nodemailer';

export const sendEmail = async ({
  html,
  text,
  emailTo,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const { user, pass } = await nodemailer.createTestAccount();

  const mailOptions = getMailOptions({ html, text, emailTo });

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user, pass },
  });

  const result = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      onError();
    } else {
      onSuccess();
    }
  });

  console.log(result);
};

const getMailOptions = ({ html, text, emailTo }) => ({
  from: 'The league',
  to: emailTo,
  subject: 'The League Registration Confirmation',
  html,
  text,
});
