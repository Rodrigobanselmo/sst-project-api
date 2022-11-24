"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const internal_server_exception_filter_1 = require("./shared/filters/internal-server-exception.filter");
const prisma_db_exception_filter_1 = require("./shared/filters/prisma-db-exception.filter");
const express_1 = require("express");
const chalk_1 = __importDefault(require("chalk"));
function logger(req, res, next) {
    if (process.env.NODE_ENV !== 'development') {
        next();
        return;
    }
    if (req.method === 'OPTIONS') {
        next();
        return;
    }
    const shortPath = (req === null || req === void 0 ? void 0 : req.url)
        .split('?')[0]
        .split('/')
        .map((path) => (path.split('-').length == 5 ? path.split('-')[0] : path))
        .join('/');
    const queryParams = ((req === null || req === void 0 ? void 0 : req.url).split('?')[1] || '')
        .split('&')
        .map((path) => (path.split('-').length == 5 ? path.split('-')[0] : path))
        .join('&');
    console.log((req.method === 'GET' ? chalk_1.default.cyan : chalk_1.default.red)(`[${req.method}]: `) + chalk_1.default.blue(`${shortPath}`) + chalk_1.default.gray(`?${queryParams}`));
    next();
}
exports.logger = logger;
async function bootstrap() {
    console.log('STARTED');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(logger);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const options = new swagger_1.DocumentBuilder().setTitle('SST API').setDescription('SST Rest API Documentation').setVersion('1.0').addTag('Software').addBearerAuth().build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    if (process.env.NODE_ENV === 'production')
        app.useGlobalFilters(new internal_server_exception_filter_1.InternalServerExceptionFilter());
    app.useGlobalFilters(new prisma_db_exception_filter_1.PrismaDbExceptionFilter());
    app.enableCors({
        exposedHeaders: ['Content-Disposition'],
        origin: '*',
    });
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map