import { IShopEntity } from '../shops/shops.model';
import { ShopGoodModel, IShopGood } from './shop-goods.model';

class ShopsGoodsService {
  async create(data: IShopGood) {
    const newGood = new ShopGoodModel(data);
    await newGood.save();
    return newGood;
  }

  async getShopGoods(shopId: IShopEntity['id']) {
    const goods = await ShopGoodModel.find({ shop_id: shopId });
    return goods;
  }
}

export const shopGoodsService = new ShopsGoodsService();
