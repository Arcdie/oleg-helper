import { Request, Response } from 'express';

import { successResponse } from '../libs/express-responses';

import { shopsService } from './shops.service';

class ShopsController {
  async getShops(req: Request, res: Response) {
    const shops = await shopsService.getShops();

    return successResponse(res, { shops });
  }
}

export const shopsController = new ShopsController();
