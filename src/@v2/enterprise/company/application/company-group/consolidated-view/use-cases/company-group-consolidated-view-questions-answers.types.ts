import {
  ConsolidatedViewQuestionsAnswersQuestionMeta,
  ConsolidatedViewQuestionsAnswersResult,
} from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-questions-answers.service';
import { ConsolidatedViewEligibleApplication } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-eligibility.service';
import { FormParticipantStructureBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-participant-structure-browse.model';
import { FormQuestionGroupWithAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-question-group-with-answers-browse.model';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

export namespace ICompanyGroupConsolidatedViewQuestionsAnswersUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    user: UserPayloadDto;
  };

  export type Result = {
    mode: 'virtual_consolidated';
    businessGroupId: number;
    businessGroupName: string;
    applications: ConsolidatedViewEligibleApplication[];
    structureFingerprint: string;
    results: FormQuestionGroupWithAnswersBrowseModel[];
    participantStructures: FormParticipantStructureBrowseModel[];
    questionMetaById: Record<string, ConsolidatedViewQuestionsAnswersQuestionMeta>;
    totals: ConsolidatedViewQuestionsAnswersResult['totals'];
  };
}
