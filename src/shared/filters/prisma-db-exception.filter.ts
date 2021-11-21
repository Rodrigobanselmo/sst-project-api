import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaDbExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const { code, meta } = exception;

    let error = new HttpException('Database Prisma error', 500);

    const { cause, target, field_name } = meta;

    switch (code) {
      case 'P2002':
        if (target)
          error = new BadRequestException(
            `Data you trying to create already exists: property ${target.join(
              ', ',
            )} is conflicting`,
          );
        break;

      case 'P2003':
        if (field_name)
          error = new BadRequestException(
            `Data you trying to create requires an FK: ${field_name}`,
          );
        break;

      case 'P2025':
        if (cause) error = new BadRequestException(cause);
        break;

      default:
        break;
    }
    const status = error.getStatus();

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log(`error`, exception);
      console.log('Do something to warn me');
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: error.message,
      error: error.name,
      path: request.url,
    });
  }
}
