import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { formApplicationNestedAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import {
  ClearFormAiAnalysisScopeEnum,
  IClearFormQuestionsAnswersAnalysisUseCase,
} from './clear-form-questions-answers-analysis.types';

@Injectable()
export class ClearFormQuestionsAnswersAnalysisUseCase {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
  ) {}

  async execute(
    params: IClearFormQuestionsAnswersAnalysisUseCase.Params,
  ): Promise<IClearFormQuestionsAnswersAnalysisUseCase.Result> {
    const scope = await this.formApplicationScopeService.resolve({
      formApplicationId: params.formApplicationId,
      accessCompanyId: params.companyId,
    });

    const participantCompanyIds =
      this.formApplicationScopeService.participantCompanyIdsForScope(scope);

    const { hierarchyIds, filters } = await this.resolveFilters(params);

    const where: Prisma.FormAiAnalysisWhereInput = {
      formApplicationId: params.formApplicationId,
      companyId: { in: participantCompanyIds },
      ...(params.riskId || filters.riskId
        ? { riskId: params.riskId ?? filters.riskId! }
        : {}),
      ...(hierarchyIds?.length
        ? { hierarchyId: { in: hierarchyIds } }
        : {}),
    };

    const matchedCount = await this.prisma.formAiAnalysis.count({ where });

    if (params.dryRun) {
      return {
        deletedCount: 0,
        matchedCount,
        dryRun: true,
        scope: params.scope,
        filters: {
          riskId: params.riskId ?? filters.riskId ?? null,
          hierarchyId: params.hierarchyId ?? filters.hierarchyId ?? null,
          hierarchyGroupId: params.hierarchyGroupId ?? null,
          expandedHierarchyIds: hierarchyIds,
        },
      };
    }

    const deleteResult = await this.prisma.formAiAnalysis.deleteMany({ where });

    return {
      deletedCount: deleteResult.count,
      matchedCount,
      dryRun: false,
      scope: params.scope,
      filters: {
        riskId: params.riskId ?? filters.riskId ?? null,
        hierarchyId: params.hierarchyId ?? filters.hierarchyId ?? null,
        hierarchyGroupId: params.hierarchyGroupId ?? null,
        expandedHierarchyIds: hierarchyIds,
      },
    };
  }

  private async resolveFilters(
    params: IClearFormQuestionsAnswersAnalysisUseCase.Params,
  ): Promise<{
    hierarchyIds?: string[];
    filters: {
      riskId?: string;
      hierarchyId?: string;
    };
  }> {
    const { scope } = params;

    switch (scope) {
      case ClearFormAiAnalysisScopeEnum.APPLICATION: {
        this.assertForbiddenFields(params, [
          'riskId',
          'hierarchyId',
          'hierarchyGroupId',
        ]);
        return { filters: {} };
      }

      case ClearFormAiAnalysisScopeEnum.RISK: {
        this.assertRequiredField(params.riskId, 'riskId');
        this.assertForbiddenFields(params, ['hierarchyId', 'hierarchyGroupId']);
        return { filters: { riskId: params.riskId } };
      }

      case ClearFormAiAnalysisScopeEnum.HIERARCHY: {
        this.assertRequiredField(params.hierarchyId, 'hierarchyId');
        this.assertForbiddenFields(params, ['hierarchyGroupId']);
        return {
          hierarchyIds: [params.hierarchyId!],
          filters: { hierarchyId: params.hierarchyId },
        };
      }

      case ClearFormAiAnalysisScopeEnum.HIERARCHY_GROUP: {
        this.assertRequiredField(params.hierarchyGroupId, 'hierarchyGroupId');
        this.assertForbiddenFields(params, ['hierarchyId']);
        const hierarchyIds = await this.resolveHierarchyGroupMemberIds(params);
        return { hierarchyIds, filters: {} };
      }

      case ClearFormAiAnalysisScopeEnum.HIERARCHY_GROUP_RISK: {
        this.assertRequiredField(params.hierarchyGroupId, 'hierarchyGroupId');
        this.assertRequiredField(params.riskId, 'riskId');
        this.assertForbiddenFields(params, ['hierarchyId']);
        const hierarchyIds = await this.resolveHierarchyGroupMemberIds(params);
        return {
          hierarchyIds,
          filters: { riskId: params.riskId },
        };
      }

      default:
        throw new BadRequestException('Escopo de limpeza inválido.');
    }
  }

  private async resolveHierarchyGroupMemberIds(
    params: IClearFormQuestionsAnswersAnalysisUseCase.Params,
  ): Promise<string[]> {
    const group = await this.prisma.formApplicationHierarchyGroup.findFirst({
      where: {
        id: params.hierarchyGroupId,
        form_application_id: params.formApplicationId,
        form_application: formApplicationNestedAccessWhere(params.companyId),
      },
      include: {
        hierarchies: { select: { hierarchy_id: true } },
      },
    });

    if (!group) {
      throw new NotFoundException('Agrupamento não encontrado');
    }

    return group.hierarchies.map((item) => item.hierarchy_id);
  }

  private assertRequiredField(value: string | undefined, fieldName: string) {
    if (!value?.trim()) {
      throw new BadRequestException(
        `O campo ${fieldName} é obrigatório para o escopo informado.`,
      );
    }
  }

  private assertForbiddenFields(
    params: IClearFormQuestionsAnswersAnalysisUseCase.Params,
    fieldNames: Array<'riskId' | 'hierarchyId' | 'hierarchyGroupId'>,
  ) {
    for (const fieldName of fieldNames) {
      if (params[fieldName]?.trim()) {
        throw new BadRequestException(
          `O campo ${fieldName} não é permitido para o escopo informado.`,
        );
      }
    }
  }
}
