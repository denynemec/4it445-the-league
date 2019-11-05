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
  res.json({});
});

router.get('/:lobbyId/fetchDraft', async (req, res, next) => {
  const { lobbyId } = req.params;

  const dbConnection = req[DB_CONNECTION_KEY];

  const dbResponseNumber = await dbConnection.query(
    `SELECT COUNT(user_id) AS playersCount FROM lobby_user WHERE lobby_id = '${lobbyId}';`,
  );

  const { playersCount: playersCount } = dbResponseNumber[0];

  for (var i = 0; i < playersCount; i++) {
    const dbResponse = await dbConnection.query(
      `UPDATE lobby_user SET draft_order='${i +
        1}' WHERE draft_order IS NULL and lobby_id = '${lobbyId}' ORDER BY RAND() LIMIT 1;`,
    );
    if (dbResponse.affectedRows === 0) {
      return res
        .status(409)
        .json({ error: '409: Draft order already generated' });
    }
  }

  const dbResponse = await dbConnection.query(
    `SELECT users.nickname, lobby_user.user_id, lobby_user.draft, lobby_user.draft_order FROM lobby_user JOIN users ON lobby_user.user_id = users.user_id WHERE lobby_id = '${lobbyId}' ORDER BY lobby_user.draft_order;`,
  );

  res.json(dbResponse);
});

export default router;
