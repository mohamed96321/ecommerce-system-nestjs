import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { Wishlist, WishlistSchema } from './schemas/wishlist.schema';
import { ProductsModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wishlist.name, schema: WishlistSchema }]),
    ProductsModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
