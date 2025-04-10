import { Schema, model, Document, Types } from 'mongoose';

export interface IShop {
  name: string;
  link: string;
}

export interface IShopEntity extends Document, IShop {
  _id: Types.ObjectId;
}

const ShopSchema = new Schema<IShopEntity>({
  name: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
    unique: true,
  },
});

export const ShopModel = model<IShopEntity>('Shop', ShopSchema, 'shops');
