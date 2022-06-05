"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDbExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const runtime_1 = require("@prisma/client/runtime");
let PrismaDbExceptionFilter = class PrismaDbExceptionFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const { code, meta } = exception;
        let error = new common_1.HttpException('Database Prisma error', 500);
        const { cause, target, field_name } = meta;
        console.log(exception);
        switch (code) {
            case 'P2002':
                if (target)
                    error = new common_1.BadRequestException(`Data you trying to create already exists: property ${target.join(', ')} is conflicting`);
                break;
            case 'P2003':
                if (field_name)
                    error = new common_1.BadRequestException(`Data you trying to create or delete requires an FK: ${field_name}`);
                break;
            case 'P2025':
                if (cause)
                    error = new common_1.BadRequestException(cause);
                break;
            default:
                break;
        }
        const status = error.getStatus();
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            console.log(`error`, exception);
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
};
PrismaDbExceptionFilter = __decorate([
    (0, common_1.Catch)(runtime_1.PrismaClientKnownRequestError)
], PrismaDbExceptionFilter);
exports.PrismaDbExceptionFilter = PrismaDbExceptionFilter;
//# sourceMappingURL=prisma-db-exception.filter.js.map