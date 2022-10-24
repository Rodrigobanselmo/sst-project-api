import { Module } from '@nestjs/common';
import { TecnoSpeedESocialProvider } from '../../shared/providers/ESocialEventProvider/implementations/TecnoSpeedESocialProvider';

import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { ESocialEventController } from './controller/events/events.controller';
import { TablesController } from './controller/tables/tables.controller';
import { AddCertificationESocialService } from './services/events/add-certificate/add-certificate.service';
import { FindAllTable27Service } from './services/tables/find-all-27.service';

@Module({
  controllers: [TablesController, ESocialEventController],
  imports: [AuthModule, CompanyModule],
  providers: [
    FindAllTable27Service,
    AddCertificationESocialService,
    TecnoSpeedESocialProvider,
  ],
})
export class EsocialModule {}
