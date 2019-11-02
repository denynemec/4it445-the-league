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
  const lobbyList = dbResponse.map(({lobby_id: id, min_users: minimumUsers, max_players: maxUsers, ...rest}) => ({id, minimumUsers, maxUsers, ...rest}));
  res.json(lobbyList);
});

router.post('/newLobby', (req, res, next) => {
  res.json({ lobbyId: 1 });
});

router.get('/:lobbyId', (req, res, next) => {
  res.json({});
});

export default router;
