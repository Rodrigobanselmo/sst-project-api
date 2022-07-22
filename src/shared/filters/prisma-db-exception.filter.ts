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
import { ErrorMessageEnum } from '../constants/enum/errorMessage';

@Catch(PrismaClientKnownRequestError)
export class PrismaDbExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const { code, meta } = exception;

    let error = new HttpException(ErrorMessageEnum.PRISMA_ERROR, 500);

    const { cause, target, field_name } = meta;

    console.log(exception);

    switch (code) {
      case 'P2002':
        if (target)
          error = new BadRequestException(
            `Dado que está tentando criar já existe: ${target.join(
              ', ',
            )} está em conflito`,
          );
        break;

      case 'P2003':
        if (field_name)
          //Data you trying to create or delete requires an FK
          error = new BadRequestException(
            `está faltando campos para realizar essa operação: ${field_name}`,
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
      message: error.message || ErrorMessageEnum.PRISMA_ERROR,
      error: error.name,
      path: request.url,
    });
  }
}
