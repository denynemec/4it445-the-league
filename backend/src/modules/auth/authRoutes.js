import { Router } from 'express';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { getJwtToken, formatErrors, Hashids, sendEmail } from '../../utils';

const router = Router();

router.post(
  '/login',
  [
    check('email').isEmail(),
    check('password')
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const dbConnection = req[DB_CONNECTION_KEY];
    const {
      body: { email, password },
    } = req;

    const dbResponse = await dbConnection.query(
      `SELECT user_id, nickname, password FROM users WHERE email = '${email}' AND active = true LIMIT 1;`,
    );

    if (!dbResponse[0]) {
      // For not found user, we should return same error as for bad password to not allowed guesing emails/emails
      return res.status(401).json({ error: '401: Not authenticated.' });
    }

    const { password: passwordHash, user_id, ...userData } = dbResponse[0];

    bcrypt.compare(password, passwordHash, function(err, result) {
      if (result) {
        const token = getJwtToken({ userId: user_id });

        res.json({
          token,
          user: userData,
        });
      } else {
        res.status(401).json({ error: '401: Not authenticated.' });
      }
    });
  },
);

router.post(
  '/register-user',
  [
    check('email')
      .not()
      .isEmpty(),
    check('password')
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const dbConnection = req[DB_CONNECTION_KEY];
    const {
      body: { email, password },
    } = req;

    // validate if email is already registered
    const dbResponseUserWithEmail = await dbConnection.query(
      `SELECT user_id FROM users WHERE email = '${email}';`,
    );

    if (dbResponseUserWithEmail[0]) {
      return res
        .status(422)
        .json({ error: '422: This email is already registered' });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (!err) {
        const dbResponse = await dbConnection.query(
          `INSERT INTO users (user_id, email, password, active, nickname, firstname, lastname) 
      VALUES (NULL, ?, ?, ?, ?, ?, ?);`,
          [email, hash, false, '', '', ''],
        );

        const newUserHashId = Hashids.encode(dbResponse.insertId);

        const registrationConfirmFeAppLink = `${
          req.headers['x-the-league-app-publicurl']
        }/activate-user/${newUserHashId}`;

        // TOFIX need to fix send to email service - then remove console.log(...)
        console.log(registrationConfirmFeAppLink);

        sendEmail({
          emailTo: email,
          text: 'The League',
          html: `<link href='${registrationConfirmFeAppLink}'>Pro potvrzení registrace klikněte na tento link... </link>`,
          onSuccess: () => res.json({ email }),
          onError: () => {
            console.error(error);

            return res
              .status(500)
              .json({ error: '500: Internal Server Error' });
          },
        });
      } else {
        return res.status(500).json({ error: '500: Internal Server Error' });
      }
    });
  },
);

router.put(
  '/activate-user',
  [
    check('userHash')
      .not()
      .isEmpty(),
    check('nickname')
      .not()
      .isEmpty(),
    check('firstName')
      .not()
      .isEmpty(),
    check('lastName')
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const dbConnection = req[DB_CONNECTION_KEY];
    const {
      body: { userHash, nickname, firstName, lastName },
    } = req;

    const userId = Hashids.decode(userHash);

    const dbResponse = await dbConnection.query(
      `UPDATE users SET nickname = '${nickname}', firstname = '${firstName}', lastname = '${lastName}', active = true WHERE user_id = '${userId}' AND active = false;`,
    );

    if (dbResponse.affectedRows === 0) {
      return res.status(422).json({ error: '422: Not existing user' });
    }

    const token = getJwtToken({ userId });

    res.json({
      token,
      user: { nickname },
    });
  },
);

export default router;
