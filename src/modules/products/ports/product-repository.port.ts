import { Repository } from '../../../shared/interfaces/repository.interface';

export interface Product {
  id?: string;
  name: string;
  price: number;
  stock: number;
  version?: number;
}

export interface ProductRepository extends Repository<Product> {
  findByIds(ids: string[]): Promise<Product[]>;
}
