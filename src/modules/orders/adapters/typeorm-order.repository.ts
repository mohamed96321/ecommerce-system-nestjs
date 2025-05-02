import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository, Order } from '../ports/order-repository.port';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private repo: Repository<OrderEntity>,
  ) {}

  async create(order: Order): Promise<Order> {
    return this.repo.create(order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  async findAll(): Promise<Order[]> {
    return this.repo.find({ relations: ['user'] });
  }

  async update(id: string, order: Partial<Order>): Promise<Order> {
    await this.repo.update(id, order);
    return this.findById(id) as Promise<Order>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
