import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';
const router = Router();

router.get('/list', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];
  const dbResponse = await dbConnection.query(
    'SELECT game_id, country, sport_id, name, date_from, date_to, location, description, min_users, max_users FROM game WHERE active = true;',
  );
  const eventList = dbResponse.map(({game_id: id, date_from: startDate, date_to: endDate, ...rest}) => ({id, startDate, endDate, ...rest}));
  res.json(eventList);
});

router.get('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;
  const { userId } = req.jwtDecoded;
  const dbConnection = req[DB_CONNECTION_KEY];
  const eventDetail = await dbConnection.query(
    'SELECT game_id, country, sport_id, name, date_from, date_to, location, description, min_users, max_users FROM game WHERE active = true AND game_id = ?;', 
    [eventId],
  );
  const dbResponse = await dbConnection.query(
    'SELECT lobby.lobby_id, lobby.name, game.name as eventName, leader_id, private, max_players, min_users, max_users, count(lobby_user.user_id) as joinedUsers FROM lobby LEFT JOIN game ON game.game_id = lobby.game_id LEFT JOIN lobby_user ON lobby.lobby_id = lobby_user.lobby_id WHERE lobby.game_id = ? AND lobby_user.user_id = ? AND lobby.active = true GROUP BY lobby.lobby_id;', 
    [eventId, userId],
  );
  const lobbyList = dbResponse.map(({lobby_id: id, min_users: minimumUsers, max_players: maxUsers, ...rest}) => ({id, minimumUsers, maxUsers, ...rest}));

  res.json({
    id: eventId,
    name: eventDetail[0].name,
    startDate: eventDetail[0].date_from,
    endDate: eventDetail[0].date_to,
    description: eventDetail[0].description,
    lobbyList,
  });
});

export default router;
