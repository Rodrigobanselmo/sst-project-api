"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let InternalServerExceptionFilter = class InternalServerExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const resp = exception instanceof common_1.HttpException ? exception.getResponse() : { error: 'Internal server error' };
        const exceptionResponse = typeof resp === 'string' ? { error: 'Internal server error' } : resp;
        const message = exception ? exception === null || exception === void 0 ? void 0 : exception.message : 'Internal server error';
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            console.log('o something to warn me');
        }
        response.status(status).json(Object.assign({ statusCode: status, timestamp: new Date().toISOString(), path: request.url, message }, exceptionResponse));
    }
};
InternalServerExceptionFilter = __decorate([
    (0, common_1.Catch)()
], InternalServerExceptionFilter);
exports.InternalServerExceptionFilter = InternalServerExceptionFilter;
//# sourceMappingURL=internal-server-exception.filter.js.map