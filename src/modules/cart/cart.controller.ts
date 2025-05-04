import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddToCartDto } from './dto/add-to-cart.dto';

@ApiTags('cart')
@Controller({ path: 'cart', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved' })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({ status: 201, description: 'Product added to cart' })
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.sub, addToCartDto.productId, addToCartDto.quantity, addToCartDto.variant);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiResponse({ status: 200, description: 'Product removed from cart' })
  async removeFromCart(@Request() req, @Param('productId') productId: string, @Body() body: { variant?: { size: string; color: string; language: string; sku: string } }) {
    return this.cartService.removeFromCart(req.user.sub, productId, body.variant);
  }
}
