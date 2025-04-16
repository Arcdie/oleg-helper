import { Request, Response } from 'express';

import { badRequestResponse, successResponse } from '../libs/express-responses';

import { instagramService } from './instagram.service';
import { chatGPTService } from '../chatgpt/chatgpt.service';

class InstagramController {
  async getChatGPTAnswer(req: Request, res: Response) {
    const { message }: { message: string } = req.body;

    const data = await chatGPTService.sendMessage(message);

    return successResponse(res, { data });
  }

  async uploadImage(req: Request, res: Response) {
    const { imageLink }: { imageLink: string } = req.body;
    const result = await instagramService.uploadImage(imageLink);

    return successResponse(res, { status: result });
  }

  async initGettingsGods(req: Request, res: Response) {
    const {
      clientId,
      instagramLink,
    }: { instagramLink: string; clientId: string } = req.body;

    if (!instagramLink) {
      return badRequestResponse(res, 'NO_INSTAGRAM_LINK');
    }

    if (!instagramLink.includes('instagram.com')) {
      return badRequestResponse(res, 'INVALID_INSTAGRAM_LINK');
    }

    if (!instagramLink) {
      return badRequestResponse(res, 'NO_CLIENT_ID');
    }

    const pageCode = instagramService.getPageCode(instagramLink);

    instagramService.initGettingsGods({
      clientId,
      pageCode,
    });

    return successResponse(res, { status: true });
  }
}

export const instagramController = new InstagramController();
