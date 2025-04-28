import { IShopEntity } from '../shops/shops.model';
import { ShopGoodModel, IShopGood, IShopGoodEntity } from './shop-goods.model';

class ShopsGoodsService {
  async create(data: IShopGood) {
    const newGood = new ShopGoodModel(data);
    await newGood.save();
    return newGood;
  }

  async update(
    shopGoodId: IShopGoodEntity['id'],
    changes: Partial<IShopGoodEntity>,
  ) {
    return ShopGoodModel.findByIdAndUpdate(
      shopGoodId,
      { $set: changes },
      { new: true },
    ).exec();
  }

  async delete(shopGoodId: IShopGoodEntity['id']) {
    return ShopGoodModel.findByIdAndDelete(shopGoodId);
  }

  async getMany(shopId: IShopEntity['id']) {
    const goods = await ShopGoodModel.find({ shop_id: shopId });
    return goods;
  }
}

export const shopGoodsService = new ShopsGoodsService();
