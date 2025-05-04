import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { Product } from './schemas/product.schema';
import { IProduct } from './interfaces/product.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CategoriesService } from '../category/category.service';
import { BrandsService } from '../brand/brand.service';
import { UsersService } from '../user/user.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProductDto: any): Promise<IProduct> {
    const { images, ...data } = createProductDto;
    const category = await this.categoriesService.findById(data.categoryId);
    const brand = await this.brandsService.findById(data.brandId);
    const seller = await this.usersService.findById(data.sellerId);
    if (!category || !brand || !seller) throw new NotFoundException('Invalid category, brand, or seller');

    const imageUrls = await Promise.all(images.map((file: Express.Multer.File) => this.cloudinaryService.uploadImage(file)));
    const product = new this.productModel({
      ...data,
      category: data.categoryId,
      brand: data.brandId,
      images: imageUrls.map((url) => url.secure_url),
      seller: data.sellerId,
      sku: data.variants?.[0]?.sku || `${data.name}-${Date.now()}`,
    });

    const savedProduct = await product.save();
    await this.cacheManager.del('products_*');
    return savedProduct.toObject();
  }

  async findAll(query: { page?: number; limit?: number; search?: string; category?: string; brand?: string }): Promise<{ data: IProduct[]; pagination: any }> {
    const cacheKey = `products_${JSON.stringify(query)}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData as { data: IProduct[]; pagination: any };

    const { page = 1, limit = 10, search, category, brand } = query;
    const filter: any = {};
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('category')
        .populate('brand')
        .populate('seller')
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    const response = {
      data: products.map((p) => p.toObject()),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.cacheManager.set(cacheKey, response, { ttl: 300 });
    return response;
  }

  async findOne(id: string, userId?: string): Promise<IProduct> {
    const cacheKey = `product_${id}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData as IProduct;

    const product = await this.productModel
      .findById(id)
      .populate('category')
      .populate('brand')
      .populate('seller')
      .exec();
    if (!product) throw new NotFoundException('Product not found');

    if (userId) await this.usersService.addViewedProduct(userId, id);

    const productObj = product.toObject();
    await this.cacheManager.set(cacheKey, productObj, { ttl: 300 });
    return productObj;
  }

  async updateStock(id: string, quantity: number): Promise<IProduct> {
    const product = await this.findOne(id);
    product.stock -= quantity;
    if (product.stock < 0) throw new NotFoundException('Insufficient stock');
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, { stock: product.stock }, { new: true }).exec();
    return updatedProduct.toObject();
  }

  async updateRating(id: string): Promise<IProduct> {
    const product = await this.findOne(id);
    const reviews = await this.productModel.db.collection('reviews').find({ product: id }).toArray();
    const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, { rating, reviewCount: reviews.length }, { new: true }).exec();
    return updatedProduct.toObject();
  }
}
