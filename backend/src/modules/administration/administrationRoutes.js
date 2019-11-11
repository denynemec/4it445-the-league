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
    
    const csv = require('csv-parser');
  const fs = require('fs');
  const dbConnection = req[DB_CONNECTION_KEY];

  fs.createReadStream('./src/modules/administration/player.csv')
    .pipe(
      csv({
        headers: false,
        separator: ';',
      }),
    )
    .on('data', async player => {
      console.log(player);
      const playerExist = await dbConnection.query(
        'SELECT firstname, lastname FROM player WHERE firstname = ? AND lastname = ? LIMIT 1',
        [player[0], player[1]],
      );
      if (playerExist.length < 1) {
        const dbPlayerResponse = await dbConnection.query(
          'INSERT INTO player (firstname, lastname, created_at, updated_at) VALUES (?, ?, NOW(), NOW());',
          [player[0], player[1]],
        );
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
    
    res.json({});
  },
);
export default router;
