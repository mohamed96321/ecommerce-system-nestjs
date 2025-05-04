import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  roles: string[];
  name?: string;
  addresses?: { address: string; city: string; country: string; postalCode: string }[];
  viewedProducts?: Types.ObjectId[];
}
