import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { OrdersController } from './orders.controller';
import { PlaceOrderUseCase } from './use-cases/place-order.use-case';
import { OrderProcessor } from './order.processor';
import { TypeOrmOrderRepository } from './adapters/typeorm-order.repository';
import { OrderEntity } from './entities/order.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, ProductEntity]),
    BullModule.registerQueue({ name: 'orders' }),
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [
    PlaceOrderUseCase,
    OrderProcessor,
    { provide: 'OrderRepository', useClass: TypeOrmOrderRepository },
  ],
})
export class OrdersModule {}
