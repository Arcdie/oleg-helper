import { ShopGoodModel, IShopGood } from './shop-goods.model';

class ShopsGoodsService {
  async create(data: IShopGood) {
    const newGood = new ShopGoodModel(data);
    await newGood.save();
    return newGood;
  }
}

export const shopGoodsService = new ShopsGoodsService();
