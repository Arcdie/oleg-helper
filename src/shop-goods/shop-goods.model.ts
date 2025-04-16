import { Schema, model, Document, Types } from 'mongoose';

import { IShop } from '../shops/shops.model';

export interface IShopGood {
  shop_id: Types.ObjectId | IShop;
  link: string;
  images: string[];
  text: string;

  description?: string;
  title?: string;
  price?: string;
  attributes?: string;
}

export interface IShopGoodEntity extends Document, IShopGood {}

const ShopGoodSchema = new Schema<IShopGoodEntity>({
  shop_id: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  text: String,
  images: [{ type: String, required: true }],

  description: String,
  title: String,
  price: String,
  attributes: String,
});

export const ShopGoodModel = model<IShopGoodEntity>(
  'ShopGood',
  ShopGoodSchema,
  'shop-goods',
);
