import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.id;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message = response;
      code = exception.constructor.name;

      // Handle class-validator errors
      if (status === HttpStatus.BAD_REQUEST && Array.isArray(response)) {
        code = 'VALIDATION_ERROR';
        message = response.map((e) => ({ property: e.property, constraints: e.constraints }));
      }
    } else if (exception instanceof MongoServerError) {
      status = HttpStatus.CONFLICT;
      message = 'Database error';
      code = 'MONGO_ERROR';
      if (exception.code === 11000) {
        message = `Duplicate key: ${JSON.stringify(exception.keyValue)}`;
        code = 'DUPLICATE_KEY';
      }
    } else if (exception instanceof mongoose.Error.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ID: ${exception.value}`;
      code = 'INVALID_ID';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log with request ID (Winston would be configured to include this)
    console.error({
      requestId,
      status,
      code,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });

    response.status(status).json({
      statusCode: status,
      message,
      code,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
