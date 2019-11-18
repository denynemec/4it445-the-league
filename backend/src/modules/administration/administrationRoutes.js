import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { formatErrors } from '../../utils/errors';

const router = Router();

router.post(
  '/upload-players-to-event',
  [
    check('eventId')
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: formatErrors(errors),
      });
    }

    //if (!req.files) {
    //  return res.send({ error: 'CSV file was not found' });
    //}

    //const file = req.files.eventPlayers;

    const csv = require('csv-parser');
    const fs = require('fs');
    const dbConnection = req[DB_CONNECTION_KEY];
    const { eventId } = req.body;

    const eventResponse = await dbConnection.query(
      'SELECT game_id, date_from FROM game WHERE game_id = ? AND active = true;',
      [eventId],
    );

    if (!eventResponse || eventResponse.length < 1) {
      return res.status(422).json({ error: 'No event for you' });
    }
    const today = new Date();
    const endUpload = eventResponse[0].date_from;
    endUpload.setDate(endUpload.getDate() - 14);
    if (today > endUpload) {
      return res.status(422).json({
        error: 'It is too late. You can not upload players to this event',
      });
    }
    await dbConnection.query('DELETE FROM player_game WHERE game_id = ?;', [
      eventId,
    ]);

    const dbPlayer = await dbConnection.query(
      'SELECT player_id, firstname, lastname FROM player;',
    );

    const dbTeam = await dbConnection.query('SELECT team_id, name FROM team;');

    fs.createReadStream('./src/modules/administration/player.csv')
      .pipe(
        csv({
          headers: false,
          separator: ';',
        }),
      )
      .on('data', async player => {
        let teamId;
        let playerId;
        const teamExist = dbTeam.find(t => t.name == player[4]);
        if (teamExist === 'undefined') {
          const dbTeamResponse = await dbConnection.query(
            'INSERT INTO team (name, created_at, updated_at) VALUES (?, NOW(), NOW());',
            [player[4]],
          );
          teamId = dbTeamResponse.insertId;
        } else {
          teamId = teamExist.team_id;
        }
        const playerExist = dbPlayer.find(
          pl => pl.firstname == player[0] && pl.lastname == player[1],
        );
        if (playerExist === 'undefined') {
          const dbPlayerResponse = await dbConnection.query(
            'INSERT INTO player (firstname, lastname, created_at, updated_at) VALUES (?, ?, NOW(), NOW());',
            [player[0], player[1]],
          );
          playerId = dbPlayerResponse.insertId;
        } else {
          playerId = playerExist.player_id;
        }
        await dbConnection.query(
          'INSERT INTO player_game (game_id, player_id, post_abbr, team_id, number) VALUES (?, ?, ?, ?, ?);',
          [eventId, playerId, player[3], teamId, player[2]],
        );
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });

    res.json({ message: 'CSV file successfully processed' });
  },
);
export default router;
