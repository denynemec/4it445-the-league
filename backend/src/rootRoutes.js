import { Router } from 'express';

import loginRoutes from './modules/login/loginRoutes';

const router = Router();

// Link all modules here
router.use('/api/auth/login', loginRoutes);

export default router;
