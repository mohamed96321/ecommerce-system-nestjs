import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ConflictException } from '../../shared/exceptions/conflict.exception';

@Processor('orders')
export class OrderProcessor extends WorkerHost {
  constructor(
    @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
    @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
    private dataSource: DataSource,
  ) {
    super();
  }

  async process(job: Job) {
    const { orderId } = job.data;
    await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(OrderEntity, { where: { id: orderId } });
      if (!order) throw new Error('Order not found');

      for (const item of order.items) {
        const product = await manager.findOne(ProductEntity, {
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.qty) throw new ConflictException(`Insufficient stock for product ${product.name}`);
        product.stock -= item.qty;
        await manager.save(product);
      }

      order.status = 'completed';
      await manager.save(order);
    });
    return { orderId, status: 'completed' };
  }
}
