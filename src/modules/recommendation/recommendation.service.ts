import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { ProductsService } from '../product/product.service';
import { UsersService } from '../user/user.service';
import { IProduct } from '../product/interfaces/product.interface';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async getRecommendations(userId: string): Promise<IProduct[]> {
    const user = await this.usersService.findById(userId);
    const orders = await this.orderModel.find({ user: userId }).exec();
    const viewedProducts = user.viewedProducts || [];
    const purchasedProductIds = orders.flatMap((order) => order.items.map((item) => item.product.toString()));

    const categories = new Set<string>();
    for (const productId of [...purchasedProductIds, ...viewedProducts]) {
      const product = await this.productsService.findOne(productId);
      categories.add(product.category.toString());
    }

    const recommendedProducts = await this.productsService.findAll({
      page: 1,
      limit: 10,
      category: Array.from(categories)[0],
    });

    return recommendedProducts.data.filter((p) => !purchasedProductIds.includes(p._id.toString()));
  }
}
