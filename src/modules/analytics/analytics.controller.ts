import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller({ path: 'analytics', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('sales')
  @Roles('seller', 'admin')
  @ApiOperation({ summary: 'Get sales analytics for seller' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved' })
  async getSalesAnalytics(@Request() req) {
    return this.analyticsService.getSalesAnalytics(req.user.sub);
  }
}
