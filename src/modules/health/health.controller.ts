import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator, HttpHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check system health' })
  @ApiResponse({ status: 200, description: 'System health status' })
  check() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongodb'),
      () => this.http.pingCheck('redis', 'http://localhost:6379'),
      () => this.http.pingCheck('elasticsearch', 'http://localhost:9200'),
    ]);
  }
}
