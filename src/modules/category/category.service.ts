import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { ICategory } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(name: string, parentId?: string): Promise<ICategory> {
    const category = new this.categoryModel({ name, parent: parentId });
    return (await category.save()).toObject();
  }

  async findById(id: string): Promise<ICategory> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException('Category not found');
    return category.toObject();
  }

  async findAll(): Promise<ICategory[]> {
    const categories = await this.categoryModel.find().populate('parent').exec();
    return categories.map((c) => c.toObject());
  }
}
