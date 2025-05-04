import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion } from './schemas/promotion.schema';
import { IPromotion } from './interfaces/promotion.interface';
import { ProductsService } from '../product/product.service';
import { IProduct } from '../product/interfaces/product.interface';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>,
    private productsService: ProductsService,
  ) {}

  async create(createPromotionDto: { code: string; discount: number; startDate: Date; endDate: Date; productIds?: string[] }): Promise<IPromotion> {
    const promotion = new this.promotionModel(createPromotionDto);
    const savedPromotion = await promotion.save();
    if (createPromotionDto.productIds) {
      await Promise.all(
        createPromotionDto.productIds.map((id) =>
          this.productsService.findOne(id).then((p) => {
            p.promotions.push(savedPromotion._id as any);
            return this.productsService.updateStock(id, 0); // Assuming updateStock can be used to save
          }),
        ),
      );
    }
    return savedPromotion.toObject();
  }

  async applyPromotion(product: IProduct, code?: string): Promise<number> {
    if (!code) return product.price;
    const promotion = await this.promotionModel.findOne({ code, active: true }).exec();
    if (!promotion || new Date() < promotion.startDate || new Date() > promotion.endDate) return product.price;
    if (promotion.productIds.length && !promotion.productIds.some((id) => id.toString() === product._id.toString())) return product.price;
    return product.price * (1 - promotion.discount / 100);
  }
}
