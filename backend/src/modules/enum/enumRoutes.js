import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';

const router = Router();

router.get('/events', async (req, res, next) => {
  const dbConnection = req[DB_CONNECTION_KEY];

  const events = await dbConnection.query(
    'SELECT game_id, name FROM game WHERE active = true;',
  );

  const mappedEvents = events.map(({ game_id: value, name: label }) => ({
    value,
    label,
  }));

  res.json(mappedEvents);
});
export default router;
