import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PlaceOrderUseCase } from './use-cases/place-order.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private placeOrderUseCase: PlaceOrderUseCase) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.placeOrderUseCase.execute(dto);
  }
}
