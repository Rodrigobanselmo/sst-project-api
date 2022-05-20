import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { InternalServerExceptionFilter } from './shared/filters/internal-server-exception.filter';
import { PrismaDbExceptionFilter } from './shared/filters/prisma-db-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('SST API')
    .setDescription('SST Rest API Documentation')
    .setVersion('1.0')
    .addTag('Software')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  if (process.env.NODE_ENV === 'production')
    app.useGlobalFilters(new InternalServerExceptionFilter());

  app.useGlobalFilters(new PrismaDbExceptionFilter());

  app.enableCors({
    exposedHeaders: ['Content-Disposition'],
    origin: '*',
  });
  await app.listen(process.env.PORT);
}
bootstrap();
