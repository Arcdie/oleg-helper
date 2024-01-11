import { Router } from 'express';

import { webController } from './web.controller';

const router = Router();

router.get('/', webController.getMainPage);

export default router;
