import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotion.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@ApiTags('promotions')
@Controller({ path: 'promotions', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a promotion (admin only)' })
  @ApiResponse({ status: 201, description: 'Promotion created' })
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }
}
