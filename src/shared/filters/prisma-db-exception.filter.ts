import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaDbExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(`exception`, exception);

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const { code, meta } = exception;

    let error = new HttpException('Database Prisma error', 500);

    const { cause, target } = meta;

    switch (code) {
      case 'P2002':
        if (target)
          error = new BadRequestException(
            `Data you trying to create already exists: property ${target.join(
              ', ',
            )} is conflicting`,
          );
        break;

      case 'P2025':
        if (cause) error = new NotFoundException(cause);
        break;

      default:
        break;
    }
    const status = error.getStatus();

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
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
