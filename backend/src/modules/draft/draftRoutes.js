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
    'SELECT lobby.lobby_id, user_id, max_players, draft_start_at, draft_paused, draft_round_limit FROM lobby INNER JOIN lobby_user ON (lobby.lobby_id = lobby_user.lobby_id) WHERE lobby.lobby_id = ? AND user_id = ? AND draft_order IS NOT NULL LIMIT 1;',
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

  let secondsOnRound = 0;
  if (isEven(draftUser.draftRound+1) === true) {
    secondsOnRound = (draftUser.draftRound+1) * (draftState.draft_round_limit * (draftState.max_players - draftOrder.draft_order + 1)) + (draftState.draft_round_limit * draftUser.draftRound);   
  } else {
    secondsOnRound = (draftUser.draftRound+1) * (draftState.draft_round_limit * draftOrder.draft_order);
  }
console.log(secondsOnRound);
  const timeofNextRound = new Date(draftState.draft_start_at.getTime() + (1000 * secondsOnRound))
  console.log(timeofNextRound);
  
  console.log((timeofNextRound - Date.now()) / 1000); 

  res.json({
    dbPlayerOrder,
    dbResponseDraftState,
    dbPlayerRound,
    draftUser,
    timeofNextRound,
  });
});

function isEven(n) {
    return n % 2 == 0;
 }

export default router;
