import { Router } from 'express';

import { DB_CONNECTION_KEY } from '../../libs/connection';
import { mocks } from '../../mocks';
const router = Router();

router.get('/list', (req, res, next) => {
  res.json(mocks.eventList);
});

router.get('/:eventId', (req, res, next) => {
  const { eventId } = req.params;

  res.json({
    id: eventId,
    name: 'Euro 2020',
    startDate: new Date('2020-06-12'),
    endDate: new Date('2020-07-12'),
    description:
      'Et harum quidem rerum facilis est et expedita distinctio. Aenean placerat. Aenean fermentum risus id tortor. Donec quis nibh at felis congue commodo. Nullam dapibus fermentum ipsum. Morbi leo m.',
    lobbyList: [
      {
        id: 1,
        name: 'Grupa 1',
        joinedUsers: 3,
        minimumUsers: 4,
        maxUsers: 7,
        eventName: 'Euro 2020',
      },
      {
        id: 2,
        name: 'Grupa 2',
        joinedUsers: 1,
        maxUsers: 9,
        minimumUsers: 4,
        eventName: 'Euro 2020',
      },
      {
        id: 3,
        name: 'Grupa 3',
        minimumUsers: 4,
        joinedUsers: 7,
        maxUsers: 8,
        eventName: 'Euro 2020',
      },

      {
        id: 4,
        name: 'Full mocked group',
        minimumUsers: 4,
        joinedUsers: 7,
        maxUsers: 7,
        eventName: 'Euro 2020',
      },
    ],
  });
});

export default router;
