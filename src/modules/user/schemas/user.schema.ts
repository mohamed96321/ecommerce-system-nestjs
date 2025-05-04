import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ['customer'] })
  roles: string[];

  @Prop()
  name?: string;

  @Prop({ type: [{ address: String, city: String, country: String, postalCode: String }], default: [] })
  addresses?: { address: string; city: string; country: string; postalCode: string }[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  viewedProducts?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
