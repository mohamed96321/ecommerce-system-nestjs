import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// import * from "mongoose";
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { User } from './user.interface';

// @Schema({ timestamps: true })
// export class UserSchema extends Document implements User {

//   @Prop({ required: true })
//   username: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ required: true })
//   email: string;

//   @Prop({ default: Date.now })
//   createdAt: Date;

//   @Prop({ default: Date.now })
//   updatedAt: Date;
// }
// export const UserModel = SchemaFactory.createForClass(UserSchema);
