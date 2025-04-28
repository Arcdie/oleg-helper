import { Router } from 'express';

import { shopGoodsController } from './shop-goods.controller';

const router = Router();

router.put('/', shopGoodsController.changeShopGood);
router.delete('/', shopGoodsController.deleteShopGood);

export default router;
