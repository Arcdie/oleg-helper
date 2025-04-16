import { Router } from 'express';

import { webController } from './web.controller';

const router = Router();

router.get('/', webController.getMainPage);
router.get('/shops', webController.getShopsPage);
router.get('/shops/goods', webController.getShopGoodsPage);

export default router;
