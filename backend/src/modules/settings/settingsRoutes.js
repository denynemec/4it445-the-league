import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors } from '../../utils/errors';

const router = Router();

router.get('/settings', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];

  const { userId } = req.jwtDecoded;

  const dbResponse = await dbConnection.query(
    'SELECT firstname, lastname, nickname FROM users WHERE user_id = ? AND active = true;',
    [userId],
  );

  const { firstname: firstName, lastname: lastName, nickname } = dbResponse[0];

  res.json({ firstName, lastName, nickname });
});

router.put(
  '/update-settings',
  [
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
      body: { nickname, firstName, lastName },
    } = req;
    const { userId } = req.jwtDecoded;

    await dbConnection.query(
      'UPDATE users SET nickname = ?, firstname = ?, lastname = ?, active = true WHERE user_id = ? AND active = true;',
      [nickname, firstName, lastName, userId],
    );

    res.json({ nickname });
  },
);

router.put(
  '/update-password',
  [
    check('oldPassword')
      .not()
      .isEmpty(),
    check('newPassword')
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
      body: { oldPassword, newPassword },
    } = req;
    const { userId } = req.jwtDecoded;

    const dbResponse = await dbConnection.query(
      'SELECT password FROM users WHERE user_id = ? AND active = true;',
      [userId],
    );

    const { password: passwordHash } = dbResponse[0];

    bcrypt.compare(oldPassword, passwordHash, function(errorCompare, result) {
      if (result) {
        bcrypt.hash(newPassword, 10, async (errorHash, hash) => {
          if (!errorHash) {
            const a = await dbConnection.query(
              'UPDATE users SET password = ? WHERE user_id = ? AND active = true;',
              [hash, userId],
            );

            res.json({ userId, message: 'Pasword changed' });
          } else {
            return res
              .status(500)
              .json({ error: '500: Internal server error' });
          }
        });
      } else {
        return res.status(422).json({ error: '422: Wrong old password' });
      }
    });
  },
);

export default router;
