import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';

import { Mailer } from 'nodemailer';

import bcrypt from 'bcrypt';

const router = Router();

router.use('/registration', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];

  const data = req.body;

  const { email, password } = data;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const dbResponse = await dbConnection.query(
    `INSERT INTO users (user_id, nickname, password, firstname, lastname, email, hash, credit, avatar, lastlogin, created_at, updated_at)

  VALUES (NULL, NULL, ?, NULL, NULL, ?, NULL, NULL, NULL, NULL, NOW(), NULL);`,

    [hashedPassword, email],
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword',
    },
  });

  const mailOptions = {
    from: 'youremail@gmail.com',
    to: `${req.body.email}`,
    subject: 'Registration confirmation',
    html: 'LINK',
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  console.log('DB response', dbResponse);

  return;
});

export default router;
