import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { ICart } from './interfaces/cart.interface';
import { ProductsService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: string): Promise<ICart> {
    let cart = await this.cartModel.findOne({ user: userId }).populate('items.product').exec();
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
      await cart.save();
    }
    return cart.toObject();
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    variant?: { size: string; color: string; language: string; sku: string },
  ): Promise<ICart> {
    const product = await this.productsService.findOne(productId);
    let cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [{ product: productId, quantity, variant }] });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          (!variant ||
            (item.variant?.size === variant.size &&
              item.variant?.color === variant.color &&
              item.variant?.language === variant.language &&
              item.variant?.sku === variant.sku)),
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, variant });
      }
    }
    return (await cart.save()).toObject();
  }

  async removeFromCart(
    userId: string,
    productId: string,
    variant?: { size: string; color: string; language: string; sku: string },
  ): Promise<ICart> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) throw new NotFoundException('Cart not found');
    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId ||
        (variant &&
          (item.variant?.size !== variant.size ||
            item.variant?.color !== variant.color ||
            item.variant?.language !== variant.language ||
            item.variant?.sku !== variant.sku)),
    );
    return (await cart.save()).toObject();
  }
}
