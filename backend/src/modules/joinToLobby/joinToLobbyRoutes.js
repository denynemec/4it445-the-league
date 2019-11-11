import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors, Hashids, getLoginSuccessPayload } from '../../utils';

const router = Router();

router.get('/join-to-lobby-detail/:lobbyHash', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];
  const { lobbyHash } = req.params;
  const [lobbyId, invitationId] = Hashids.decode(lobbyHash);
  const lobbyDetail = await dbConnection.query(
    'SELECT lobby.lobby_id, lobby.name, game.name as eventName, (SELECT COUNT(lobby_user.user_id) FROM lobby_user WHERE lobby_user.lobby_id = lobby.lobby_id) as joinedUsers, max_users FROM lobby LEFT JOIN game ON game.game_id = lobby.game_id LEFT JOIN lobby_user ON lobby.lobby_id = lobby_user.lobby_id WHERE lobby.lobby_id = ? AND lobby.active = true;',
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
    userIsRegistered,
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
        error: '422: Invitation expired.',
      });
    }

    const userDetail = await dbConnection.query(
      'SELECT user_id, email, nickname FROM users WHERE email = ? AND active = true LIMIT 1;',
      [invitation[0].email],
    );

    const userIsRegistered = userDetail.length > 0 ? true : false;

    if (userIsRegistered === true) {
      const { user_id: userId, nickname } = userDetail[0];

      await dbConnection.query(
        'INSERT INTO lobby_user (user_id, lobby_id) VALUES (?, ?);',
        [userId, lobbyId],
      );

      await dbConnection.query(
        'DELETE FROM invitation WHERE invitation_id = ?;',
        [invitationId],
      );
      const loginSuccessPayload = await getLoginSuccessPayload({
        userId,
        dbConnection,
      });

      res.json({
        userIsRegistered: true,
        ...loginSuccessPayload,
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

export default router;
