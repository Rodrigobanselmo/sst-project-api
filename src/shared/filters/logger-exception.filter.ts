import { ArgumentsHost, Catch } from '@nestjs/common';
import { AmazonLoggerProvider } from '../providers/LoggerProvider/implementations/AmazonStorage/AmazonLoggerProvider';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class LoggerExceptionFilter extends BaseExceptionFilter {
  private logger = new AmazonLoggerProvider();

  catch(exception: unknown, host: ArgumentsHost) {
    // const ctx = host.switchToHttp();
    // const request = ctx.getRequest();
    // const response = ctx.getResponse();

    // const { method, originalUrl, body, headers } = request;

    super.catch(exception, host);
  }
}
