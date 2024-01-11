import { Router } from 'express';

import { excelController } from './excel.controller';

const router = Router();

router.post('/', excelController.createExcelFile);

export default router;
