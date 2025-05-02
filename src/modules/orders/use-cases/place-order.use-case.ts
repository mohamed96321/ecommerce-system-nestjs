import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderRepository } from '../ports/order-repository.port';
import { ProductRepository } from '../../products/ports/product-repository.port';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    @InjectQueue('orders') private ordersQueue: Queue,
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(input: { userId: string; items: { productId: string; qty: number }[] }) {
    const productIds = input.items.map((item) => item.productId);
    const products = await this.productRepository.findByIds(productIds);
    if (products.length !== productIds.length) throw new NotFoundException('Some products not found');

    const priceMap = products.reduce((map, p) => map.set(p.id, p.price), new Map<string, number>());
    const total = input.items.reduce((sum, item) => sum + (priceMap.get(item.productId) || 0) * item.qty, 0);

    const order = { userId: input.userId, items: input.items, total, status: 'pending' };
    const savedOrder = await this.orderRepository.create(order);
    await this.ordersQueue.add('process-order', { orderId: savedOrder.id });
    return savedOrder;
  }
}
