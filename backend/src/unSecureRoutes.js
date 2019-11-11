import { Router } from 'express';

import authRoutes from './modules/auth/authRoutes';
import joinToLobbyRoutes from './modules/joinToLobby/joinToLobbyRoutes';
import administrationRoutes from './modules/administration/administrationRoutes';

const router = Router();

// Link all modules here
router.use('/api/auth', authRoutes);
router.use('/api/joinToLobby', joinToLobbyRoutes);
router.use('/api/administration', administrationRoutes);

export default router;
