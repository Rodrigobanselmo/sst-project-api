import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class InternalServerExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
