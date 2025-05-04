import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RecommendationsService } from './recommendation.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('recommendations')
@Controller({ path: 'recommendations', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get product recommendations for user' })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved' })
  async getRecommendations(@Request() req) {
    return this.recommendationsService.getRecommendations(req.user.sub);
  }
}
