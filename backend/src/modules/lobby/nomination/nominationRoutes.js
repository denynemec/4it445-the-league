import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { formatErrors } from '../../../utils';

import { DB_CONNECTION_KEY } from '../../../libs/connection';

const router = Router({ mergeParams: true });



export default router;
