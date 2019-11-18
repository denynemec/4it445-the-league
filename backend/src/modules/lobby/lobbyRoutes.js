import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors, Hashids, sendEmail } from '../../utils';

const router = Router();

router.get('/list', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];
  const { userId } = req.jwtDecoded;
  const dbResponse = await dbConnection.query(
    'SELECT lobby.lobby_id, lobby.name, game.name as eventName, leader_id, private, max_players, min_users, max_users, (SELECT COUNT(lobby_user.user_id) FROM lobby_user WHERE lobby_user.lobby_id = lobby.lobby_id) as joinedUsers FROM lobby LEFT JOIN game ON game.game_id = lobby.game_id LEFT JOIN lobby_user ON lobby.lobby_id = lobby_user.lobby_id WHERE lobby_user.user_id = ? AND lobby.active = true GROUP BY lobby.lobby_id;',
    [userId],
  );
  const lobbyList = dbResponse.map(
    ({
      lobby_id: id,
      min_users: minUsers,
      max_players: maxUsers,
      ...rest
    }) => ({ id, minUsers, maxUsers, ...rest }),
  );
  res.json(lobbyList);
});

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

    const user = await dbConnection.query(
      'SELECT user_id, email, firstname, lastname FROM users WHERE user_id = ?;',
      [userId],
    );

    if (emails.find(email => email === user[0].email)) {
      return res.status(422).json({
        error: '422: You can not send the invitation to yourself.',
      });
    }

    // add lobby to DB
    const lobbyResponse = await dbConnection.query(
      'INSERT INTO lobby (game_id, leader_id, name, max_players, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW());',
      [eventId, userId, lobbyName, emails.length + 1],
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

    res.json({ lobbyId });
  },
);

router.get('/:lobbyId', async (req, res, next) => {
  const { lobbyId } = req.params;

  const dbConnection = req[DB_CONNECTION_KEY];

  const dbResponsePlayersWithoutDrafOrder = await dbConnection.query(
    `SELECT user_id FROM lobby_user WHERE draft_order IS NULL and lobby_id = ?;`,
    [lobbyId],
  );

  const draftStarted = dbResponsePlayersWithoutDrafOrder.length === 0;

  res.json({ draftStarted });
});

router.post('/:lobbyId/startDraft', async (req, res, next) => {
  const { lobbyId } = req.params;
  // todo add check to privilege, if draft starts group owner

  const dbConnection = req[DB_CONNECTION_KEY];

  await dbConnection.query('DELETE FROM invitation WHERE lobby_id = ?;', [
    lobbyId,
  ]);

  const dbResponsePlayers = await dbConnection.query(
    `SELECT user_id FROM lobby_user WHERE draft_order IS NULL and lobby_id = ? ORDER BY RAND();`,
    [lobbyId],
  );

  if (dbResponsePlayers.length === 0) {
    return res
      .status(409)
      .json({ error: '409: Draft order already generated' });
  }

  dbResponsePlayers.map(async ({ user_id: userId }, index) => {
    await dbConnection.query(
      `UPDATE lobby_user SET draft_order= ? WHERE draft_order IS NULL and lobby_id = ? AND user_id = ? LIMIT 1;`,
      [index + 1, lobbyId, userId],
    );
  });

  res.json({});
});

////////

router.get('/:lobbyId/fetchDraft', async (req, res, next) => {
  const { lobbyId } = req.params;

  const dbConnection = req[DB_CONNECTION_KEY];

  const dbResponse = await dbConnection.query(
    `SELECT users.nickname, lobby_user.user_id, lobby_user.draft, lobby_user.draft_order FROM lobby_user JOIN users ON lobby_user.user_id = users.user_id WHERE lobby_id = ? ORDER BY lobby_user.draft_order;`,
    [lobbyId],
  );

  const draftOrder = dbResponse.map(
    ({ user_id: userId, draft_order: draftOrder, ...rest }) => ({
      userId,
      draftOrder,
      ...rest,
    }),
  );

  res.json({ draftOrder, activeDraftOrder: 1 });
});

export default router;
