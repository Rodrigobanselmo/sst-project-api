import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class PrismaDbExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
