import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        variant: { type: { size: String, color: String, language: String, sku: String }, required: false },
      },
    ],
    required: true,
  })
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    variant?: { size: string; color: string; language: string; sku: string };
  }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  shippingAddress: { address: string; city: string; country: string; postalCode: string };

  @Prop({ required: true })
  shippingCost: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  paymentIntentId: string;

  @Prop()
  trackingNumber?: string;

  @Prop()
  promotionCode?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
