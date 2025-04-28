import { IShop, IShopEntity, ShopModel } from './shops.model';

class ShopsService {
  async create(data: IShop) {
    const newShop = new ShopModel(data);
    await newShop.save();
    return newShop;
  }

  async getShops() {
    const shops = await ShopModel.find({});
    return shops;
  }

  async getShopByLink(link: string) {
    return ShopModel.findOne({ link });
  }

  async update(shopId: IShopEntity['id'], changes: Partial<IShopEntity>) {
    return ShopModel.findByIdAndUpdate(
      shopId,
      { $set: changes },
      { new: true },
    ).exec();
  }

  async delete(shopGoodId: IShopEntity['id']) {
    return ShopModel.findByIdAndDelete(shopGoodId);
  }
}

export const shopsService = new ShopsService();
