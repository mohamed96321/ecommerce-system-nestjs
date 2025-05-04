import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  question: string;

  @Prop({
    type: [{ user: { type: Types.ObjectId, ref: 'User' }, answer: String, createdAt: { type: Date, default: Date.now } }],
    default: [],
  })
  answers: { user: Types.ObjectId; answer: string; createdAt: Date }[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
