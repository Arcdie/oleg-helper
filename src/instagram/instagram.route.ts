import { Router } from 'express';

import { instagramController } from './instagram.controller';

const router = Router();

router.post('/goods', instagramController.getGoods);

export default router;
