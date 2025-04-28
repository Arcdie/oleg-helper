import { Router } from 'express';

import { shopsController } from './shops.controller';

const router = Router();

router.get('/', shopsController.getShops);
router.put('/', shopsController.updateShop);
router.delete('/', shopsController.deleteShop);

export default router;
