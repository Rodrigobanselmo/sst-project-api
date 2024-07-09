import { forwardRef, Module } from '@nestjs/common';
import axios from 'axios';
import fs from 'fs';
import https from 'https';
import { SoapModule, SoapModuleOptions } from 'nestjs-soap';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { SSTModule } from '../sst/sst.module';
import { SoapClientEnum } from './../../shared/constants/enum/soapClient';
import { ESocialEvent2210Controller } from './controller/events/2210/events-2210.controller';
import { ESocialEvent2220Controller } from './controller/events/2220/events-2220.controller';
import { ESocialEvent2240Controller } from './controller/events/2240/events-2240.controller';
import { ESocialEventController } from './controller/events/all/events.controller';
import { TablesController } from './controller/tables/tables.controller';
import { EsocialFetchBatchCron } from './crons/esocial-fetch-batch/esocial-fetch-batch.cron';
import { CompanyCertRepository } from './repositories/implementations/CompanyCertRepository';
import { ESocial27TableRepository } from './repositories/implementations/ESocial27TableRepository';
import { ESocialBatchRepository } from './repositories/implementations/ESocialBatchRepository';
import { ESocialEventRepository } from './repositories/implementations/ESocialEventRepository';
import { FindEvents2210ESocialService } from './services/events/2210/find-events/find-events-2210.service';
import { SendEvents2210ESocialService } from './services/events/2210/send-events/send-events-2210.service';
import { FindEvents2220ESocialService } from './services/events/2220/find-events/find-events.service';
import { SendEvents2220ESocialService } from './services/events/2220/send-events/send-events.service';
import { FindEvents2240ESocialService } from './services/events/2240/find-events/find-events.service';
import { SendEvents2240ESocialService } from './services/events/2240/send-events/send-events.service';
import { AddCertificationESocialService } from './services/events/all/add-certificate/add-certificate.service';
import { FetchESocialBatchEventsService } from './services/events/all/fetch-batch-events/fetch-batch-events.service';
import { FetchOneESocialBatchEventsService } from './services/events/all/fetch-one-batch-event/fetch-one-batch-event.service';
import { FindESocialBatchService } from './services/events/all/find-batch/find-batch.service';
import { FindESocialEventService } from './services/events/all/find-events/find-events.service';
import { SendBatchESocialService } from './services/events/all/send-batch/send-batch.service';
import { FindAllTable27Service } from './services/tables/find-all-27.service';
import { checkInternetConnectivity } from '../../shared/utils/isOnline';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [
    TablesController,
    ESocialEventController,
    ESocialEvent2210Controller,
    ESocialEvent2220Controller,
    ESocialEvent2240Controller,
  ],
  exports: [ESocialEventProvider],
  imports: [
    SoapModule.forRootAsync({
      clientName: SoapClientEnum.PRODUCTION_RESTRICT,
      useFactory: async (): Promise<SoapModuleOptions> => {
        const online = await checkInternetConnectivity();

        if (!online) {
          console.log('Skipping SOAP connection. Working in offline mode.');
          return null; // Skip SOAP connection if offline
        }

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
          clientOptions: { request: api as any, escapeXML: false },
        };
      },
    }),
    SoapModule.forRootAsync({
      clientName: SoapClientEnum.PRODUCTION,
      useFactory: async (): Promise<SoapModuleOptions> => {
        const online = await checkInternetConnectivity();

        if (!online) {
          console.log('Skipping SOAP connection. Working in offline mode.');
          return null; // Skip SOAP connection if offline
        }

        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          pfx: fs.readFileSync('cert/cert.pfx'),
          passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
        });

        const api = axios.create({ httpsAgent });

        return {
          clientName: SoapClientEnum.PRODUCTION,
          uri: process.env.ESOCIAL_URL_PROD,
          clientOptions: { request: api as any, escapeXML: false },
        };
      },
    }),
    SoapModule.forRootAsync({
      clientName: SoapClientEnum.CONSULT_PRODUCTION_RESTRICT,
      useFactory: async (): Promise<SoapModuleOptions> => {
        const online = await checkInternetConnectivity();

        if (!online) {
          console.log('Skipping SOAP connection. Working in offline mode.');
          return null; // Skip SOAP connection if offline
        }

        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          pfx: fs.readFileSync('cert/cert.pfx'),
          passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
        });

        const api = axios.create({ httpsAgent });

        return {
          clientName: SoapClientEnum.CONSULT_PRODUCTION_RESTRICT,
          uri: process.env.ESOCIAL_CONSULT_URL_PROD_RESTRICT,
          clientOptions: { request: api as any, escapeXML: false },
        };
      },
    }),
    SoapModule.forRootAsync({
      clientName: SoapClientEnum.CONSULT_PRODUCTION,
      useFactory: async (): Promise<SoapModuleOptions> => {
        const online = await checkInternetConnectivity();

        if (!online) {
          console.log('Skipping SOAP connection. Working in offline mode.');
          return null; // Skip SOAP connection if offline
        }

        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          pfx: fs.readFileSync('cert/cert.pfx'),
          passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
        });

        const api = axios.create({ httpsAgent });

        return {
          clientName: SoapClientEnum.CONSULT_PRODUCTION,
          uri: process.env.ESOCIAL_CONSULT_URL_PROD,
          clientOptions: { request: api as any, escapeXML: false },
        };
      },
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => SSTModule),
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
    EsocialFetchBatchCron,
    FindEvents2240ESocialService,
    SendEvents2240ESocialService,
    FindEvents2210ESocialService,
    SendEvents2210ESocialService,
    FetchOneESocialBatchEventsService,
  ],
})
export class EsocialModule {}
