import { Request, Response } from 'express';

import { appService } from '../app/app.service';
import { imageService } from '../images/image.service';
import { instagramService } from './instagram.service';
import { badRequestResponse, successResponse } from '../libs/expressResponses';

class InstagramController {
  async getGoods(req: Request, res: Response) {
    const { instagramLink }: { instagramLink: string } = req.body;

    if (!instagramLink) {
      return badRequestResponse(res, 'NO_INSTAGRAM_LINK');
    }

    if (!instagramLink.includes('instagram.com')) {
      return badRequestResponse(res, 'INVALID_INSTAGRAM_LINK');
    }

    const appSettings = appService.getAppSettings();

    const pageCode = instagramService.getPageCode(instagramLink);
    const result = await instagramService.getGoods(pageCode);

    if (result.goods.length) {
      for await (const good of result.goods) {
        let index = 0;

        for await (const imageLink of good.images) {
          await imageService.saveImage(imageLink, `${good.link}-${index}.jpg`);
          index += 1;
        }

        good.images = good.images.map(
          (e, i) => `${appSettings.url}/files/goods/${good.link}-${i}.jpg`,
        );
      }
    }

    return successResponse(res, {
      status: true,
      result,
    });
  }
}

export const instagramController = new InstagramController();
