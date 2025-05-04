import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionsController } from './promotion.controller';
import { PromotionsService } from './promotion.service';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';
import { ProductsModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Promotion.name, schema: PromotionSchema }]),
    ProductsModule,
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
