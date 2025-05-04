import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './review.controller';
import { ReviewsService } from './review.service';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ProductsModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ProductsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
