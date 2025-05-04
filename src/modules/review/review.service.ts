import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { IReview } from './interfaces/review.interface';
import { ProductsService } from '../product/product.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, productId: string, rating: number, comment?: string): Promise<IReview> {
    const product = await this.productsService.findOne(productId);
    const review = new this.reviewModel({ user: userId, product: productId, rating, comment });
    const savedReview = await review.save();
    await this.productsService.updateRating(productId);
    return savedReview.toObject();
  }

  async findByProduct(productId: string): Promise<IReview[]> {
    const reviews = await this.reviewModel.find({ product: productId }).populate('user').exec();
    return reviews.map((r) => r.toObject());
  }
}
