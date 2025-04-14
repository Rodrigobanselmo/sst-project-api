import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { ReadFormApplicationController } from './application/form-application/read-form-application/controllers/read-form-application.controller';
import { ReadFormApplicationUseCase } from './application/form-application/read-form-application/use-cases/read-form-application.usecase';
import { FormApplicationDAO } from './database/dao/form-application/form-application.dao';
import { BrowseFormApplicationUseCase } from './application/form-application/browse-form-application/use-cases/browse-form-application.usecase';
import { AddFormApplicationUseCase } from './application/form-application/add-form-application/use-cases/add-form-application.usecase';
import { EditFormApplicationUseCase } from './application/form-application/edit-form-application/use-cases/edit-form-application.usecase';
import { FormApplicationAggregateRepository } from './database/repositories/form-application/form-application-aggregate.repository';
import { FormRepository } from './database/repositories/form/form.repository';
import { FormQuestionDataAggregateRepository } from './database/repositories/form-question-identifier/form-question-identifier-data-aggregate.repository';
import { ReadFormUseCase } from './application/form/read-form/use-cases/read-form.usecase';
import { BrowseFormUseCase } from './application/form/browse-form/use-cases/browse-form.usecase';
import { AddFormApplicationController } from './application/form-application/add-form-application/controllers/add-form-application.controller';
import { BrowseFormApplicationController } from './application/form-application/browse-form-application/controllers/browse-form-application.controller';
import { EditFormApplicationController } from './application/form-application/edit-form-application/controllers/edit-form-application.controller';
import { ReadFormController } from './application/form/read-form/controllers/read-form.controller';
import { BrowseFormController } from './application/form/browse-form/controllers/browse-form.controller';
import { FormDAO } from './database/dao/form/form.dao';

@Module({
  imports: [SharedModule],
  controllers: [ReadFormController, BrowseFormController, ReadFormApplicationController, AddFormApplicationController, BrowseFormApplicationController, EditFormApplicationController],
  providers: [
    // Database
    FormDAO,
    FormApplicationDAO,
    FormRepository,
    FormQuestionDataAggregateRepository,
    FormApplicationAggregateRepository,

    // Use Cases
    ReadFormApplicationUseCase,
    BrowseFormApplicationUseCase,
    AddFormApplicationUseCase,
    EditFormApplicationUseCase,
    ReadFormUseCase,
    BrowseFormUseCase,
  ],
  exports: [],
})
export class FormModule {}
