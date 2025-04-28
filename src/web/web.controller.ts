import { Request, Response } from 'express';

import { shopsService } from '../shops/shops.service';
import { shopGoodsService } from '../shop-goods/shop-goods.service';

class WebController {
  getMainPage(req: Request, res: Response) {
    res.render('web/main');
  }

  async getShopsPage(req: Request, res: Response) {
    const shops = await shopsService.getShops();
    res.render('web/shops', { shops });
  }

  async getShopGoodsPage(req: Request, res: Response) {
    const { shop_id } = req.query;

    if (!shop_id) {
      return res.sendStatus(404);
    }

    const goods = await shopGoodsService.getMany(shop_id);
    res.render('web/shop-goods', { goods });
  }
}

export const webController = new WebController();
