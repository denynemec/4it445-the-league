import { Router } from 'express';
import { DB_CONNECTION_KEY } from '../../libs/connection';
const router = Router();

router.get('/uploadplayer', async (req, res, next) => {
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
});

export default router;
