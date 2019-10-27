import { Router } from 'express';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors } from '../../utils/errors';
import { getJwtToken } from '../../utils/jwtToken';

const router = Router();

router.post(
  '/login',
  [check('email').isEmail(), check('password').exists()],
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

router.put(
  '/activate-user',
  [
    check('userId')
      .not()
      .isEmpty(),
    check('nickname')
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
      body: { userId, nickname },
    } = req;

    const dbResponse = await dbConnection.query(
      `UPDATE users SET nickname = '${nickname}', active = true WHERE user_id = '${userId}' AND active = false;`,
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
