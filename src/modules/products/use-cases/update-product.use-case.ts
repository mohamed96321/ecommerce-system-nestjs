import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../ports/product-repository.port';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';

@Injectable()
export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, input: { name?: string; price?: number; stock?: number }) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    const updatedProduct = { ...product, ...input };
    return this.productRepository.update(id, updatedProduct);
  }
}
