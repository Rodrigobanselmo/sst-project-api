import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FormAiAnalysisStatusEnum, Prisma } from '@prisma/client';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { formApplicationNestedAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import {
  ClearFormAiAnalysisScopeEnum,
} from '@/@v2/forms/application/form-questions-answers/clear-form-questions-answers-analysis/use-cases/clear-form-questions-answers-analysis.types';
import {
  buildStuckAiAnalysisRecoveryMetadata,
  DEFAULT_STUCK_AI_ANALYSIS_OLDER_THAN_MINUTES,
  isStuckProcessingRecord,
  resolveStuckAiAnalysisRecoveryAction,
} from '@/@v2/forms/application/form-questions-answers/shared/helpers/stuck-form-ai-analysis.helpers';
import { IRecoverStuckFormQuestionsAnswersAnalysisUseCase } from './recover-stuck-form-questions-answers-analysis.types';

@Injectable()
export class RecoverStuckFormQuestionsAnswersAnalysisUseCase {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
  ) {}

  async execute(
    params: IRecoverStuckFormQuestionsAnswersAnalysisUseCase.Params,
  ): Promise<IRecoverStuckFormQuestionsAnswersAnalysisUseCase.Result> {
    const olderThanMinutes =
      params.olderThanMinutes ?? DEFAULT_STUCK_AI_ANALYSIS_OLDER_THAN_MINUTES;

    if (!Number.isFinite(olderThanMinutes) || olderThanMinutes < 1) {
      throw new BadRequestException(
        'olderThanMinutes deve ser um número maior ou igual a 1.',
      );
    }

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
      status: FormAiAnalysisStatusEnum.PROCESSING,
      ...(params.riskId || filters.riskId
        ? { riskId: params.riskId ?? filters.riskId! }
        : {}),
      ...(hierarchyIds?.length
        ? { hierarchyId: { in: hierarchyIds } }
        : {}),
    };

    const records = await this.prisma.formAiAnalysis.findMany({
      where,
      include: {
        riskFactor: { select: { name: true } },
        hierarchy: { select: { name: true } },
      },
      orderBy: [{ updated_at: 'asc' }, { riskId: 'asc' }],
    });

    const stuckRecords = records.filter((record) =>
      isStuckProcessingRecord({
        status: record.status,
        updatedAt: record.updated_at,
        createdAt: record.created_at,
        olderThanMinutes,
      }),
    );

    const items: IRecoverStuckFormQuestionsAnswersAnalysisUseCase.StuckAnalysisItem[] =
      stuckRecords.map((record) => ({
        id: record.id,
        riskId: record.riskId,
        hierarchyId: record.hierarchyId,
        riskName: record.riskFactor.name,
        hierarchyName: record.hierarchy.name,
        updatedAt: record.updated_at,
        recoveryAction: resolveStuckAiAnalysisRecoveryAction(record.analysis),
      }));

    const promoteToDoneCount = items.filter(
      (item) => item.recoveryAction === 'DONE',
    ).length;
    const markAsFailedCount = items.filter(
      (item) => item.recoveryAction === 'FAILED',
    ).length;

    if (!params.dryRun && items.length > 0) {
      const recoveredAt = new Date().toISOString();

      await Promise.all(
        stuckRecords.map((record) => {
          const recoveryAction = resolveStuckAiAnalysisRecoveryAction(
            record.analysis,
          );
          const existingMetadata =
            (record.metadata as Record<string, unknown> | null) ?? {};

          return this.prisma.formAiAnalysis.update({
            where: { id: record.id },
            data: {
              status:
                recoveryAction === 'DONE'
                  ? FormAiAnalysisStatusEnum.DONE
                  : FormAiAnalysisStatusEnum.FAILED,
              metadata: buildStuckAiAnalysisRecoveryMetadata({
                existingMetadata,
                action: recoveryAction,
                recoveredAt,
              }) as Prisma.InputJsonValue,
            },
          });
        }),
      );
    }

    return {
      dryRun: Boolean(params.dryRun),
      scope: params.scope,
      olderThanMinutes,
      totalStuckCount: items.length,
      promoteToDoneCount,
      markAsFailedCount,
      recoveredCount: params.dryRun ? 0 : items.length,
      filters: {
        riskId: params.riskId ?? filters.riskId ?? null,
        hierarchyId: params.hierarchyId ?? filters.hierarchyId ?? null,
        hierarchyGroupId: params.hierarchyGroupId ?? null,
        expandedHierarchyIds: hierarchyIds,
      },
      items,
    };
  }

  private async resolveFilters(
    params: IRecoverStuckFormQuestionsAnswersAnalysisUseCase.Params,
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
        throw new BadRequestException('Escopo de recuperação inválido.');
    }
  }

  private async resolveHierarchyGroupMemberIds(
    params: IRecoverStuckFormQuestionsAnswersAnalysisUseCase.Params,
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
    params: IRecoverStuckFormQuestionsAnswersAnalysisUseCase.Params,
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
