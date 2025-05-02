import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository, Product } from '../ports/product-repository.port';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private repo: Repository<ProductEntity>,
  ) {}

  async create(product: Product): Promise<Product> {
    return this.repo.create(product);
  }

  async findById(id: string): Promise<Product | null> {
    return this.repo.findOneBy({ id });
  }

  async findAll(): Promise<Product[]> {
    return this.repo.find();
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return this.repo.findByIds(ids);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const result = await this.repo.update({ id, version: product.version }, product);
    if (result.affected === 0) throw new ConflictException('Product version conflict');
    return this.findById(id) as Promise<Product>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
