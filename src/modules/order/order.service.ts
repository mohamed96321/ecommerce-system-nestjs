import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { IOrder } from './interfaces/order.interface';
import { ProductsService } from '../product/product.service';
import { UsersService } from '../user/user.service';
import { PaymentsService } from '../payment/payment.service';
import { ShippingService } from '../shipping/shipping.service';
import { CartService } from '../cart/cart.service';
import { PromotionsService } from '../promotion/promotion.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private productsService: ProductsService,
    private usersService: UsersService,
    private paymentsService: PaymentsService,
    private shippingService: ShippingService,
    private cartService: CartService,
    private promotionsService: PromotionsService,
  ) {}

  async create(
    userId: string,
    shippingAddress: { address: string; city: string; country: string; postalCode: string },
    promotionCode?: string,
  ): Promise<IOrder> {
    const user = await this.usersService.findById(userId);
    const cart = await this.cartService.getCart(userId);
    if (!user || !cart || !cart.items.length) throw new NotFoundException('User or cart not found');

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await this.productsService.findOne(item.product.toString());
      if (product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for ${product.name}`);
      const price = await this.promotionsService.applyPromotion(product, promotionCode);
      orderItems.push({ product: product._id, quantity: item.quantity, price, variant: item.variant });
      totalAmount += price * item.quantity;
      await this.productsService.updateStock(item.product.toString(), item.quantity);
    }

    const shippingCost = await this.shippingService.calculateShipping(shippingAddress, orderItems);
    const paymentIntent = await this.paymentsService.createPaymentIntent(totalAmount + shippingCost, 'usd');
    const order = new this.orderModel({
      user: userId,
      items: orderItems,
      totalAmount: totalAmount + shippingCost,
      shippingAddress,
      shippingCost,
      paymentIntentId: paymentIntent.id,
      status: 'pending',
      promotionCode,
    });

    const savedOrder = await order.save();
    await this.cartService.getCart(userId).then((c) => c.remove());
    return savedOrder.toObject();
  }

  async findByUser(userId: string): Promise<IOrder[]> {
    const orders = await this.orderModel.find({ user: userId }).populate('items.product').exec();
    return orders.map((o) => o.toObject());
  }

  async updateStatus(orderId: string, status: string): Promise<IOrder> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    if (status === 'shipped') {
      order.trackingNumber = await this.shippingService.generateTrackingNumber(order);
    }
    return (await order.save()).toObject();
  }
}
