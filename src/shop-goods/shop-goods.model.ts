import { Schema, model, Document, Types } from 'mongoose';

import { IShop } from '../shops/shops.model';

export interface ILightShopGood {
  shop_id: Types.ObjectId | IShop;
  link: string;
  full_description: string;
  images: string[];
}

export interface IShopGood extends ILightShopGood {
  unique_id: string;
  title: string;
  short_description: string;
  price: string;
  colors: string[];
  sizes: string[];
  categories: string[];

  attributes: {
    custom_1?: [string, string];
    custom_2?: [string, string];
    custom_3?: [string, string];
    custom_4?: [string, string];
    custom_5?: [string, string];
  };
}

export interface IShopGoodEntity extends Document, IShopGood {}

const ShopGoodSchema = new Schema<IShopGoodEntity>({
  shop_id: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },

  unique_id: {
    type: String,
    required: true,
  },

  title: String,

  short_description: String,
  full_description: String,
  price: String,

  link: {
    type: String,
    required: true,
  },

  images: [{ type: String, required: true }],
  colors: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
  categories: [{ type: String, required: true }],

  attributes: {
    custom_1: [String, String],
    custom_2: [String, String],
    custom_3: [String, String],
    custom_4: [String, String],
    custom_5: [String, String],
  },
});

export const ShopGoodModel = model<IShopGoodEntity>(
  'ShopGood',
  ShopGoodSchema,
  'shop-goods',
);
