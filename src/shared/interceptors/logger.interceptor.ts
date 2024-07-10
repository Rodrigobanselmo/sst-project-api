import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { AmazonLoggerProvider } from '../providers/LoggerProvider/implementations/AmazonStorage/AmazonLoggerProvider';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new AmazonLoggerProvider();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((response) => {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const { method, originalUrl, ip } = req;
        const body = req.body;
        const headers = req.headers;
        const user = req.user;

        this.logger.logRequest({
          response,
          method,
          originalUrl,
          ip,
          body: body,
          headers: headers,
          status: res.statusCode,
          user: user,
        });
      }),
    );
  }
}
