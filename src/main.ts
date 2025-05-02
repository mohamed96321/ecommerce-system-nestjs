import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from './shared/pipes/validation.pipe';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const config = app.get(ConfigService);
  app.use(helmet());
  app.enableCors({ origin: config.get('cors.origin'), credentials: true });
  // app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  const swaggerOpts = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('Professional e-commerce API with Mongoose')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, swaggerOpts);
  SwaggerModule.setup('docs', app, doc);

  const port = config.get('port');
  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
