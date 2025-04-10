import { Router } from 'express';

import { shopsController } from './shops.controller';

const router = Router();

router.get('/', shopsController.getShops);

export default router;
