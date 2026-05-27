import { Injectable } from '@nestjs/common';
import { BrowseFormQuestionsAnswersUseCase } from '../../browse-form-questions-answers/use-cases/browse-form-questions-answers.usecase';
import { BrowseHierarchyGroupsUseCase } from '@/@v2/forms/application/hierarchy-group/browse-hierarchy-groups/use-cases/browse-hierarchy-groups.usecase';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { IndicatorsNarrativeDiagnosticScope } from '../shared/indicators-narrative-diagnostic-scope.types';
import {
  buildIndicatorsNarrativePayload,
  countVisibleIndicatorRows,
  formatIndicatorsNarrativePayloadToText,
} from '../helpers/build-indicators-narrative-payload';

export type IndicatorsNarrativeInputBuildResult = {
  content: Array<{ type: 'text'; text: string }>;
  summary: {
    formGroupCount: number;
    visibleIndicatorRows: number;
    scope: IndicatorsNarrativeDiagnosticScope;
  };
};

@Injectable()
export class BuildIndicatorsNarrativeInputService {
  constructor(
    private readonly browseFormQuestionsAnswersUseCase: BrowseFormQuestionsAnswersUseCase,
    private readonly browseHierarchyGroupsUseCase: BrowseHierarchyGroupsUseCase,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async build(params: {
    companyId: string;
    formApplicationId: string;
    scope: IndicatorsNarrativeDiagnosticScope;
    formApplicationName?: string;
    formModelName?: string;
  }): Promise<IndicatorsNarrativeInputBuildResult> {
    const formQuestionsAnswers = await this.browseFormQuestionsAnswersUseCase.execute({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
    });

    const hierarchyGroups = await this.browseHierarchyGroupsUseCase.execute({
      companyId: params.companyId,
      applicationId: params.formApplicationId,
    });

    const formApplication = await this.prisma.formApplication.findFirst({
      where: { id: params.formApplicationId },
      select: {
        shareable_link: true,
        form: { select: { shareable_link: true } },
      },
    });

    const isShareableLink =
      formApplication?.shareable_link ?? formApplication?.form?.shareable_link ?? true;

    const payload = buildIndicatorsNarrativePayload({
      formQuestionsAnswers,
      selectedGroupingQuestionId: params.scope.groupingQuestionId,
      showOnlyGroupIndicators: params.scope.showOnlyGroupIndicators,
      isShareableLink,
      hierarchyGroups,
      visibleParticipantGroupIds:
        params.scope.groupingQuestionId && params.scope.participantGroupIds.length > 0
          ? params.scope.participantGroupIds
          : undefined,
    });

    const text = formatIndicatorsNarrativePayloadToText(payload, {
      formApplicationName: params.formApplicationName,
      formModelName: params.formModelName,
      groupingLabel: params.scope.groupingLabel,
    });

    return {
      content: [{ type: 'text', text }],
      summary: {
        formGroupCount: payload.formGroups.length,
        visibleIndicatorRows: countVisibleIndicatorRows(payload),
        scope: params.scope,
      },
    };
  }
}
