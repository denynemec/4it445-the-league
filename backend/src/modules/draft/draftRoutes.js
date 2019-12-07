import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors, Hashids, sendEmail } from '../../utils';

const router = Router();

router.get('/:lobbyId/draftState', async (req, res, next) => {
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
    draftState.draft_start_at == null
  ) {
    return res.status(409).json({ error: '409: Draft have not started yet.' });
  }

  const dbPlayerOrder = await dbConnection.query(
    'SELECT user_id, draft_order FROM lobby_user WHERE lobby_id = ?;',
    [lobbyId],
  );

  const draftOrder = dbPlayerOrder.find(({ user_id }) => user_id === userId);

  const dbPlayerRound = await dbConnection.query(
    'SELECT user_id, count(user_id) as draftRound FROM draft WHERE lobby_id = ? group by user_id;',
    [lobbyId],
  );
  let draftUser = dbPlayerRound.find(({ user_id }) => user_id === userId);
  if (!draftUser) {
    draftUser = { draftRound: 0 };
  }

  const totalRounds = dbPlayerRound.reduce(function(prev, cur) {
    return prev + cur.draftRound;
  }, 0);

  let secondsOnRound = 0;
  let userOnTurn = false;
  if (isEven(draftUser.draftRound + 1) === true) {
    secondsOnRound =
      (draftUser.draftRound + 1) *
        (draftState.draft_round_limit *
          (draftState.max_players - draftOrder.draft_order + 1)) +
      draftState.draft_round_limit * draftUser.draftRound;
    if (
      (isEven(totalRounds) &&
        totalRounds == draftOrder.draft_order * draftUser.draftRound + 2) ||
      (!isEven(totalRounds) &&
        totalRounds == draftOrder.draft_order * draftUser.draftRound)
    ) {
      userOnTurn = true;
    }
  } else {
    secondsOnRound =
      (draftUser.draftRound + 1) *
      (draftState.draft_round_limit * draftOrder.draft_order);
    const userRound =
      draftOrder.draft_order * draftUser.draftRound +
        (draftUser.draftRound + 1) !=
      0
        ? draftOrder.draft_order * draftUser.draftRound +
          (draftUser.draftRound + 1)
        : 1;
    if (
      (isEven(totalRounds) &&
        totalRounds ==
          draftOrder.draft_order * draftUser.draftRound +
            (draftUser.draftRound + 1)) ||
      (!isEven(totalRounds) && totalRounds == userRound)
    ) {
      userOnTurn = true;
    }
  }
  const timeofNextRound = new Date(
    draftState.draft_start_at.getTime() + 1000 * draftState.draft_time_offset + 1000 * secondsOnRound,
  );

  const timeLeft =
    userOnTurn === true
      ? (timeofNextRound - Date.now()) / 1000
      : (timeofNextRound - Date.now()) / 1000 - draftState.draft_round_limit;

  // All already drafted players (picked by all users in lobby)
  const dbResponseDraft = await dbConnection.query(
    'SELECT player_id FROM draft WHERE lobby_id = ?',
    [lobbyId],
  );
  const pickedPlayerList = dbResponseDraft.map(player => player.player_id);

  // All already drafted players (picked by all users in lobby)
  const dbResponseMyDraft = await dbConnection.query(
    'SELECT player_id FROM draft WHERE lobby_id = ? AND user_id = ?',
    [lobbyId, userId],
  );
  const myDraftPlayerList = dbResponseMyDraft.map(player => player.player_id);

  if (userOnTurn && timeLeft < 0) {
    const dbRandomPlayer = await dbConnection.query(
      'SELECT player_id FROM player_game WHERE game_id = ? AND player_id NOT IN ? ORDER BY RAND() LIMIT 1',
      [draftState.game_id, pickedPlayerList],
    );

    dbConnection.query('INSERT INTO draft (user_id, lobby_id, player_id) VALUES (?, ?, ?);',
    [userId, lobbyId, dbRandomPlayer[0].player_id]);

    const draftDelay = draftState.draft_time_offset + Math.abs(timeLeft);

    dbConnection.query('UPDATE lobby SET draft_time_offset = ? WHERE lobby_id = ?;',
    [draftDelay, lobbyId]);
  }

  res.json({
    dbPlayerOrder,
    dbResponseDraftState,
    dbPlayerRound,
    draftUser,
    timeofNextRound,
    totalRounds,
    userOnTurn,
    timeLeft,
    pickedPlayerList,
    myDraftPlayerList,
  });
});

function isEven(n) {
  return n % 2 == 0;
}

export default router;
