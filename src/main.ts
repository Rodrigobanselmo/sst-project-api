import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { InternalServerExceptionFilter } from './shared/filters/internal-server-exception.filter';
import { PrismaDbExceptionFilter } from './shared/filters/prisma-db-exception.filter';
import { urlencoded, json } from 'express';
// import chalk from 'chalk';

// export function logger(req, res, next) {
//   if (process.env.NODE_ENV !== 'development') {
//     next();
//     return;
//   }
//   if (req.method === 'OPTIONS') {
//     next();
//     return;
//   }

//   const shortPath = (req?.url as string)
//     .split('?')[0]
//     .split('/')
//     .map((path) => (path.split('-').length == 5 ? path.split('-')[0] : path))
//     .join('/');

//   const queryParams = ((req?.url as string).split('?')[1] || '')
//     .split('&')
//     .map((path) => (path.split('-').length == 5 ? path.split('-')[0] : path))
//     .join('&');

//   console.info((req.method === 'GET' ? chalk.cyan : chalk.red)(`[${req.method}]: `) + chalk.blue(`${shortPath}`) + chalk.gray(`?${queryParams}`));

//   next();
// }

async function bootstrap() {
  console.info('STARTED');

  const app = await NestFactory.create(AppModule);

  // app.use(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const options = new DocumentBuilder().setTitle('SST API').setDescription('SST Rest API Documentation').setVersion('1.0').addTag('Software').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  if (process.env.NODE_ENV === 'production') app.useGlobalFilters(new InternalServerExceptionFilter());

  app.useGlobalFilters(new PrismaDbExceptionFilter());

  app.enableCors({
    exposedHeaders: ['Content-Disposition'],
    origin: '*',
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(process.env.PORT);
}
bootstrap();
