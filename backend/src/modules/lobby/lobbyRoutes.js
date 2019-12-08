import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors, Hashids, sendEmail } from '../../utils';
import draftRoutes from './draft/draftRoutes';
import nominationRoutes from './nomination/nominationRoutes';

const router = Router();

// Link all submodules here
router.use('/:lobbyId/draft', draftRoutes);
router.use('/:lobbyId/nomination', nominationRoutes);

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

  // const allAvailableRoles = await dbConnection.query(
  //   `SELECT name FROM player_role WHERE sport_id = 1;`
  // );

  // selects all players roles based on a game in the lobby

  // const allAvailableRoles = await dbConnection.query(
  //   `SELECT player_role.name,player_role.post_abbr FROM lobby INNER JOIN game USING(game_id)
  //   INNER JOIN sport USING(sport_id)
  //   INNER JOIN player_role USING(sport_id) WHERE lobby_id = ?;`,
  //   [lobbyId],
  // );

  // const playersInLobby = await dbConnection.query(`SELECT firstname,lastname,team.name,post_abbr FROM game INNER JOIN player_game USING(game_id)
  // INNER JOIN player USING(player_id) INNER JOIN team USING(team_id);`);

  // const playersInLobby = await dbConnection.query(`SELECT firstname, lastname,team.name AS team ,post_abbr,player_role.name as post FROM game
  //   // INNER JOIN player_game USING(game_id) INNER JOIN player USING(player_id) INNER JOIN
  //   // team USING(team_id) INNER JOIN player_role USING(post_abbr);`);

  const playersInLobby = await dbConnection.query(
    `SELECT player_id,firstname, lastname,team.name AS team ,post_abbr,player_role.name as post,goal,assist,win,clean_sheet,note FROM
  game INNER JOIN player_game USING(game_id) INNER JOIN player USING(player_id) INNER JOIN team USING(team_id)
  INNER JOIN player_role USING(post_abbr) INNER JOIN result USING(player_id) INNER JOIN matches USING(match_id);`,
  );

  // SELECT firstname, lastname,team.name AS team ,post_abbr,player_role.name as post,goal,assist,win,clean_sheet,note FROM
  // game INNER JOIN player_game USING(game_id) INNER JOIN player USING(player_id) INNER JOIN team USING(team_id)
  // INNER JOIN player_role USING(post_abbr) INNER JOIN result USING(player_id) INNER JOIN matches USING(match_id)

  // SELECT player_id,firstname,lastname,note,goal,assist
  //   ,win,clean_sheet FROM matches INNER JOIN result USING(match_id) INNER JOIN player USING(player_id)

  const bonificationForGame = await dbConnection.query(
    `SELECT goal,assist,clean_sheet_goalkeeper,clean_sheet_defender,win_mid_fielders,win_defender,
  minimal_time FROM lobby INNER JOIN game USING(game_id) INNER JOIN bonification ON game.bonification_id = bonification.config_id 
  WHERE lobby_id = ?;`,
    [lobbyId],
  );

  const usersInLobby = await dbConnection.query(
    `SELECT nickname FROM lobby INNER JOIN lobby_user USING(lobby_id) INNER JOIN users USING(user_id) WHERE lobby_id = ?;`,
    [lobbyId],
  );

  const dbLobby = await dbConnection.query(
    'SELECT lobby.game_id, sport_id FROM lobby INNER JOIN game ON game.game_id = lobby.game_id WHERE lobby_id = ? AND lobby.active = true;',
    [lobbyId],
  );
  const { game_id: gameId } = dbLobby[0];

  const dbResponsePlayer = await dbConnection.query(
    'SELECT player_game.player_id, firstname, lastname, number, player_game.post_abbr, player_game.team_ID, team.name FROM player_game INNER JOIN player ON player_game.player_id = player.player_id LEFT JOIN team ON player_game.team_id = team.team_id LEFT JOIN player_role ON player_game.post_abbr = player_role.post_abbr WHERE game_id = ? AND active = true;',
    [gameId],
  );

  const lobbyPlayersList = dbResponsePlayer.map(
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

  const draftStarted = dbResponsePlayersWithoutDrafOrder.length === 0;

  // TODO map - currently mocked for demo
  const draftStatus = draftStarted ? 'FINISHED' : 'NOT_STARTED';

  // TODO
  const userIsGroupOwner = true;

  res.json({
    lobbyPlayersList,
    draftStatus,
    playersInLobby,
    bonificationForGame,
    usersInLobby,
    userIsGroupOwner,
  });
});

router.post(
  '/:lobbyId/startDraft',
  [check('draftRoundLimit').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

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
  },
);

export default router;
