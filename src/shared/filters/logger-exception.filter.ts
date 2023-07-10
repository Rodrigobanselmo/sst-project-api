import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';
import { ErrorMessageEnum } from '../constants/enum/errorMessage';
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