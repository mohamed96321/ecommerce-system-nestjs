import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './order.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller({ path: 'orders', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order from cart' })
  @ApiResponse({ status: 201, description: 'Order created' })
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.sub, createOrderDto.shippingAddress, createOrderDto.promotionCode);
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved' })
  async findByUser(@Request() req) {
    return this.ordersService.findByUser(req.user.sub);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  @ApiOperation({ summary: 'Update order status (admin/seller only)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
