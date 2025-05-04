import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CategoriesModule } from '../category/category.module';
import { BrandsModule } from '../brand/brand.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CloudinaryModule,
    CategoriesModule,
    BrandsModule,
    UsersModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
