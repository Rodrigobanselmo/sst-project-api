import { SoapClientEnum } from '../../shared/constants/enum/soapClient';
import { Module } from '@nestjs/common';
import { ESocialEventProvider } from '../../shared/providers/ESocialEventProvider/implementations/ESocialEventProvider';

import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { ESocialEventController } from './controller/events/events.controller';
import { TablesController } from './controller/tables/tables.controller';
import { AddCertificationESocialService } from './services/events/add-certificate/add-certificate.service';
import { FindAllTable27Service } from './services/tables/find-all-27.service';
import { SoapModule } from 'nestjs-soap';
import fs from 'fs';
import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { SendBatchESocialService } from './services/events/send-batch/send-batch.service';

@Module({
  controllers: [TablesController, ESocialEventController],
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
    AuthModule,
    CompanyModule,
  ],
  providers: [
    FindAllTable27Service,
    AddCertificationESocialService,
    SendBatchESocialService,
    ESocialEventProvider,
    DayJSProvider,
  ],
})
export class EsocialModule {}
