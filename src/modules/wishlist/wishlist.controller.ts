import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@ApiTags('wishlist')
@Controller({ path: 'wishlist', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved' })
  async getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({ status: 201, description: 'Product added to wishlist' })
  async addToWishlist(@Request() req, @Body() addToWishlistDto: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(req.user.sub, addToWishlistDto.productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist' })
  async removeFromWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user.sub, productId);
  }
}
