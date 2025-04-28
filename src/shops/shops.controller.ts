import { Request, Response } from 'express';

import { badRequestResponse, successResponse } from '../libs/express-responses';

import { shopsService } from './shops.service';
import { IShopEntity } from './shops.model';

class ShopsController {
  async getShops(req: Request, res: Response) {
    const shops = await shopsService.getShops();
    return successResponse(res, { shops });
  }

  async updateShop(req: Request, res: Response) {
    const {
      shop_id,
      changes,
    }: { shop_id: string; changes: Partial<IShopEntity> } = req.body;

    if (!shop_id) {
      return badRequestResponse(res);
    }

    const updatedShop = await shopsService.update(shop_id, changes);
    return successResponse(res, { status: true, result: updatedShop });
  }

  async deleteShop(req: Request, res: Response) {
    const { shop_id }: { shop_id: string } = req.body;

    if (!shop_id) {
      return badRequestResponse(res);
    }

    const result = await shopsService.delete(shop_id);
    return successResponse(res, { status: true, result: result !== null });
  }
}

export const shopsController = new ShopsController();
