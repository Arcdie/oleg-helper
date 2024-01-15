import { Router } from 'express';

import { instagramController } from './instagram.controller';

const router = Router();

router.post('/goods', instagramController.initGettingsGods);

export default router;
