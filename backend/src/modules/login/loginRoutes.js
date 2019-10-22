import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';

const router = Router();

router.post('/login', async (req, res, next) => {
  const bcrypt = require('bcrypt');
  const dbConnection = req[DB_CONNECTION_KEY];
  const {
    body: { username, password },
  } = req;
  if (!username) {
    res.status(400);
    res.json({ error: '400: Bad request - empty username' });

    return;
  }

  if (!password) {
    res.status(400);
    res.json({ error: '400: Bad request - empty password' });

    return;
  }

  const dbResponse = await dbConnection.query(
    `SELECT user_id, nickname, firstname, lastname, email, password FROM users WHERE email = '${username}' AND active = true LIMIT 1;`,
  );

  const user = dbResponse[0];

  // mocked currently - TODO fix
  res.json({
    token: 'mock-token',
    user: user,
  });

  return;

  if (!user) {
    res.status(401);
    // Fot not found user, we should return same error as for bad password to not allowed guesing usernames
    res.json({ error: '401: Not authenticated.' });
    return;
  }

  bcrypt.compare(password, user.password, function(err, result) {
    if (result) {
      res.json({
        token: 'mock-token',
        user: user,
      });
    } else {
      res.status(401);
      res.json({ error: '401: Not authenticated.' });
    }
  });
});

export default router;
