import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user-repository.port';
import { ConflictException } from '../../../shared/exceptions/conflict.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: { email: string; password: string }) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) throw new ConflictException('User already exists');
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = {
      email: input.email,
      password: hashedPassword,
      roles: ['customer'],
      isActive: true,
    };
    return this.userRepository.create(user);
  }
}
