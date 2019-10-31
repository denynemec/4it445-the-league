import { Router } from 'express';

import lobbyRoutes from './modules/lobby/lobbyRoutes';
import eventRoutes from './modules/event/eventRoutes';
import settingsRoutes from './modules/settings/settingsRoutes';

const router = Router();

// Link all modules here
router.use('/api/lobby', lobbyRoutes);
router.use('/api/event', eventRoutes);
router.use('/api/settings', settingsRoutes);

export default router;
