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
      'SELECT user_id, nickname, password FROM users WHERE email = ? AND active = true LIMIT 1;',
      [email],
    );

    if (!dbResponse[0]) {
      // For not found user, we should return same error as for bad password to not allowed guesing emails
      return res.status(401).json({ error: '401: Not authenticated.' });
    }

    const { password: passwordHash, user_id, nickname } = dbResponse[0];

    bcrypt.compare(password, passwordHash, function(err, result) {
      if (result) {
        const token = getJwtToken({ userId: user_id });

        res.json({
          token,
          user: { nickname },
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
      'SELECT user_id FROM users WHERE email = ?;',
      [email],
    );

    if (dbResponseUserWithEmail[0]) {
      return res
        .status(422)
        .json({ error: '422: This email is already registered' });
    }

    bcrypt.hash(password, 10, async (error, hash) => {
      if (!error) {
        const dbResponse = await dbConnection.query(
          `INSERT INTO users (user_id, email, password, active, created_at, updated_at) 
      VALUES (NULL, ?, ?, ?, NOW(), NOW());`,
          [email, hash, false],
        );

        const newUserHashId = Hashids.encode(dbResponse.insertId);

        const registrationConfirmFeAppLink = `${
          req.headers['x-the-league-app-activate-user-url']
        }/${newUserHashId}`;

        sendEmail({
          emailTo: email,
          subject: 'The League Registration Confirmation',
          text: 'The League 4',
          html: `<strong>The League 4</strong> <br /> <a href='${registrationConfirmFeAppLink}'>Pro potvrzení registrace klikněte na tento link... </a>`,
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
      'UPDATE users SET nickname = ?, firstname = ?, lastname = ?, active = true, updated_at = NOW() WHERE user_id = ? AND active = false;',
      [nickname, firstName, lastName, userId],
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

router.post(
  '/reset-password',
  [
    check('email')
      .not()
      .isEmpty(),
  ],
  (req, res, next) => {
    const {
      body: { email, password },
    } = req;

    res.json({ email });
  },
);

export default router;
