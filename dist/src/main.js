"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const internal_server_exception_filter_1 = require("./shared/filters/internal-server-exception.filter");
const prisma_db_exception_filter_1 = require("./shared/filters/prisma-db-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const options = new swagger_1.DocumentBuilder()
        .setTitle('SST API')
        .setDescription('SST Rest API Documentation')
        .setVersion('1.0')
        .addTag('Software')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    if (process.env.NODE_ENV === 'production')
        app.useGlobalFilters(new internal_server_exception_filter_1.InternalServerExceptionFilter());
    app.useGlobalFilters(new prisma_db_exception_filter_1.PrismaDbExceptionFilter());
    app.enableCors({
        exposedHeaders: ['Content-Disposition'],
        origin: '*',
    });
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map