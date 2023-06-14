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

    const message = exception ? exception?.message : 'Internal server error';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log('do something to warn me');
    }

    // const { method, originalUrl, ip } = req;
    // const body = req.body;
    // const headers = req.headers;
    // const user = req.user;

    // this.logger.logRequest({
    //   method,
    //   originalUrl,
    //   ip,
    //   body: body,
    //   headers: headers,
    //   status,
    //   error: {
    //     message,
    //     error,
    //   }
    //   user: user
    // });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...exceptionResponse,
    });
  }
}
