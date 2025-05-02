import { Repository } from '../../../shared/interfaces/repository.interface';

export interface User {
  id?: string;
  email: string;
  password: string;
  roles: string[];
  isActive: boolean;
}

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
}
