import { Router } from 'express';

import jwt from 'jsonwebtoken';

import { DB_CONNECTION_KEY } from '../../libs/connection';

import { Mailer } from 'nodemailer';

import bcrypt from 'bcrypt';

const secretKey = 'ThisIsVerySecretIndeed';

const router = Router();

router.use('/registration', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];

  const data = req.body;

  const { email, password } = data;

  const hashedPassword = bcrypt.hashSync(email, 10);

  const dbResponse = await dbConnection.query(
    `INSERT INTO user (user_id, nickname, password, firstname, lastname, email, hash, credit, avatar, lastlogin, created_at, updated_at)

  VALUES (NULL, NULL, ?, NULL, NULL, ?, NULL, NULL, NULL, NULL, NOW(), NULL);`,

    [hashedPassword, password],
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

  const token = jwt.sign({ id: dbResponse.insertId }, secretKey);

  const userObject = {
    id: dbResponse.insertId,

    email,
    nickname,
  };

  res.json({ token: token, user: userObject });

  return;
});

export default router;
