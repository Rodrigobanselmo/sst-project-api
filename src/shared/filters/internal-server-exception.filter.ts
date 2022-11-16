import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class InternalServerExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const resp = exception instanceof HttpException ? exception.getResponse() : { error: 'Internal server error' };

    const exceptionResponse = typeof resp === 'string' ? { error: 'Internal server error' } : resp;

    const message = exception ? exception?.message : 'Internal server error';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log('o something to warn me');
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...exceptionResponse,
    });
  }
}
