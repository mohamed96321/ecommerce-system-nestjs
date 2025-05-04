import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        variant: { type: { size: String, color: String, language: String, sku: String }, required: false },
      },
    ],
    default: [],
  })
  items: {
    product: Types.ObjectId;
    quantity: number;
    variant?: { size: string; color: string; language: string; sku: string };
  }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
