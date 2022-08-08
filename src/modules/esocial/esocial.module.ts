import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { TablesController } from './controller/tables/tables.controller';
import { FindAllTable27Service } from './services/tables/find-all-27';

@Module({
  controllers: [TablesController],
  imports: [AuthModule, CompanyModule],
  providers: [FindAllTable27Service],
})
export class EsocialModule {}
