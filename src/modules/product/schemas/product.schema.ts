import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  sku: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brand: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: [{ size: String, color: String, stock: Number, language: String, sku: String }],
    default: [],
  })
  variants: { size: string; color: string; stock: number; language: string; sku: string }[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: { length: Number, width: Number, height: Number } })
  dimensions?: { length: number; width: number; height: number };

  @Prop()
  weight?: number;

  @Prop({ type: Map, of: String })
  specifications?: Record<string, string>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Promotion' }], default: [] })
  promotions?: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', description: 'text' });
