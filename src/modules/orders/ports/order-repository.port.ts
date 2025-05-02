import { Repository } from '../../../shared/interfaces/repository.interface';

export interface Order {
  id?: string;
  userId: string;
  items: { productId: string; qty: number }[];
  total: number;
  status: string;
}

export interface OrderRepository extends Repository<Order> {}
