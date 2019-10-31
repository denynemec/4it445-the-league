import { Router } from 'express';

import loginRoutes from './modules/auth/loginRoutes';

const router = Router();

// Link all modules here
router.use('/api/auth', loginRoutes);

export default router;
