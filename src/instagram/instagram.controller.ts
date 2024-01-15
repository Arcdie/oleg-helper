import { Request, Response } from 'express';

import { instagramService } from './instagram.service';
import { badRequestResponse, successResponse } from '../libs/expressResponses';

class InstagramController {
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
    instagramService.initGettingsGods(pageCode, clientId);

    return successResponse(res, { status: true });
  }
}

export const instagramController = new InstagramController();
