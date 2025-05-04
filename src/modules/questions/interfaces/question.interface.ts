import { Types } from 'mongoose';

export interface IQuestion {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  question: string;
  answers: { user: Types.ObjectId; answer: string; createdAt: Date }[];
}
