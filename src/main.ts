import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import helmet from 'helmet';

import { AppModule } from './app.module';
import { InternalServerExceptionFilter } from './shared/filters/internal-server-exception.filter';
import { PrismaDbExceptionFilter } from './shared/filters/prisma-db-exception.filter';
import { urlencoded, json } from 'express';
import { LoggingInterceptor } from './shared/interceptors/logger.interceptor';
import { LoggerExceptionFilter } from './shared/filters/logger-exception.filter';

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  console.info('STARTED');
  const isDev = process.env.NODE_ENV === 'development';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: false,
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

  app.useGlobalFilters(new InternalServerExceptionFilter());
  app.useGlobalFilters(new PrismaDbExceptionFilter());

  app.enableCors({
    exposedHeaders: ['Content-Disposition'],
    origin: ['https://simplesst.com.br', 'https://www.simplesst.com.br', 'https://simplesst.com', 'https://www.simplesst.com'],
    // origin: ['https://simplesst.com', 'http://201.75.187.24'],
    ...(isDev && {
      origin: '*',
    })
  });

  // app.use(helmet());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(process.env.PORT);
}
bootstrap();
