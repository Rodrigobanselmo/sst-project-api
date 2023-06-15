import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AmazonLoggerProvider } from '../providers/LoggerProvider/implementations/AmazonStorage/AmazonLoggerProvider';

@Catch()
export class InternalServerExceptionFilter implements ExceptionFilter {
  private logger = new AmazonLoggerProvider();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const resp = exception instanceof HttpException ? exception.getResponse() : { error: 'Internal server error' };

    const exceptionResponse = typeof resp === 'string' ? { error: 'Internal server error' } : resp;

    let message = exception ? exception?.message : 'Internal server error';

    if (status >= 500) {
      message = 'Algo de errado acontenceu, informe o suporte para mais detalhes';

      const { method, originalUrl, ip } = request;
      const body = request.body;
      const headers = request.headers;
      const user = request.user;

      const errorLog = {
        method,
        originalUrl,
        ip,
        body: body,
        headers: headers,
        status,
        error: exception.stack,
        user: user
      }

      this.logger.logError(errorLog);
      console.error(exception)
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
