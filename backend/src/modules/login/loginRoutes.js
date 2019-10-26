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
      `SELECT user_id, nickname, firstname, lastname, email, password FROM users WHERE email = '${email}' AND active = true LIMIT 1;`,
    );

    const user = dbResponse[0];

    if (!user) {
      // Fot not found user, we should return same error as for bad password to not allowed guesing emails/emails
      return res.status(401).json({ error: '401: Not authenticated.' });
    }

    bcrypt.compare(password, user.password, function(err, result) {
      if (result) {
        const token = getJwtToken(user);

        res.json({
          token,
          user,
        });
      } else {
        res.status(401).json({ error: '401: Not authenticated.' });
      }
    });
  },
);

export default router;
