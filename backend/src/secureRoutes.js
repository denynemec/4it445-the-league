import { Router } from 'express';

import lobbyRoutes from './modules/lobby/lobbyRoutes';
import eventRoutes from './modules/event/eventRoutes';
import settingsRoutes from './modules/settings/settingsRoutes';
import administrationRoutes from './modules/administration/administrationRoutes';
import enumRoutes from './modules/enum/enumRoutes';

const router = Router();

// Link all modules here
router.use('/api/lobby', lobbyRoutes);
router.use('/api/event', eventRoutes);
router.use('/api/settings', settingsRoutes);
router.use('/api/administration', administrationRoutes);
router.use('/api/enum', enumRoutes);

export default router;
