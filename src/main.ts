import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { InternalServerExceptionFilter } from './shared/filters/internal-server-exception.filter';
import { PrismaDbExceptionFilter } from './shared/filters/prisma-db-exception.filter';
import { urlencoded, json } from 'express';
import useragent from 'express-useragent';
import { LoggingInterceptor } from './shared/interceptors/logger.interceptor';
import { LoggerExceptionFilter } from './shared/filters/logger-exception.filter';

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';
import { NestExpressApplication } from '@nestjs/platform-express';

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

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
    // logger: WinstonModule.createLogger({
    //   format: winston.format.uncolorize(), //Uncolorize logs as weird character encoding appears when logs are colorized in cloudwatch.
    //   transports: [
    //     new winston.transports.Console({
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.ms(),
    //         nestWinstonModuleUtilities.format.nestLike()
    //       ),
    //     }),
    //     new CloudWatchTransport({
    //       level: 'error',
    //       name: "Cloudwatch Logs",
    //       logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
    //       logStreamName: process.env.CLOUDWATCH_LOG_NAME,
    //       awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //       awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    //       awsRegion: process.env.CLOUDWATCH_AWS_REGION,
    //       messageFormatter: function (item) {
    //         return (
    //           item.level + item.message
    //         );
    //       },
    //     }),
    //   ],
    // }),
  });

  app.set('trust proxy', true)


  // app.useGlobalInterceptors(new LoggingInterceptor());
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

  // app.useGlobalFilters(new LoggerExceptionFilter())
  // if (process.env.NODE_ENV === 'production') 
  // else 
  app.useGlobalFilters(new InternalServerExceptionFilter());
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
