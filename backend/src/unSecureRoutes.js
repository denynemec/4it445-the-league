import { Router } from 'express';

import authRoutes from './modules/auth/authRoutes';
import joinToLobbyRoutes from './modules/joinToLobby/joinToLobbyRoutes';

const router = Router();

// Link all modules here
router.use('/api/auth', authRoutes);
router.use('/api/joinToLobby', joinToLobbyRoutes);

export default router;
