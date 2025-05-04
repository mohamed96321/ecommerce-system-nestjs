import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { ProductsService } from '../product/product.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private productsService: ProductsService,
  ) {}

  async getSalesAnalytics(sellerId: string): Promise<{ totalSales: number; totalOrders: number; topProducts: [string, number][] }> {
    const orders = await this.orderModel.find().populate('items.product').exec();
    const sellerOrders = orders.filter((order) =>
      order.items.some((item) => item.product.seller.toString() === sellerId),
    );

    const totalSales = sellerOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = sellerOrders.length;
    const topProducts = sellerOrders
      .flatMap((order) => order.items)
      .reduce((acc, item) => {
        acc[item.product._id] = (acc[item.product._id] || 0) + item.quantity;
        return acc;
      }, {});
    const sortedProducts = Object.entries(topProducts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) as [string, number][];

    return { totalSales, totalOrders, topProducts: sortedProducts };
  }
}
