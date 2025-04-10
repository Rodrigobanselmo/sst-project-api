import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { ReadFormApplicationController } from './application/form-application/read-form-application/controllers/read-form-application.controller';
import { ReadFormApplicationUseCase } from './application/form-application/read-form-application/use-cases/read-form-application.usecase';
import { FormApplicationDAO } from './database/dao/form-application/form-application.dao';

@Module({
  imports: [SharedModule],
  controllers: [ReadFormApplicationController],
  providers: [
    // Database
    FormApplicationDAO,

    // Use Cases
    ReadFormApplicationUseCase,
  ],
  exports: [],
})
export class DocumentControlModule {}
