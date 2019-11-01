import { Router } from 'express';

import authRoutes from './modules/auth/authRoutes';

const router = Router();

// Link all modules here
router.use('/api/auth', authRoutes);

export default router;
