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

  getShopGoodsPage(req: Request, res: Response) {
    res.render('web/shop-goods');
  }
}

export const webController = new WebController();
