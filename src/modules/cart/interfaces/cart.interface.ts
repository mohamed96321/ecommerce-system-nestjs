import { Types } from 'mongoose';

export interface ICart {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    quantity: number;
    variant?: { size: string; color: string; language: string; sku: string };
  }[];
}
