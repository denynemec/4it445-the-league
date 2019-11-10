import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors, Hashids, sendEmail, getJwtToken } from '../../utils';

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
  const [lobbyId, invitationId] = Hashids.decode(lobbyHash);
  const lobbyDetail = await dbConnection.query(
    'SELECT lobby.lobby_id, lobby.name, game.name as eventName, count(lobby_user.user_id) as joinedUsers, max_users FROM lobby LEFT JOIN game ON game.game_id = lobby.game_id LEFT JOIN lobby_user ON lobby.lobby_id = lobby_user.lobby_id WHERE lobby.lobby_id = ? AND lobby.active = true;',
    [lobbyId],
  );
  const invitation = await dbConnection.query(
    'SELECT invitation_id, email FROM invitation WHERE invitation_id = ? AND lobby_id = ?;',
    [invitationId, lobbyId],
  );
  if (!invitation || invitation.length < 1) {
    return res.status(422).json({
      error: '422: Invitation expired or token is not valid.',
    });
  }
  const userDetail = await dbConnection.query(
    'SELECT user_id, email FROM users WHERE email = ? AND active = true LIMIT 1;',
    [invitation[0].email],
  );
  const userIsRegistered = userDetail.length > 0 ? true : false;

  res.json({
    name: lobbyDetail[0].name,
    joinedUsers: lobbyDetail[0].joinedUsers,
    maxUsers: lobbyDetail[0].max_users,
    eventName: lobbyDetail[0].eventName,
    userIsRegistered: userIsRegistered,
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
    const [lobbyId, invitationId] = Hashids.decode(lobbyHash);
    const invitation = await dbConnection.query(
      'SELECT invitation_id, email FROM invitation WHERE invitation_id = ? AND lobby_id = ?;',
      [invitationId, lobbyId],
    );
    if (!invitation || invitation.length < 1) {
      return res.status(422).json({
        error: '422: Invitation expired or token is not valid.',
      });
    }
    const userDetail = await dbConnection.query(
      'SELECT user_id, email, nickname FROM users WHERE email = ? AND active = true LIMIT 1;',
      [invitation[0].email],
    );

    const userIsRegistered = userDetail.length > 0 ? true : false;

    if (userIsRegistered === true) {
      const { user_id: userId, nickname: nickName } = userDetail[0];
      await dbConnection.query(
        'INSERT INTO lobby_user (user_id, lobby_id) VALUES (?, ?);',
        [userId, lobbyId],
      );
      await dbConnection.query(
        'DELETE FROM invitation WHERE invitation_id = ?;',
        [invitationId],
      );
      const token = getJwtToken({ userId });
      res.json({
        userIsRegistered: true,
        token: token,
        nickname: nickName,
      });
    } else {
      await dbConnection.query(
        'UPDATE invitation SET approved = true WHERE invitation_id = ?;',
        [invitationId],
      );
      res.json({
        userIsRegistered: false,
        email: invitation[0].email,
      });
    }
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

    const dbConnection = req[DB_CONNECTION_KEY];
    const { eventId, lobbyName, emails } = req.body;
    const { userId } = req.jwtDecoded;

    const eventDetail = await dbConnection.query(
      'SELECT min_users, max_users FROM game WHERE game_id = ? AND active = true;',
      [eventId],
    );
    if (eventDetail) {
      const { min_users: minUsers, max_users: maxUsers } = eventDetail[0];
      const minEmails = minUsers - 1;
      const maxEmails = maxUsers - 1;

      if ((emails.length < minEmails, emails.length > maxEmails)) {
        return res.status(422).json({
          error: '422: Emails are not in interval <minEmails, maxEmails>',
        });
      }
    } else {
      return res.status(422).json({
        error: '422: The game was cancelled.',
      });
    }

    // add lobby to DB
    const lobbyResponse = await dbConnection.query(
      'INSERT INTO lobby (game_id, leader_id, name, max_players, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW());',
      [eventId, userId, lobbyName, eventDetail[0].max_users],
    );
    const lobbyId = lobbyResponse.insertId;
    await dbConnection.query(
      'INSERT INTO lobby_user (user_id, lobby_id) VALUES (?, ?);',
      [userId, lobbyId],
    );
    emails.map(async email => {
      const dbResponse = await dbConnection.query(
        'INSERT INTO invitation (lobby_id, email) VALUES (?, ?);',
        [lobbyId, email],
      );
      const newLobbyHashId = Hashids.encode(lobbyId, dbResponse.insertId);

      const joinLobbyAppLink = `${
        req.headers['x-the-league-app-join-to-the-lobby-url']
      }/${newLobbyHashId}`;

      sendEmail({
        emailTo: email,
        subject: 'The League / Someone invite you to join lobby',
        text: 'The League 4',
        html: `<strong>The League 4</strong> <br /> Někdo tě zve do hry. <a href='${joinLobbyAppLink}'>Pro přidání se do skupiny klikni na tento odkaz ... </a>`,
        onError: () => {
          console.error(error);

          return res.status(500).json({ error: '500: Internal Server Error' });
        },
      });
    });

    res.json({ lobbyId: lobbyResponse.insertId });
  },
);

router.get('/:lobbyId', (req, res, next) => {
  const { lobbyId } = req.params;
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
