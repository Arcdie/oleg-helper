import { Router } from 'express';

import { shopGoodsController } from './shop-goods.controller';

const router = Router();

router.get('/', shopGoodsController.getShopGoods);
router.put('/', shopGoodsController.updateShopGoods);
router.delete('/', shopGoodsController.deleteShopGood);

export default router;
