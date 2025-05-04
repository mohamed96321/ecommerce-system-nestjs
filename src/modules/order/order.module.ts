import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { ProductsModule } from '../product/product.module';
import { UsersModule } from '../user/user.module';
import { PaymentsModule } from '../payment/payment.module';
import { ShippingModule } from '../shipping/shipping.module';
import { CartModule } from '../cart/cart.module';
import { PromotionsModule } from '../promotion/promotion.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductsModule,
    UsersModule,
    PaymentsModule,
    ShippingModule,
    CartModule,
    PromotionsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
