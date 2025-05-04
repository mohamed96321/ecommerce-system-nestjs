import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationsController } from './recommendation.controller';
import { RecommendationsService } from './recommendation.service';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { ProductsModule } from '../product/product.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductsModule,
    UsersModule,
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
