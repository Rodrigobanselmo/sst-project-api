import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { FormApplicationCacheService } from './services/form-application-cache.service';
import { FormQuestionsAnswersRisksService } from './application/form-questions-answers/shared/services/form-questions-answers-risks.service';
import { AddFormApplicationController } from './application/form-application/add-form-application/controllers/add-form-application.controller';
import { AddFormApplicationUseCase } from './application/form-application/add-form-application/use-cases/add-form-application.usecase';
import { BrowseFormApplicationController } from './application/form-application/browse-form-application/controllers/browse-form-application.controller';
import { BrowseFormApplicationUseCase } from './application/form-application/browse-form-application/use-cases/browse-form-application.usecase';
import { EditFormApplicationController } from './application/form-application/edit-form-application/controllers/edit-form-application.controller';
import { EditFormApplicationUseCase } from './application/form-application/edit-form-application/use-cases/edit-form-application.usecase';
import { ReadFormApplicationController } from './application/form-application/read-form-application/controllers/read-form-application.controller';
import { ReadFormApplicationUseCase } from './application/form-application/read-form-application/use-cases/read-form-application.usecase';
import { PublicFormApplicationController } from './application/form-application/public-form-application/controllers/public-form-application.controller';
import { PublicFormApplicationUseCase } from './application/form-application/public-form-application/use-cases/public-form-application.usecase';
import { AddFormController } from './application/form/add-form/controllers/add-form.controller';
import { AddFormUseCase } from './application/form/add-form/use-cases/add-form.usecase';
import { BrowseFormController } from './application/form/browse-form/controllers/browse-form.controller';
import { BrowseFormUseCase } from './application/form/browse-form/use-cases/browse-form.usecase';
import { BrowseFormQuestionsAnswersController } from './application/form-questions-answers/browse-form-questions-answers/controllers/browse-form-questions-answers.controller';
import { BrowseFormQuestionsAnswersUseCase } from './application/form-questions-answers/browse-form-questions-answers/use-cases/browse-form-questions-answers.usecase';
import { EditFormController } from './application/form/edit-form/controllers/edit-form.controller';
import { EditFormUseCase } from './application/form/edit-form/use-cases/edit-form.usecase';
import { ReadFormController } from './application/form/read-form/controllers/read-form.controller';
import { ReadFormUseCase } from './application/form/read-form/use-cases/read-form.usecase';
import { FormApplicationDAO } from './database/dao/form-application/form-application.dao';
import { FormDAO } from './database/dao/form/form.dao';
import { RiskDAO } from './database/dao/risk/risk.dao';
import { FormQuestionsAnswersDAO } from './database/dao/form-questions-answers/form-questions-answers.dao';
import { FormApplicationAggregateRepository } from './database/repositories/form-application/form-application-aggregate.repository';
import { FormQuestionGroupAggregateRepository } from './database/repositories/form-question-group/form-question-group-aggregate.repository';
import { FormQuestionIdentifierEntityRepository } from './database/repositories/form-question-identifier/form-question-identifier.repository';
import { FormAggregateRepository } from './database/repositories/form/form-aggregate.repository';
import { FormRepository } from './database/repositories/form/form.repository';
import { FormQuestionAggregateRepository } from './database/repositories/form-question/form-question-aggregate.repository';
import { FormQuestionIdentifierGroupAggregateRepository } from './database/repositories/form-question-identifier-group/form-question-identifier-group-aggregate.repository';
import { FormApplicationRepository } from './database/repositories/form-application/form-application.repository';
import { FormParticipantsAnswersRepository } from './database/repositories/form-participants-answers/form-participants-answers.repository';
import { SubmitFormApplicationUseCase } from './application/form-application/public-submit-form-application/use-cases/public-submit-form-application.usecase';
import { PublicSubmitFormApplicationController } from './application/form-application/public-submit-form-application/controllers/public-submit-form-application.controller';
import { FormParticipantsAnswersAggregateRepository } from './database/repositories/form-participants-answers/form-participants-answers-aggregate.repository';
import { FormParticipantsAggregateRepository } from './database/repositories/form-participants/form-participants-aggregate.repository';
import { BrowseRisksController } from './application/risk/browse-risks/controllers/browse-risks.controller';
import { BrowseRisksUseCase } from './application/risk/browse-risks/use-cases/browse-risks.usecase';
import { BrowseHierarchiesController } from './application/hierarchy/browse-hierarchies/controllers/browse-hierarchies.controller';
import { BrowseHierarchiesUseCase } from './application/hierarchy/browse-hierarchies/use-cases/browse-hierarchies.usecase';
import { BrowseFormQuestionsAnswersRisksUseCase } from './application/form-questions-answers/browse-form-questions-answers-risks/use-cases/browse-form-questions-answers-risks.usecase';
import { BrowseFormQuestionsAnswersRisksController } from './application/form-questions-answers/browse-form-questions-answers-risks/controllers/browse-form-questions-answers-risks.controller';
import { AssignRisksFormApplicationController } from './application/form-application/assign-risks-form-application/controllers/assign-risks-form-application.controller';
import { AssignRisksFormApplicationUseCase } from './application/form-application/assign-risks-form-application/use-cases/assign-risks-form-application.usecase';
import { BrowseFormApplicationRiskLogController } from './application/form-application-risk-log/browse-form-application-risk-log/controllers/browse-form-application-risk-log.controller';
import { BrowseFormApplicationRiskLogUseCase } from './application/form-application-risk-log/browse-form-application-risk-log/use-cases/browse-form-application-risk-log.usecase';
import { FormApplicationRiskLogDAO } from './database/dao/form-application-risk-log/form-application-risk-log.dao';
import { BrowseFormParticipantsController } from './application/form-participants/browse-form-participants/controllers/browse-form-participants.controller';
import { BrowseFormParticipantsUseCase } from './application/form-participants/browse-form-participants/use-cases/browse-form-participants.usecase';
import { SendFormEmailController } from './application/form-participants/send-form-email/controllers/send-form-email.controller';
import { SendFormEmailUseCase } from './application/form-participants/send-form-email/use-cases/send-form-email.usecase';
import { FormParticipantsDAO } from './database/dao/form-participants/form-participants.dao';
import { AiAnalyzeFormQuestionsRisksController } from './application/form-questions-answers/ai-analyze-form-questions-risks/controllers/ai-analyze-form-questions-risks.controller';
import { AiAnalyzeFormQuestionsRisksUseCase } from './application/form-questions-answers/ai-analyze-form-questions-risks/use-cases/ai-analyze-form-questions-risks.usecase';
import { BrowseFormQuestionsAnswersAnalysisController } from './application/form-questions-answers/browse-form-questions-answers-analysis/controllers/browse-form-questions-answers-analysis.controller';
import { BrowseFormQuestionsAnswersAnalysisUseCase } from './application/form-questions-answers/browse-form-questions-answers-analysis/use-cases/browse-form-questions-answers-analysis.usecase';
import { EditFormQuestionsAnswersAnalysisController } from './application/form-questions-answers/edit-form-questions-answers-analysis/controllers/edit-form-questions-answers-analysis.controller';
import { EditFormQuestionsAnswersAnalysisUseCase } from './application/form-questions-answers/edit-form-questions-answers-analysis/use-cases/edit-form-questions-answers-analysis.usecase';
import { PublicFormParticipantLoginController } from './application/form-application/public-form-participant-login/controllers/public-form-participant-login.controller';
import { PublicFormParticipantLoginUseCase } from './application/form-application/public-form-participant-login/use-cases/public-form-participant-login.usecase';
import { SSTModule } from '@/modules/sst/sst.module';

@Module({
  imports: [SharedModule, SSTModule, CacheModule.register()],
  controllers: [
    ReadFormController,
    BrowseFormController,
    BrowseFormQuestionsAnswersController,
    AddFormController,
    EditFormController,
    ReadFormApplicationController,
    AddFormApplicationController,
    BrowseFormApplicationController,
    EditFormApplicationController,
    PublicFormApplicationController,
    PublicSubmitFormApplicationController,
    BrowseRisksController,
    BrowseHierarchiesController,
    BrowseFormQuestionsAnswersRisksController,
    AssignRisksFormApplicationController,
    BrowseFormApplicationRiskLogController,
    BrowseFormParticipantsController,
    SendFormEmailController,
    AiAnalyzeFormQuestionsRisksController,
    BrowseFormQuestionsAnswersAnalysisController,
    EditFormQuestionsAnswersAnalysisController,
    PublicFormParticipantLoginController,
  ],
  providers: [
    // Database
    FormDAO,
    RiskDAO,
    FormApplicationDAO,
    FormApplicationRiskLogDAO,
    FormQuestionsAnswersDAO,
    FormParticipantsDAO,
    FormRepository,
    FormAggregateRepository,
    FormQuestionIdentifierEntityRepository,
    FormApplicationAggregateRepository,
    FormQuestionGroupAggregateRepository,
    FormQuestionAggregateRepository,
    FormQuestionIdentifierGroupAggregateRepository,
    FormApplicationRepository,
    FormParticipantsAnswersRepository,
    FormParticipantsAnswersAggregateRepository,
    FormParticipantsAggregateRepository,
    // Use Cases
    ReadFormApplicationUseCase,
    BrowseFormApplicationUseCase,
    AddFormApplicationUseCase,
    EditFormApplicationUseCase,
    PublicFormApplicationUseCase,
    SubmitFormApplicationUseCase,
    ReadFormUseCase,
    BrowseFormUseCase,
    BrowseFormQuestionsAnswersUseCase,
    AddFormUseCase,
    EditFormUseCase,
    BrowseRisksUseCase,
    BrowseHierarchiesUseCase,
    BrowseFormQuestionsAnswersRisksUseCase,
    AssignRisksFormApplicationUseCase,
    BrowseFormApplicationRiskLogUseCase,
    BrowseFormParticipantsUseCase,
    SendFormEmailUseCase,
    AiAnalyzeFormQuestionsRisksUseCase,
    BrowseFormQuestionsAnswersAnalysisUseCase,
    EditFormQuestionsAnswersAnalysisUseCase,
    PublicFormParticipantLoginUseCase,
    // Services
    FormApplicationCacheService,
    FormQuestionsAnswersRisksService,
  ],
  exports: [],
})
export class FormModule {}
