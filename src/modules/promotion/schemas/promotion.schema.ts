import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Promotion extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, min: 0, max: 100 })
  discount: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  productIds: Types.ObjectId[];

  @Prop({ default: true })
  active: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
