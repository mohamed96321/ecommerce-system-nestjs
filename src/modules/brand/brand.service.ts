import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from './schemas/brand.schema';
import { IBrand } from './interfaces/brand.interface';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async create(name: string): Promise<IBrand> {
    const brand = new this.brandModel({ name });
    return (await brand.save()).toObject();
  }

  async findById(id: string): Promise<IBrand> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) throw new NotFoundException('Brand not found');
    return brand.toObject();
  }

  async findAll(): Promise<IBrand[]> {
    const brands = await this.brandModel.find().exec();
    return brands.map((b) => b.toObject());
  }
}
