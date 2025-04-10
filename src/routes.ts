import { Router } from 'express';

import webRoute from './web/web.route';
import excelRoute from './excel/excel.route';
import shopsRoute from './shops/shops.route';
import instagramRoute from './instagram/instagram.route';

const router = Router();

router.use('/', webRoute);
router.use('/api/excel', excelRoute);
router.use('/api/shops', shopsRoute);
router.use('/api/instagram', instagramRoute);

export default router;
