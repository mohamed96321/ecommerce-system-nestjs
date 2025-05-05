import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(email: string, password: string, roles: string[] = ['customer']): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword, roles });
    return (await user.save()).toObject();
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).select('-password').lean().exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.toObject();
  }

  async update(userId: string, data: Partial<IUser>): Promise<IUser> {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser.toObject();
  }

  async addViewedProduct(userId: string, productId: string): Promise<IUser> {
    const user = await this.findById(userId);
    if (!user.viewedProducts.some((id) => id.toString() === productId)) {
      user.viewedProducts.push(productId as any);
    }
    return (await this.userModel.findByIdAndUpdate(userId, { viewedProducts: user.viewedProducts }, { new: true }).exec()).toObject();
  }
}
