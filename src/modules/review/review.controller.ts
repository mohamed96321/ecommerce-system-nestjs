import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './review.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({ status: 201, description: 'Review created' })
  async create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.sub, createReviewDto.productId, createReviewDto.rating, createReviewDto.comment);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved' })
  async findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }
}
