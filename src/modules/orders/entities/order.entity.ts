import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column('json')
  items: { productId: string; qty: number }[];

  @Column('decimal')
  total: number;

  @Column({ default: 'pending' })
  status: string;
}
