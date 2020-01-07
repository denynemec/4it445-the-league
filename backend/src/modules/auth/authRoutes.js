import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import {
  getLoginSuccessPayload,
  formatErrors,
  Hashids,
  sendEmail,
} from '../../utils';

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
      'SELECT user_id, password FROM users WHERE email = ? AND active = true LIMIT 1;',
      [email],
    );

    if (!dbResponse[0]) {
      // For not found user, we should return same error as for bad password to not allowed guesing emails
      return res.status(401).json({ error: '401: Not authenticated.' });
    }

    const { password: passwordHash, user_id: userId } = dbResponse[0];

    bcrypt.compare(password, passwordHash, async function(err, result) {
      if (result) {
        const loginSuccessPayload = await getLoginSuccessPayload({
          userId,
          dbConnection,
        });

        dbConnection.query(
          'UPDATE users SET lastlogin = NOW() WHERE user_id = ?;',
          [userId],
        );

        res.json(loginSuccessPayload);
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

    const [userId] = Hashids.decode(userHash);

    const dbResponse = await dbConnection.query(
      'UPDATE users SET nickname = ?, firstname = ?, lastname = ?, active = true, updated_at = NOW() WHERE user_id = ? AND active = false;',
      [nickname, firstName, lastName, userId],
    );

    if (dbResponse.affectedRows === 0) {
      return res.status(422).json({ error: '422: Not existing user' });
    }

    const userDetail = await dbConnection.query(
      'SELECT email FROM users WHERE user_id = ? AND active = true;',
      [userId],
    );

    if (userDetail.length > 0) {
      const { email } = userDetail[0];
      const lobbyInvitation = await dbConnection.query(
        'SELECT invitation_id, lobby_id FROM invitation WHERE email = ? AND approved = true;',
        [email],
      );
      if (lobbyInvitation && lobbyInvitation.length > 0) {
        lobbyInvitation.map(async invitation => {
          const { invitation_id: invitationId, lobby_id: lobbyId } = invitation;
          await dbConnection.query(
            'INSERT INTO lobby_user (user_id, lobby_id) VALUES (?, ?);',
            [userId, lobbyId],
          );
          await dbConnection.query(
            'DELETE FROM invitation WHERE invitation_id = ?;',
            [invitationId],
          );
        });
      }
    }
    const loginSuccessPayload = await getLoginSuccessPayload({
      userId,
      dbConnection,
    });

    res.json(loginSuccessPayload);
  },
);

router.post(
  '/reset-password',
  [
    check('email')
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
      body: { email },
    } = req;

    // validate if email is already registered
    const dbResponseUserWithEmail = await dbConnection.query(
      'SELECT user_id FROM users WHERE email = ?;',
      [email],
    );

    if (!dbResponseUserWithEmail[0]) {
      return res.status(422).json({ error: '422: This email not registered' });
    }

    const userHashId = Hashids.encode(dbResponseUserWithEmail[0].user_id);
    dbConnection.query(
      'INSERT INTO password_resets (email, token, created_at) VALUES (?, ?, NOW());',
      [email, userHashId],
      function(err) {
        if (err) {
          if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            console.log('Duplication');
          }
        }
      },
    );

    const resetPasswordFeAppLink = `${
      req.headers['x-the-league-app-reset-password-url']
    }/${userHashId}`;

    sendEmail({
      emailTo: email,
      subject: 'The League Reset Password Confirmation',
      text: 'The League 4',
      html: `<strong>The League 4</strong> <br /> <a href='${resetPasswordFeAppLink}' target="_blank">Pro změnu hesla klikněte na tento link... </a>`,
      onSuccess: () => res.json({ email }),
      onError: () => {
        console.error(error);

        return res.status(500).json({ error: '500: Internal Server Error' });
      },
    });
  },
);

router.put(
  '/reset-password-confirmation',
  [
    check('userHash')
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
      body: { userHash, password },
    } = req;

    const passwordRequest = await dbConnection.query(
      'SELECT email, token FROM password_resets WHERE token = ? LIMIT 1;',
      [userHash],
    );
    if (passwordRequest.length < 1) {
      return res
        .status(422)
        .json({ error: '422: Password reset token expired.' });
    }

    const [userId] = Hashids.decode(userHash);

    bcrypt.hash(password, 10, async (error, hash) => {
      if (!error) {
        await dbConnection.query(
          'UPDATE users SET password = ? where user_id = ?;',
          [hash, userId],
        );

        const loginSuccessPayload = await getLoginSuccessPayload({
          userId,
          dbConnection,
        });

        dbConnection.query('DELETE FROM password_resets WHERE token = ?', [
          userHash,
        ]);

        res.json(loginSuccessPayload);
      } else {
        return res.status(500).json({ error: '500: Internal Server Error' });
      }
    });
  },
);

export default router;
