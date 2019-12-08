import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { formatErrors } from '../../../utils';
import { getDraftState } from './draftState';

import { DB_CONNECTION_KEY } from '../../../libs/connection';

const router = Router({ mergeParams: true });

router.get('/state', [check('lobbyId').isNumeric()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: formatErrors(errors),
    });
  }

  const { lobbyId } = req.params;
  const { userId } = req.jwtDecoded;

  const dbConnection = req[DB_CONNECTION_KEY];

  const dbResponseDraftState = await dbConnection.query(
    'SELECT lobby.lobby_id, user_id, max_players, draft_start_at, draft_paused, draft_time_offset, draft_round_limit, game_id FROM lobby INNER JOIN lobby_user ON (lobby.lobby_id = lobby_user.lobby_id) WHERE lobby.lobby_id = ? AND user_id = ? AND draft_order IS NOT NULL LIMIT 1;',
    [lobbyId, userId],
  );

  if (dbResponseDraftState.length === 0) {
    return res
      .status(409)
      .json({ error: '409: You are not allowed to get data from this draft.' });
  }
  const draftState = dbResponseDraftState[0];
  if (
    draftState.draft_start_at > Date.now() ||
    draftState.draft_start_at === null
  ) {
    return res.status(409).json({ error: '409: Draft have not started yet.' });
  }

  const state = await getDraftState({
    lobbyId,
    userId,
    dbConnection,
    draftState,
  });

  if (state.userOnTurn && state.timeLeft < 0) {
    let dbRandomPlayer;
    // TODO connect to DB
    const pickedPlayerList = [];
    if (pickedPlayerList.length > 0) {
      dbRandomPlayer = await dbConnection.query(
        'SELECT player_id FROM player_game WHERE game_id = ? AND player_id NOT IN ? ORDER BY RAND() LIMIT 1',
        [draftState.game_id, pickedPlayerList],
      );
    } else {
      dbRandomPlayer = await dbConnection.query(
        'SELECT player_id FROM player_game WHERE game_id = ? ORDER BY RAND() LIMIT 1',
        [draftState.game_id],
      );
    }
    dbConnection.query(
      'INSERT INTO draft (user_id, lobby_id, player_id) VALUES (?, ?, ?);',
      [userId, lobbyId, dbRandomPlayer[0].player_id],
    );

    const draftDelay = draftState.draft_time_offset + Math.abs(state.timeLeft);

    dbConnection.query(
      'UPDATE lobby SET draft_time_offset = ? WHERE lobby_id = ?;',
      [draftDelay, lobbyId],
    );
  }

  res.json({
    ...state,
  });
});

router.get(
  '/fullState',
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

    const dbResponseUsers = await dbConnection.query(
      'SELECT user_id FROM lobby_user WHERE draft_order IS NULL and lobby_id = ?;',
      [lobbyId],
    );

    if (dbResponseUsers.length !== 0) {
      return res.status(409).json({ error: '409: Draft order is not defined' });
    }

    const dbResponseDraftState = await dbConnection.query(
      'SELECT lobby.lobby_id, user_id, max_players, draft_start_at, draft_paused, draft_time_offset, draft_round_limit, game_id FROM lobby INNER JOIN lobby_user ON (lobby.lobby_id = lobby_user.lobby_id) WHERE lobby.lobby_id = ? AND user_id = ? AND draft_order IS NOT NULL LIMIT 1;',
      [lobbyId, userId],
    );

    if (dbResponseDraftState.length === 0) {
      return res.status(409).json({
        error: '409: You are not allowed to get data from this draft.',
      });
    }
    const draftState = dbResponseDraftState[0];
    if (
      draftState.draft_start_at > Date.now() ||
      draftState.draft_start_at == null
    ) {
      return res
        .status(409)
        .json({ error: '409: Draft have not started yet.' });
    }

    const dbResponse = await dbConnection.query(
      'SELECT users.nickname, lobby_user.user_id, lobby_user.draft, lobby_user.draft_order FROM lobby_user INNER JOIN users ON lobby_user.user_id = users.user_id WHERE lobby_id = ? ORDER BY lobby_user.draft_order;',
      [lobbyId],
    );

    const draftOrder = dbResponse.map(
      ({ user_id: userId, draft_order: draftOrder, ...rest }) => ({
        userId,
        draftOrder,
        ...rest,
      }),
    );

    const state = await getDraftState({
      lobbyId,
      userId,
      dbConnection,
      draftState,
    });

    // All players
    const dbResponsePlayer = await dbConnection.query(
      'SELECT player_game.player_id, firstname, lastname, number, player_game.post_abbr, player_game.team_ID, team.name FROM player_game INNER JOIN player ON player_game.player_id = player.player_id LEFT JOIN team ON player_game.team_id = team.team_id LEFT JOIN player_role ON player_game.post_abbr = player_role.post_abbr WHERE game_id = ? AND active = true;',
      [draftState.game_id],
    );
    const draftPlayersList = dbResponsePlayer.map(
      ({
        player_id: playerId,
        firstname: firstName,
        lastname: lastName,
        name: team,
        team_id: teamId,
        post_abbr: position,
        ...rest
      }) => ({
        playerId,
        firstName,
        lastName,
        team,
        teamId,
        position,
        ...rest,
      }),
    );

    // draft in progress or paused - set pause and continue can only group owner
    const isPaused = draftState.draft_paused == 0 ? false : true;

    res.json({
      ...state,
      draftOrder,
      isPaused,
      draftPlayersList,
    });
  },
);

router.post(
  '/pickplayer',
  [check('playerId').isNumeric(), check('lobbyId').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const { lobbyId } = req.params;
    const { playerId } = req.body;
    const { userId } = req.jwtDecoded;
    const dbConnection = req[DB_CONNECTION_KEY];

    //TODO: Check if the user is on turn

    // All already drafted players (picked by all users in lobby)
    const dbResponseDraft = await dbConnection.query(
      'SELECT player_id FROM draft WHERE lobby_id = ?',
      [lobbyId],
    );

    const alreadyPicked = dbResponseDraft.find(
      ({ player_id }) => player_id === playerId,
    );

    if (alreadyPicked) {
      return res.status(422).json({
        error: '422: You can not select player which is already selected.',
      });
    }

    await dbConnection.query(
      'INSERT INTO draft (user_id, lobby_id, player_id) VALUES (?, ?, ?);',
      [userId, lobbyId, playerId],
    );

    res.json({ message: 'Player picked successfully' });
  },
);

export default router;
