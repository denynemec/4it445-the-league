import { Router } from 'express';

import lobbyRoutes from './modules/lobby/lobbyRoutes';
import eventRoutes from './modules/event/eventRoutes';

const router = Router();

// Link all modules here
router.use('/api/lobby', lobbyRoutes);
router.use('/api/event', eventRoutes);

export default router;
