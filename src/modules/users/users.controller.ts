import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { RegisterUserDto } from '../auth/dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }
}
