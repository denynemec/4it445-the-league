import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { formatErrors } from '../../../utils';

import { DB_CONNECTION_KEY } from '../../../libs/connection';

const router = Router({ mergeParams: true });

router.get(
  '/currentUser',
  [check('lobbyId').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const { lobbyId } = req.params;
    const dbConnection = req[DB_CONNECTION_KEY];
    const { userId } = req.jwtDecoded;

    const nextUpcomingMatch = await dbConnection.query(
      `SELECT matches.match_id, matches.round AS match_round, matches.date AS match_date, game.name AS event
      FROM matches matches
      LEFT JOIN game game on matches.game_id=game.game_id
      LEFT JOIN lobby lobby on lobby.game_id=matches.game_id
      WHERE matches.finished = 0
      AND lobby.lobby_id = ?
      ORDER BY matches.date ASC LIMIT 1`,
      [lobbyId],
    );

    const matchId = nextUpcomingMatch[0].match_id;

    const nominatedPlayersCurrentUser = await dbConnection.query(
      `SELECT player.player_id AS playerId, player.firstName, player.lastName, pr.post_abbr AS position, team.name AS team
      FROM nomination nom
      INNER JOIN player player on nom.player_id=player.player_id
      INNER JOIN lobby lobby on nom.lobby_id=lobby.lobby_id
      INNER JOIN player_game pg on player.player_id=pg.player_id AND lobby.game_id=pg.game_id
      INNER JOIN team team on pg.team_id=team.team_id
      INNER JOIN player_role pr on pg.post_abbr=pr.post_abbr
      WHERE nom.lobby_id = ?
      AND nom.user_id = ?
      AND nom.match_id = ?`,
      [lobbyId, userId, matchId],
    );

    const draftedPlayersCurrentUser = await dbConnection.query(
      `SELECT player.player_id AS playerId, player.firstName, player.lastName, pr.post_abbr AS position, team.name AS team
      FROM draft draft
      INNER JOIN player player on draft.player_id=player.player_id
      INNER JOIN lobby lobby on draft.lobby_id=lobby.lobby_id
      INNER JOIN player_game pg on player.player_id=pg.player_id AND lobby.game_id=pg.game_id
      INNER JOIN team team on pg.team_id=team.team_id
      INNER JOIN player_role pr on pg.post_abbr=pr.post_abbr
      WHERE draft.lobby_id = ?
      AND draft.user_id = ?`,
      [lobbyId, userId],
    );

    res.json({
      nextUpcomingMatch,
      nominatedPlayersCurrentUser,
      draftedPlayersCurrentUser,
      currentUser: userId,
      nextMatchId: matchId,
    });
  },
);

router.post(
  '/nominatePlayers',
  [check('lobbyId').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const { lobbyId } = req.params;
    const { playerId, matchId } = req.body;
    const { userId } = req.jwtDecoded;
    const dbConnection = req[DB_CONNECTION_KEY];

    const isDuplicate = await dbConnection.query(
      'SELECT * FROM nomination WHERE user_id = ? AND lobby_id = ? AND player_id = ? AND match_id = ?;',
      [userId, lobbyId, playerId, matchId],
    );

    if (isDuplicate) {
      return res.status(422).json({
        error: '422: You can not select player which is already selected.',
      });
    }

    await dbConnection.query(
      'INSERT INTO nomination (user_id, lobby_id, player_id, match_id) VALUES (?, ?, ?, ?);',
      [userId, lobbyId, playerId, matchId],
    );

    res.json({ message: 'Player/s nominated successfully' });
  },
);

router.delete(
  '/removePlayerNomination',
  [check('lobbyId').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const { lobbyId } = req.params;
    const { playerId, matchId } = req.body;
    const { userId } = req.jwtDecoded;
    const dbConnection = req[DB_CONNECTION_KEY];

    await dbConnection.query(
      'DELETE FROM nomination WHERE user_id = ? AND lobby_id = ? AND player_id = ? AND match_id = ?;',
      [userId, lobbyId, playerId, matchId],
    );

    res.json({ message: 'Player/s unnominated successfully' });
  },
);

export default router;
