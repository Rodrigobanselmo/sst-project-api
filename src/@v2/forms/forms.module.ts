import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { AddFormApplicationController } from './application/form-application/add-form-application/controllers/add-form-application.controller';
import { AddFormApplicationUseCase } from './application/form-application/add-form-application/use-cases/add-form-application.usecase';
import { BrowseFormApplicationController } from './application/form-application/browse-form-application/controllers/browse-form-application.controller';
import { BrowseFormApplicationUseCase } from './application/form-application/browse-form-application/use-cases/browse-form-application.usecase';
import { EditFormApplicationController } from './application/form-application/edit-form-application/controllers/edit-form-application.controller';
import { EditFormApplicationUseCase } from './application/form-application/edit-form-application/use-cases/edit-form-application.usecase';
import { ReadFormApplicationController } from './application/form-application/read-form-application/controllers/read-form-application.controller';
import { ReadFormApplicationUseCase } from './application/form-application/read-form-application/use-cases/read-form-application.usecase';
import { AddFormController } from './application/form/add-form/controllers/add-form.controller';
import { AddFormUseCase } from './application/form/add-form/use-cases/add-form.usecase';
import { BrowseFormController } from './application/form/browse-form/controllers/browse-form.controller';
import { BrowseFormUseCase } from './application/form/browse-form/use-cases/browse-form.usecase';
import { EditFormController } from './application/form/edit-form/controllers/edit-form.controller';
import { EditFormUseCase } from './application/form/edit-form/use-cases/edit-form.usecase';
import { ReadFormController } from './application/form/read-form/controllers/read-form.controller';
import { ReadFormUseCase } from './application/form/read-form/use-cases/read-form.usecase';
import { FormApplicationDAO } from './database/dao/form-application/form-application.dao';
import { FormDAO } from './database/dao/form/form.dao';
import { FormApplicationAggregateRepository } from './database/repositories/form-application/form-application-aggregate.repository';
import { FormQuestionGroupAggregateRepository } from './database/repositories/form-question-group/form-question-group-aggregate.repository';
import { FormQuestionIdentifierEntityRepository } from './database/repositories/form-question-identifier/form-question-identifier.repository';
import { FormAggregateRepository } from './database/repositories/form/form-aggregate.repository';
import { FormRepository } from './database/repositories/form/form.repository';
import { FormQuestionAggregateRepository } from './database/repositories/form-question/form-question-aggregate.repository';
import { FormQuestionIdentifierGroupAggregateRepository } from './database/repositories/form-question-identifier-group/form-question-identifier-group-aggregate.repository';

@Module({
  imports: [SharedModule],
  controllers: [
    ReadFormController,
    BrowseFormController,
    AddFormController,
    EditFormController,
    ReadFormApplicationController,
    AddFormApplicationController,
    BrowseFormApplicationController,
    EditFormApplicationController,
  ],
  providers: [
    // Database
    FormDAO,
    FormApplicationDAO,
    FormRepository,
    FormAggregateRepository,
    FormQuestionIdentifierEntityRepository,
    FormApplicationAggregateRepository,
    FormQuestionGroupAggregateRepository,
    FormQuestionAggregateRepository,
    FormQuestionIdentifierGroupAggregateRepository,

    // Use Cases
    ReadFormApplicationUseCase,
    BrowseFormApplicationUseCase,
    AddFormApplicationUseCase,
    EditFormApplicationUseCase,
    ReadFormUseCase,
    BrowseFormUseCase,
    AddFormUseCase,
    EditFormUseCase,
  ],
  exports: [],
})
export class FormModule {}
