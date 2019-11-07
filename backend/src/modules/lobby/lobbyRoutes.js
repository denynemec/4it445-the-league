import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';
const router = Router();

router.get('/list', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];
  const { userId } = req.jwtDecoded;
  const dbResponse = await dbConnection.query(
    'SELECT lobby.lobby_id, lobby.name, game.name as eventName, leader_id, private, max_players, min_users, max_users, count(lobby_user.user_id) as joinedUsers FROM lobby LEFT JOIN game ON game.game_id = lobby.game_id LEFT JOIN lobby_user ON lobby.lobby_id = lobby_user.lobby_id WHERE lobby_user.user_id = ? AND lobby.active = true GROUP BY lobby.lobby_id;',
    [userId],
  );
  const lobbyList = dbResponse.map(
    ({
      lobby_id: id,
      min_users: minimumUsers,
      max_players: maxUsers,
      ...rest
    }) => ({ id, minimumUsers, maxUsers, ...rest }),
  );
  res.json(lobbyList);
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
    `SELECT COUNT(user_id) AS playersCount FROM lobby_user WHERE lobby_id = ?;`,
    [lobbyId],
  );

  const { playersCount: playersCount } = dbResponseNumber[0];

  const dbResponsePlayers = await dbConnection.query(
    `SELECT user_id FROM lobby_user WHERE lobby_id = ? ORDER BY RAND();`,
    [lobbyId],
  );

  for (var i = 0; i < playersCount; i++) {
    const { user_id: user_id } = dbResponsePlayers[i];
    const dbResponse = await dbConnection.query(
      `UPDATE lobby_user SET draft_order= ? WHERE draft_order IS NULL and lobby_id = ? AND user_id = ? LIMIT 1;`,
      [i + 1, lobbyId, user_id],
    );
    if (dbResponse.affectedRows === 0) {
      return res
        .status(409)
        .json({ error: '409: Draft order already generated' });
    }
  }

  const dbResponse = await dbConnection.query(
    `SELECT users.nickname, lobby_user.user_id, lobby_user.draft, lobby_user.draft_order FROM lobby_user JOIN users ON lobby_user.user_id = users.user_id WHERE lobby_id = ? ORDER BY lobby_user.draft_order;`,
    [lobbyId],
  );

  res.json(dbResponse);
});

export default router;
