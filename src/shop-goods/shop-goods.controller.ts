import { Request, Response } from 'express';

import { successResponse, badRequestResponse } from '../libs/express-responses';

import { IShopGoodEntity } from './shop-goods.model';

import { shopsService } from '../shops/shops.service';
import { shopGoodsService } from './shop-goods.service';

class ShopGoodsController {
  async getShops(req: Request, res: Response) {
    const shops = await shopsService.getShops();
    return successResponse(res, { shops });
  }

  async changeShopGood(req: Request, res: Response) {
    const {
      shop_good_id,
      changes,
    }: { shop_good_id: string; changes: Partial<IShopGoodEntity> } = req.body;

    if (!shop_good_id) {
      return badRequestResponse(res);
    }

    const updatedGood = await shopGoodsService.update(shop_good_id, changes);
    return successResponse(res, { status: true, result: updatedGood });
  }

  async deleteShopGood(req: Request, res: Response) {
    const { shop_good_id }: { shop_good_id: string } = req.body;

    if (!shop_good_id) {
      return badRequestResponse(res);
    }

    const result = await shopGoodsService.delete(shop_good_id);
    return successResponse(res, { status: true, result: result !== null });
  }
}

export const shopGoodsController = new ShopGoodsController();
