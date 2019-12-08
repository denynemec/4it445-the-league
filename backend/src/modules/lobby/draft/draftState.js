export const getDraftState = async ({
  lobbyId,
  userId,
  dbConnection,
  draftState,
}) => {
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

  let totalRounds = dbPlayerRound.reduce(function(prev, cur) {
    return prev + cur.draftRound;
  }, 0);

  let secondsToNextRound = 0;
  let userOnTurn = false;
  let activeDraftOrder;
  if (isEven(draftUser.draftRound + 1) === true) {
    activeDraftOrder =
      (totalRounds + 1) % draftState.max_players !== 0
        ? draftState.max_players +
          1 -
          ((totalRounds + 1) % draftState.max_players)
        : draftState.max_players;
        console.log("tady")
    if (totalRounds > draftUser.draftRound * draftState.max_players) {
      if (
        totalRounds % draftState.max_players ==
        draftState.max_players - draftOrder.draft_order
      ) {
        userOnTurn = true;
      }
    }
    if (userOnTurn) {
      secondsToNextRound = (totalRounds + 1) * draftState.draft_round_limit;
    } else {
      secondsToNextRound =
        (draftUser.draftRound * draftState.max_players +
          draftState.max_players -
          draftOrder.draft_order) *
        draftState.draft_round_limit;
    }
  } else {
    let roundsCount;
    if (totalRounds == 0) {
      roundsCount = 1;
    } else {
      roundsCount = totalRounds;
    }
    activeDraftOrder = (totalRounds + 1) % draftState.max_players;
    if (roundsCount > draftUser.draftRound * draftState.max_players) {
      if (roundsCount % draftState.max_players == draftOrder.draft_order) {
        userOnTurn = true;
      }
    }
    if (userOnTurn) {
      secondsToNextRound = (totalRounds + 1) * draftState.draft_round_limit;
    } else {
      secondsToNextRound =
        (draftUser.draftRound * draftState.max_players +
          draftOrder.draft_order) *
        draftState.draft_round_limit;
    }
  }
  const timeOfNextRound = new Date(
    draftState.draft_start_at.getTime() +
      1000 * draftState.draft_time_offset +
      1000 * secondsToNextRound,
  );
  const timeLeft = (timeOfNextRound - Date.now()) / 1000;

  return {
    timeLeft,
    userOnTurn,
    timeOfNextRound,
    totalRounds,
    activeDraftOrder,
  };
};

function isEven(n) {
  return n % 2 == 0;
}
