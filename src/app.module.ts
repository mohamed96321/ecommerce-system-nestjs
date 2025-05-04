import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TerminusModule } from '@nestjs/terminus';
import configuration from './config/configuration';
import { validationSchema } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { ProductsModule } from './modules/product/product.module';
import { OrdersModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { PaymentsModule } from './modules/payment/payment.module';
import { ReviewsModule } from './modules/review/review.module';
import { SearchModule } from './modules/search/search.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CategoriesModule } from './modules/category/category.module';
import { BrandsModule } from './modules/brand/brand.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { RecommendationsModule } from './modules/recommendation/recommendation.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PromotionsModule } from './modules/promotion/promotion.module';
import { QuestionsModule } from './modules/questions/questions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validationSchema }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({ uri: config.get('database.uri') }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        ttl: 300,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 100 }),
    ElasticsearchModule.register({ node: 'http://localhost:9200' }),
    TerminusModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    PaymentsModule,
    ReviewsModule,
    SearchModule,
    CloudinaryModule,
    CategoriesModule,
    BrandsModule,
    WishlistModule,
    ShippingModule,
    RecommendationsModule,
    AnalyticsModule,
    PromotionsModule,
    QuestionsModule,
  ],
})
export class AppModule {}
