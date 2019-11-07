import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors, Hashids, sendEmail } from '../../utils';

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

router.get('/join-to-lobby-detail/:lobbyHash', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];
  const { lobbyHash } = req.params;

  // TODO select lobby detail by lobbyHash and return to FE

  res.json({
    name: 'Lobby name mocked',
    joinedUsers: 4,
    maxUsers: 8,
    eventName: 'Euro 2020',
    // false - user will be redirected to register form after click to "Join button"
    // true - user will be logged into app and redirected to home page
    // different response.body will be then in UPDATE joinToLobby endpoint - different route in this module..
    userIsRegistered: false,
  });
});

router.put(
  '/join-to-lobby',
  [
    check('lobbyHash')
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    const dbConnection = req[DB_CONNECTION_KEY];
    const { lobbyHash } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    // TODO check lobbyHash from DB and if user is already registered
    // when user is not registered - return only { userIsRegistered: false }
    // when user is registered - need to generate JWT token and SELECT user info and return:
    // { userIsRegistered: true,
    //   token: getJwtToken({ userId: 666 }),
    //   user: { nickname: "Mocked Nickname" }
    // }
    res.json({ userIsRegistered: false });
  },
);

router.post(
  '/newLobby',
  [
    check('lobbyName')
      .not()
      .isEmpty(),
    check('emails.*').isEmail(),
    check('eventId').isNumeric(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    const { eventId, lobbyName, emails } = req.body;

    const eventDetail = await dbConnection.query(
      'SELECT min_users, max_users FROM game WHERE active = true AND game_id = ?;',
      [eventId],
    )[0];

    if (eventDetail) {
      const { min_users: minUsers, max_users: maxUsers } = eventDetail;
      const minEmails = minUsers - 1;
      const maxEmails = maxUsers - 1;

      if ((emails.length < minEmails, emails.length > maxEmails)) {
        return res.status(422).json({
          error: '422: Emails are not in interval <minEmails, maxEmails>',
        });
      }
    }

    // add lobby to DB

    // send emails and add them into waitingForInvitationtoLoobyConfirm

    // for now return only { lobbyId: responseDb.insertId } to FE

    res.json({ lobbyId: 1 });
  },
);

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
