import { FindESocialBatchService } from './services/events/all/find-batch/find-batch.service';
import { CacheModule, forwardRef, Module } from '@nestjs/common';
import axios from 'axios';
import fs from 'fs';
import https from 'https';
import { SoapModule, SoapModuleOptions } from 'nestjs-soap';
import request from 'request';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { SoapClientEnum } from './../../shared/constants/enum/soapClient';
import { ESocialEvent2220Controller } from './controller/events/2220/events-2220.controller';
import { ESocialEventController } from './controller/events/all/events.controller';
import { TablesController } from './controller/tables/tables.controller';
import { CompanyCertRepository } from './repositories/implementations/CompanyCertRepository';
import { ESocial27TableRepository } from './repositories/implementations/ESocial27TableRepository';
import { ESocialBatchRepository } from './repositories/implementations/ESocialBatchRepository';
import { ESocialEventRepository } from './repositories/implementations/ESocialEventRepository';
import { FindEvents2220ESocialService } from './services/events/2220/find-events/find-events.service';
import { SendEvents2220ESocialService } from './services/events/2220/send-events/send-events.service';
import { AddCertificationESocialService } from './services/events/all/add-certificate/add-certificate.service';
import { SendBatchESocialService } from './services/events/all/send-batch/send-batch.service';
import { FindAllTable27Service } from './services/tables/find-all-27.service';
import { FindESocialEventService } from './services/events/all/find-events/find-events.service';
import { FetchESocialBatchEventsService } from './services/events/all/fetch-batch-events/fetch-batch-events.service';

@Module({
  controllers: [
    TablesController,
    ESocialEventController,
    ESocialEvent2220Controller,
  ],
  exports: [ESocialEventProvider],
  imports: [
    SoapModule.forRootAsync({
      clientName: SoapClientEnum.PRODUCTION_RESTRICT,
      useFactory: async (): Promise<SoapModuleOptions> => {
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          pfx: fs.readFileSync('cert/cert.pfx'),
          passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
        });

        const api = axios.create({
          httpsAgent,
        });

        return {
          clientName: SoapClientEnum.PRODUCTION_RESTRICT,
          uri: process.env.ESOCIAL_URL_PROD_RESTRICT,
          clientOptions: { request: api, escapeXML: false },
        };
      },
    }),
    SoapModule.forRootAsync({
      clientName: SoapClientEnum.PRODUCTION,
      useFactory: async (): Promise<SoapModuleOptions> => {
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          pfx: fs.readFileSync('cert/cert.pfx'),
          passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
        });

        const api = axios.create({
          httpsAgent,
        });

        return {
          clientName: SoapClientEnum.PRODUCTION,
          uri: process.env.ESOCIAL_URL_PROD,
          clientOptions: { request: api, escapeXML: false },
        };
      },
    }),
    SoapModule.forRootAsync({
      clientName: SoapClientEnum.CONSULT_PRODUCTION_RESTRICT,
      useFactory: async (): Promise<SoapModuleOptions> => {
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          pfx: fs.readFileSync('cert/cert.pfx'),
          passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
        });

        const api = axios.create({
          httpsAgent,
        });

        return {
          clientName: SoapClientEnum.CONSULT_PRODUCTION_RESTRICT,
          uri: process.env.ESOCIAL_CONSULT_URL_PROD_RESTRICT,
          clientOptions: { request: api, escapeXML: false },
        };
      },
    }),
    SoapModule.forRootAsync({
      clientName: SoapClientEnum.CONSULT_PRODUCTION,
      useFactory: async (): Promise<SoapModuleOptions> => {
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          pfx: fs.readFileSync('cert/cert.pfx'),
          passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
        });

        const api = axios.create({
          httpsAgent,
        });

        return {
          clientName: SoapClientEnum.CONSULT_PRODUCTION,
          uri: process.env.ESOCIAL_CONSULT_URL_PROD,
          clientOptions: { request: api, escapeXML: false },
        };
      },
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
    CacheModule.register(),
  ],
  providers: [
    FetchESocialBatchEventsService,
    ESocialMethodsProvider,
    ESocialEventProvider,
    FindAllTable27Service,
    AddCertificationESocialService,
    SendBatchESocialService,
    DayJSProvider,
    SendEvents2220ESocialService,
    CompanyCertRepository,
    ESocial27TableRepository,
    FindEvents2220ESocialService,
    ESocialBatchRepository,
    FindESocialBatchService,
    FindESocialEventService,
    ESocialEventRepository,
  ],
})
export class EsocialModule {}
