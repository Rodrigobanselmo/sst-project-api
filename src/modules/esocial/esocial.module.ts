import { forwardRef, Module } from '@nestjs/common';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { ESocialEvent2220Controller } from './controller/events/2220/events-2220.controller';
import { ESocialEventController } from './controller/events/all/events.controller';
import { TablesController } from './controller/tables/tables.controller';
import { CompanyCertRepository } from './repositories/implementations/CompanyCertRepository';
import { ESocial27TableRepository } from './repositories/implementations/ESocial27TableRepository';
import { FindEvents2220ESocialService } from './services/events/2220/find-events/find-events.service';
import { SendEvents2220ESocialService } from './services/events/2220/send-events/send-events.service';
import { AddCertificationESocialService } from './services/events/all/add-certificate/add-certificate.service';
import { SendBatchESocialService } from './services/events/all/send-batch/send-batch.service';
import { FindAllTable27Service } from './services/tables/find-all-27.service';

@Module({
  controllers: [
    TablesController,
    ESocialEventController,
    ESocialEvent2220Controller,
  ],
  exports: [ESocialEventProvider],
  imports: [
    // SoapModule.register({
    //   clientName: SoapClientEnum.PRODUCTION,
    //   // uri: process.env.ESOCIAL_URL_PROD,
    //   uri: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?wsdl',
    // }),
    // SoapModule.register({
    //   clientName: SoapClientEnum.PRODUCTION_RESTRICT,
    //   uri: 'https://webservices.producaorestrita.esocial.gov.br/servicos/empregador/enviarloteeventos/WsEnviarLoteEventos.svc?wsdl',
    //   clientOptions: {
    //     wsdl_options: {
    //       pfx: fs.readFileSync('cert/cert.pfx'),
    //       passphrase: '230296',
    //       // ca: fs.readFileSync('cert/esocial/cert.pem'),
    //       // cert: fs.readFileSync('cert/esocial/cert.pem'),
    //       rejectUnauthorized: false,
    //     },
    //   },
    // }),
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
  ],
  providers: [
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
  ],
})
export class EsocialModule {}
