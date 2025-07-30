import { Request, Response } from 'express';

import { successResponse, badRequestResponse } from '../libs/express-responses';

import { IShopGoodEntity } from './shop-goods.model';

import { shopGoodsService } from './shop-goods.service';

class ShopGoodsController {
  async getShopGoods(req: Request, res: Response) {
    const shopId = req.query.shop_id;
    console.log(shopId);

    if (!shopId) {
      return badRequestResponse(res);
    }

    const goods = await shopGoodsService.getMany(shopId);
    return successResponse(res, { status: true, result: goods });
  }

  async updateShopGoods(req: Request, res: Response) {
    const { changes }: { changes: IShopGoodEntity[] } = req.body;

    await Promise.all(
      changes.map(async (c) => {
        await shopGoodsService.update(c._id, c);
      }),
    );

    return successResponse(res, { status: true, result: changes });
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
