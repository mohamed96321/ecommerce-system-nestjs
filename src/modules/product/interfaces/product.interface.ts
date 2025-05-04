import { Types } from 'mongoose';

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  seller: Types.ObjectId;
  images: string[];
  variants: { size: string; color: string; stock: number; language: string; sku: string }[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  dimensions?: { length: number; width: number; height: number };
  weight?: number;
  specifications?: Record<string, string>;
  promotions?: Types.ObjectId[];
}
