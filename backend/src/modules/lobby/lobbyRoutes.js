import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { mocks } from '../../mocks';
const router = Router();

router.get('/list', (req, res, next) => {
  res.json(mocks.lobbyList);
});

router.post('/newLobby', (req, res, next) => {
  res.json({ lobbyId: 1 });
});

router.get('/:lobbyId', (req, res, next) => {
  res.json({ playerList: mocks.playerList, gamerList: mocks.gamerList });
});

export default router;
