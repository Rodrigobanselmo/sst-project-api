import { Injectable } from '@nestjs/common';
import { FormIndicatorsNarrativeDiagnosticRepository } from '@/@v2/forms/database/repositories/form-indicators-narrative-diagnostic/form-indicators-narrative-diagnostic.repository';
import {
  buildIndicatorsNarrativeScopeKey,
  IndicatorsNarrativeDiagnosticScope,
  normalizeIndicatorsNarrativeDiagnosticScope,
} from '../../shared/indicators-narrative-diagnostic-scope.types';
import { IReadIndicatorsNarrativeDiagnosticUseCase } from './read-indicators-narrative-diagnostic.types';

@Injectable()
export class ReadIndicatorsNarrativeDiagnosticUseCase {
  constructor(private readonly repository: FormIndicatorsNarrativeDiagnosticRepository) {}

  async execute(
    params: IReadIndicatorsNarrativeDiagnosticUseCase.Params,
  ): Promise<IReadIndicatorsNarrativeDiagnosticUseCase.Result> {
    const scope = normalizeIndicatorsNarrativeDiagnosticScope(
      params.scope as Parameters<typeof normalizeIndicatorsNarrativeDiagnosticScope>[0],
    );
    const scopeKey =
      params.scopeKey?.trim() || buildIndicatorsNarrativeScopeKey(scope);
    const record = await this.repository.findByApplicationAndScope(
      params.formApplicationId,
      scopeKey,
    );

    if (!record || record.scopeKey !== scopeKey) return null;

    return {
      id: record.id,
      formApplicationId: record.formApplicationId,
      scopeKey: record.scopeKey,
      scope: record.scope as IndicatorsNarrativeDiagnosticScope,
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
