import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist } from './schemas/wishlist.schema';
import { IWishlist } from './interfaces/wishlist.interface';
import { ProductsService } from '../product/product.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>,
    private productsService: ProductsService,
  ) {}

  async getWishlist(userId: string): Promise<IWishlist> {
    let wishlist = await this.wishlistModel.findOne({ user: userId }).populate('products').exec();
    if (!wishlist) {
      wishlist = new this.wishlistModel({ user: userId, products: [] });
      await wishlist.save();
    }
    return wishlist.toObject();
  }

  async addToWishlist(userId: string, productId: string): Promise<IWishlist> {
    const product = await this.productsService.findOne(productId);
    let wishlist = await this.wishlistModel.findOne({ user: userId }).exec();
    if (!wishlist) {
      wishlist = new this.wishlistModel({ user: userId, products: [productId] });
    } else if (!wishlist.products.some((id) => id.toString() === productId)) {
      wishlist.products.push(productId as any);
    }
    return (await wishlist.save()).toObject();
  }

  async removeFromWishlist(userId: string, productId: string): Promise<IWishlist> {
    const wishlist = await this.wishlistModel.findOne({ user: userId }).exec();
    if (!wishlist) throw new NotFoundException('Wishlist not found');
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    return (await wishlist.save()).toObject();
  }
}
