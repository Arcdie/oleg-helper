import { Router } from 'express';

import { webController } from './web.controller';

const router = Router();

router.get('/', webController.getMainPage);
router.get('/shops', webController.getShopsPage);

export default router;
