import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';

const router = Router();

router.get('/events', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];

  const events = await dbConnection.query(
    'SELECT game_id, name FROM game WHERE active = true;',
  );

  const mappedEvents = events.map(({ game_id: value, name: label }) => ({
    value,
    label,
  }));

  res.json(mappedEvents);
});

router.get('/positions/:lobbyId', async (req, res, next) => {
  const { lobbyId } = req.params;
  const dbConnection = req[DB_CONNECTION_KEY];

  const dbLobby = await dbConnection.query(
    'SELECT lobby.game_id, sport_id FROM lobby INNER JOIN game ON game.game_id = lobby.game_id WHERE lobby_id = ? AND lobby.active = true;',
    [lobbyId],
  );
  const dbResponseRole = await dbConnection.query(
    'SELECT post_abbr, name FROM player_role WHERE sport_id = ?;',
    [dbLobby[0].sport_id],
  );
  const positions = dbResponseRole.map(({ name: label, post_abbr: value }) => ({
    label,
    value,
  }));

  res.json(positions);
});

export default router;
