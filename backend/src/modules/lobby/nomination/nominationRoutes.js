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
      FROM nomination_work nw
      INNER JOIN player player on nw.player_id=player.player_id
      INNER JOIN lobby lobby on nw.lobby_id=lobby.lobby_id
      INNER JOIN player_game pg on player.player_id=pg.player_id AND lobby.game_id=pg.game_id
      INNER JOIN team team on pg.team_id=team.team_id
      INNER JOIN player_role pr on pg.post_abbr=pr.post_abbr
      WHERE nw.lobby_id = ?
      AND nw.user_id = ?
      AND nw.match_id = ?`,
      [lobbyId, userId, matchId],
    );

    const confirmedPlayersNomination = await dbConnection.query(
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
      confirmedPlayersNomination,
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
      'SELECT COUNT (*) AS count FROM nomination_work WHERE user_id = ? AND lobby_id = ? AND player_id = ? AND match_id = ?;',
      [userId, lobbyId, playerId, matchId],
    );

    if (isDuplicate[0].count > 0) {
      return res.status(422).json({
        error: '422: You can not select player which is already selected.',
      });
    }

    await dbConnection.query(
      'INSERT INTO nomination_work (user_id, lobby_id, player_id, match_id) VALUES (?, ?, ?, ?);',
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
      'DELETE FROM nomination_work WHERE user_id = ? AND lobby_id = ? AND player_id = ? AND match_id = ?;',
      [userId, lobbyId, playerId, matchId],
    );

    res.json({ message: 'Player/s unnominated successfully' });
  },
);

router.get(
  '/validate',
  [check('lobbyId').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const { lobbyId } = req.params;
    const { userId } = req.jwtDecoded;
    const dbConnection = req[DB_CONNECTION_KEY];

    const minDefenders = 3;
    const minMidfielders = 3;
    const minAttackers = 1;

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

    const playersCount = await dbConnection.query(
      'SELECT COUNT (*) AS count FROM nomination_work WHERE user_id = ? AND lobby_id = ? AND match_id = ?;',
      [userId, lobbyId, matchId],
    );

    const nominatedPlayersRolesCount = await dbConnection.query(
      `SELECT pg.post_abbr AS position, COUNT(pg.post_abbr) AS count FROM nomination_work nw
      LEFT JOIN lobby l on nw.lobby_id=l.lobby_id
      LEFT JOIN player_game pg on nw.player_id=pg.player_id AND l.game_id=pg.game_id
      LEFT JOIN player p on pg.player_id=p.player_id
      WHERE nw.lobby_id = ? AND nw.user_id = ? AND nw.match_id = ?
      GROUP BY pg.post_abbr;`,
      [lobbyId, userId, matchId],
    );

    const draftedPlayersRolesCount = await dbConnection.query(
      `SELECT pg.post_abbr AS position, COUNT(pg.post_abbr) AS count FROM draft d
      LEFT JOIN lobby l on d.lobby_id=l.lobby_id
      LEFT JOIN player_game pg on d.player_id=pg.player_id AND l.game_id=pg.game_id
      LEFT JOIN player p on pg.player_id=p.player_id
      WHERE d.lobby_id = ? AND d.user_id = ?
      GROUP BY pg.post_abbr;`,
      [lobbyId, userId],
    );

    const nominatedGoalkeepersCount = nominatedPlayersRolesCount.find(
      ({ position }) => position === 'GK',
    ) || { position: 'GK', count: 0 };

    const nominatedDefendersCount = nominatedPlayersRolesCount.find(
      ({ position }) => position === 'D',
    ) || { position: 'D', count: 0 };

    const nominatedMidfieldersCount = nominatedPlayersRolesCount.find(
      ({ position }) => position === 'M',
    ) || { position: 'M', count: 0 };

    const nominatedAttackersCount = nominatedPlayersRolesCount.find(
      ({ position }) => position === 'F',
    ) || { position: 'F', count: 0 };

    const draftedGoalkeepersCount = draftedPlayersRolesCount.find(
      ({ position }) => position === 'GK',
    ) || { position: 'GK', count: 0 };

    const draftedDefendersCount = draftedPlayersRolesCount.find(
      ({ position }) => position === 'D',
    ) || { position: 'D', count: 0 };

    const draftedMidfieldersCount = draftedPlayersRolesCount.find(
      ({ position }) => position === 'M',
    ) || { position: 'M', count: 0 };

    const draftedAttackersCount = draftedPlayersRolesCount.find(
      ({ position }) => position === 'F',
    ) || { position: 'F', count: 0 };

    const draftedFullPositionsCount = [
      draftedGoalkeepersCount,
      draftedDefendersCount,
      draftedMidfieldersCount,
      draftedAttackersCount,
    ];

    let filledPositionsCount = 0;

    draftedFullPositionsCount.forEach(pos => {
      if (pos.position === 'D' && pos.count < minDefenders) {
        filledPositionsCount += minDefenders - pos.count;
      }

      if (pos.position === 'M' && pos.count < minMidfielders) {
        filledPositionsCount += minMidfielders - pos.count;
      }

      if (pos.position === 'F' && pos.count < minAttackers) {
        filledPositionsCount += minAttackers - pos.count;
      }
    });

    res.json({
      playersCount,
      nominatedGoalkeepersCount,
      nominatedDefendersCount,
      nominatedMidfieldersCount,
      nominatedAttackersCount,
      draftedFullPositionsCount,
      filledPositionsCount,
    });
  },
);

router.post(
  '/submit',
  [check('lobbyId').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const { lobbyId } = req.params;
    const { matchId } = req.body;
    const { userId } = req.jwtDecoded;
    const dbConnection = req[DB_CONNECTION_KEY];

    const nominationWorkTable = await dbConnection.query(
      `SELECT * FROM nomination_work WHERE lobby_id = ? AND user_id = ? AND match_id = ?`,
      [lobbyId, userId, matchId],
    );

    for (const row of nominationWorkTable) {
      const isNominated = await dbConnection.query(
        `SELECT COUNT(*) AS count FROM nomination WHERE user_id = ? AND lobby_id = ? AND player_id = ? AND match_id = ?;`,
        [row.user_id, row.lobby_id, row.player_id, row.match_id],
      );

      if (isNominated[0].count === 0) {
        await dbConnection.query(
          `INSERT INTO nomination (user_id, lobby_id, player_id, match_id) VALUES (?, ?, ?, ?)`,
          [row.user_id, row.lobby_id, row.player_id, row.match_id],
        );
      }
    }

    res.json({ message: 'Players nomination created successfully' });
  },
);

router.post(
  '/automaticPick',
  [check('lobbyId').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const { lobbyId } = req.params;
    const { userId } = req.jwtDecoded;
    const dbConnection = req[DB_CONNECTION_KEY];

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

    const autoGoalkeeper = await dbConnection.query(
      `SELECT d.player_id, d.lobby_id, d.user_id FROM draft d LEFT JOIN player_game pg on d.player_id=pg.player_id
      WHERE pg.post_abbr="GK" AND d.user_id = ? AND d.lobby_id = ?
      ORDER BY d.created_at asc LIMIT 1`,
      [lobbyId, userId],
    );

    const autoDefenders = await dbConnection.query(
      `SELECT d.player_id, d.lobby_id, d.user_id FROM draft d LEFT JOIN player_game pg on d.player_id=pg.player_id
      WHERE pg.post_abbr="D" AND d.user_id = ? AND d.lobby_id = ?
      ORDER BY d.created_at asc LIMIT 3`,
      [lobbyId, userId],
    );

    const autoMidfielders = await dbConnection.query(
      `SELECT d.player_id, d.lobby_id, d.user_id FROM draft d LEFT JOIN player_game pg on d.player_id=pg.player_id
      WHERE pg.post_abbr="M" AND d.user_id = ? AND d.lobby_id = ?
      ORDER BY d.created_at asc LIMIT 4`,
      [lobbyId, userId],
    );

    const autoAttackers = await dbConnection.query(
      `SELECT d.player_id, d.lobby_id, d.user_id FROM draft d LEFT JOIN player_game pg on d.player_id=pg.player_id
      WHERE pg.post_abbr="F" AND d.user_id = ? AND d.lobby_id = ?
      ORDER BY d.created_at asc LIMIT 3`,
      [lobbyId, userId],
    );

    const autoTeam = [
      autoGoalkeeper,
      autoDefenders,
      autoMidfielders,
      autoAttackers,
    ];

    for (const row of autoTeam) {
      const isNominated = await dbConnection.query(
        `SELECT COUNT(*) AS count FROM nomination WHERE user_id = ? AND lobby_id = ? AND player_id = ? AND match_id = ?;`,
        [row.user_id, row.lobby_id, row.player_id, matchId],
      );

      if (isNominated[0].count === 0) {
        await dbConnection.query(
          `INSERT INTO nomination (user_id, lobby_id, player_id, match_id) VALUES (?, ?, ?, ?)`,
          [row.user_id, row.lobby_id, row.player_id, matchId],
        );
      }
    }
  },
);

export default router;
