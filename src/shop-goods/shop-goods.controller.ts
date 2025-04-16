import { Request, Response } from 'express';

import { notFoundResponse, successResponse } from '../libs/express-responses';

import { shopsService } from '../shops/shops.service';
import { shopGoodsService } from './shop-goods.service';

class ShopGoodsController {
  async getShops(req: Request, res: Response) {
    // const { shop_id }: { shop_id: string } = req.query;

    // if (!shop_id) {
    //   return notFoundResponse(res);
    // }

    const shops = await shopsService.getShops();
    return successResponse(res, { shops });
  }
}

export const shopGoodsController = new ShopGoodsController();
