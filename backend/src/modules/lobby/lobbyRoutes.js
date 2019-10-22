import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { mocks } from '../../mocks';
const router = Router();

router.get('/list', (req, res, next) => {
  res.json(mocks.lobbyList);
});

router.post('/newLobby', (req, res, next) => {
  res.json({ id: 1 });
});

export default router;
