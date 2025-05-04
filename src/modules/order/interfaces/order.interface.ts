import { Types } from 'mongoose';

export interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    variant?: { size: string; color: string; language: string; sku: string };
  }[];
  totalAmount: number;
  shippingAddress: { address: string; city: string; country: string; postalCode: string };
  shippingCost: number;
  status: string;
  paymentIntentId: string;
  trackingNumber?: string;
  promotionCode?: string;
}
