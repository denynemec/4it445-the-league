import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { mocks } from '../../mocks';

const router = Router();

router.post('/', async (req, res, next) => {
    // test
    const dbConnection = req[DB_CONNECTION_KEY];
    const {
      body: { username, password },
    } = req;
    if (!username) {
      handleError({ code: 400, error: '400: Bad request - empty username', res });
  
      return;
    }
  
    if (!password) {
      handleError({ code: 400, error: '400: Bad request - empty password', res });
  
      return;
    }
    
    const dbResponse = await dbConnection.query(
        `SELECT user_id, nickname, firstname, lastname, email FROM users WHERE email = '${username}' LIMIT 1;`,
      );

    const user = dbResponse[0];

    
    if (!user) {
        res.status(401);
        res.json({ error: true, msg: 'User not found.' });
        return;
    }
  
    res.json({
      token: 'mock-token',
      user: user,
    });
  });

  const handleError = ({ code, error, res }) => {
    res.status(code);
    res.json({ error });
   };
  
  export default router;
  