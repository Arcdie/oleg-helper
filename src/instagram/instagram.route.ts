import { Router } from 'express';

import { instagramController } from './instagram.controller';

const router = Router();

router.post('/chatgpt', instagramController.getChatGPTAnswer);

router.post('/upload', instagramController.uploadImage);
router.post('/goods', instagramController.initGettingsGods);

export default router;
