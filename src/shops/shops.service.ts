import { IShop, ShopModel } from './shops.model';

class ShopsService {
  async create(data: IShop) {
    const newGood = new ShopModel(data);
    return newGood;
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
