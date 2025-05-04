import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.use(helmet());
  app.use(cookieParser());
  app.use(csurf({ cookie: true }));
  app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  app.enableCors({ origin: config.get('cors.origin'), credentials: true });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('E-commerce platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const port = config.get('port');
  await app.listen(port);
  logger.log(`Application running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application', error);
  process.exit(1);
});
