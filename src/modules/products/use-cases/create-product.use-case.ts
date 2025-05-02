import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../ports/product-repository.port';

@Injectable()
export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: { name: string; price: number; stock: number }) {
    const product = { ...input, version: 0 };
    return this.productRepository.create(product);
  }
}
