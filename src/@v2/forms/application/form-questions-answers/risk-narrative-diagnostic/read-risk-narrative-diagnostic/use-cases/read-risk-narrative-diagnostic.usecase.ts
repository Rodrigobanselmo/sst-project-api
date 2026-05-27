import { Injectable } from '@nestjs/common';
import { FormRiskNarrativeDiagnosticRepository } from '@/@v2/forms/database/repositories/form-risk-narrative-diagnostic/form-risk-narrative-diagnostic.repository';
import {
  buildRiskNarrativeScopeKey,
  RiskNarrativeDiagnosticScope,
} from '../../shared/risk-narrative-diagnostic-scope.types';
import { IReadRiskNarrativeDiagnosticUseCase } from './read-risk-narrative-diagnostic.types';

@Injectable()
export class ReadRiskNarrativeDiagnosticUseCase {
  constructor(private readonly repository: FormRiskNarrativeDiagnosticRepository) {}

  async execute(
    params: IReadRiskNarrativeDiagnosticUseCase.Params,
  ): Promise<IReadRiskNarrativeDiagnosticUseCase.Result> {
    const scope: RiskNarrativeDiagnosticScope = {
      groupingQuestionId: params.scope.groupingQuestionId ?? null,
      participantGroupIds: params.scope.participantGroupIds ?? [],
      allowedHierarchyIds: params.scope.allowedHierarchyIds ?? null,
      groupingLabel: params.scope.groupingLabel ?? null,
    };

    const scopeKey = buildRiskNarrativeScopeKey(scope);
    const record = await this.repository.findByApplicationAndScope(
      params.formApplicationId,
      scopeKey,
    );

    if (!record) return null;

    return {
      id: record.id,
      formApplicationId: record.formApplicationId,
      scopeKey: record.scopeKey,
      scope: record.scope as RiskNarrativeDiagnosticScope,
      status: record.status,
      contentMarkdown: record.contentMarkdown,
      metadata: (record.metadata as Record<string, unknown>) ?? undefined,
      model: record.model,
      processingTimeMs: record.processingTimeMs,
      generatedBy: record.generatedBy,
      createdAt: record.created_at.toISOString(),
      updatedAt: record.updated_at.toISOString(),
    };
  }
}
