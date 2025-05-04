import { Types } from 'mongoose';

export interface IPromotion {
  _id: Types.ObjectId;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  productIds: Types.ObjectId[];
  active: boolean;
}
