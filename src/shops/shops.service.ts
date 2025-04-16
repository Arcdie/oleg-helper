import { IShop, ShopModel } from './shops.model';

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
}

export const shopsService = new ShopsService();
