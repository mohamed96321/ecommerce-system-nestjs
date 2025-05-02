import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { TypeOrmUserRepository } from './adapters/typeorm-user.repository';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    { provide: 'UserRepository', useClass: TypeOrmUserRepository },
  ],
  exports: ['UserRepository'],
})
export class UsersModule {}
