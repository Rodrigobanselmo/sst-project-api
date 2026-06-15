import { Injectable } from '@nestjs/common';

import { BrowseFormQuestionsAnswersAnalysisUseCase } from '@/@v2/forms/application/form-questions-answers/browse-form-questions-answers-analysis/use-cases/browse-form-questions-answers-analysis.usecase';
import { BrowseFormQuestionsAnswersRisksUseCase } from '@/@v2/forms/application/form-questions-answers/browse-form-questions-answers-risks/use-cases/browse-form-questions-answers-risks.usecase';
import {
  getOccupationalRiskLabel,
  getProbabilityLabel,
  getSeverityLabel,
} from '@/@v2/forms/application/form-questions-answers/risk-narrative-diagnostic/shared/matrix-risk-label.util';
import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';

import {
  ConsolidatedViewRiskAnalysisItem,
  ConsolidatedViewRiskAnalysisSummary,
  ConsolidatedViewRiskAnalysisWarning,
} from '../use-cases/company-group-consolidated-view-risk-analysis.types';
import { ConsolidatedViewEligibleApplication } from './company-group-consolidated-view-eligibility.service';

const READ_ONLY_CAPABILITIES = {
  readOnly: true as const,
  canRecalculateRisk: false as const,
  canGenerateSources: false as const,
  canGenerateRecommendations: false as const,
  canAddToInventory: false as const,
  canAddToPgr: false as const,
  canEdit: false as const,
  canCreateSector: false as const,
  canCreateGeneratingSource: false as const,
};

const mapAiAnalysisPayload = (
  analysisPayload: AiRiskAnalysisResponse | undefined,
  analysis: { confidence?: number | null } | undefined,
) => {
  if (!analysisPayload && analysis?.confidence == null) {
    return null;
  }

  const mapItems = (
    items: AiRiskAnalysisResponse['fontesGeradoras'] | undefined,
  ) =>
    (items ?? []).map((item) => ({
      nome: item.nome,
      justificativa: item.justificativa ?? '',
    }));

  return {
    frps: analysisPayload?.frps?.trim() || null,
    confidence: analysis?.confidence ?? null,
    fontesGeradoras: mapItems(analysisPayload?.fontesGeradoras),
    medidasEngenhariaRecomendadas: mapItems(
      analysisPayload?.medidasEngenhariaRecomendadas,
    ),
    medidasAdministrativasRecomendadas: mapItems(
      analysisPayload?.medidasAdministrativasRecomendadas,
    ),
  };
};

@Injectable()
export class CompanyGroupConsolidatedViewRiskAnalysisService {
  constructor(
    private readonly browseFormQuestionsAnswersRisksUseCase: BrowseFormQuestionsAnswersRisksUseCase,
    private readonly browseFormQuestionsAnswersAnalysisUseCase: BrowseFormQuestionsAnswersAnalysisUseCase,
  ) {}

  async list(params: {
    applications: ConsolidatedViewEligibleApplication[];
  }): Promise<{
    items: ConsolidatedViewRiskAnalysisItem[];
    summary: ConsolidatedViewRiskAnalysisSummary;
    warnings: ConsolidatedViewRiskAnalysisWarning[];
  }> {
    const items: ConsolidatedViewRiskAnalysisItem[] = [];
    const warnings: ConsolidatedViewRiskAnalysisWarning[] = [];
    const uniqueCompanies = new Set<string>();
    const uniqueRiskFactors = new Set<string>();
    const uniqueSectors = new Set<string>();
    let totalRiskAnalyses = 0;

    for (const application of params.applications) {
      uniqueCompanies.add(application.companyId);

      try {
        const [risks, analyses] = await Promise.all([
          this.browseFormQuestionsAnswersRisksUseCase.execute({
            companyId: application.companyId,
            formApplicationId: application.applicationId,
          }),
          this.browseFormQuestionsAnswersAnalysisUseCase.execute({
            companyId: application.companyId,
            formApplicationId: application.applicationId,
          }),
        ]);

        const analysisByKey = new Map(
          analyses.results.map((analysis) => [
            `${analysis.hierarchyId}::${analysis.riskId}`,
            analysis,
          ]),
        );

        for (const [entityId, riskEntries] of Object.entries(
          risks.entityRiskMap,
        )) {
          const entity = risks.entityMap[entityId];
          if (!entity) continue;

          for (const [riskId, riskData] of Object.entries(riskEntries)) {
            const risk = risks.riskMap[riskId];
            if (!risk) continue;

            uniqueRiskFactors.add(riskId);
            uniqueSectors.add(`${application.applicationId}:${entityId}`);

            const analysis = analysisByKey.get(`${entityId}::${riskId}`);
            const analysisPayload = analysis?.analysis as
              | AiRiskAnalysisResponse
              | undefined;
            const probability =
              analysis?.probability ?? riskData.probability ?? null;
            const severity = risk.severity ?? null;
            const riskLevel =
              severity != null && probability != null
                ? getMatrizRisk(severity, probability)
                : null;

            const inventoryKey = `${entityId}::${riskId}`;
            const inInventory = Boolean(
              risks.inventoryStatusByKey[inventoryKey],
            );

            if (analysis?.id) {
              totalRiskAnalyses += 1;
            }

            items.push({
              id: `${application.applicationId}:${entityId}:${riskId}`,
              riskAnalysisId: analysis?.id ?? null,
              formApplicationId: application.applicationId,
              applicationName: application.applicationName,
              companyId: application.companyId,
              companyName: application.companyLabel,
              establishmentId: null,
              establishmentName:
                risks.entityEstablishmentMap[entityId] ?? null,
              sectorId: entity.type === 'SECTOR' ? entity.id : entityId,
              sectorName: entity.name,
              hierarchyId: entity.id,
              hierarchyName: entity.name,
              hierarchyType: entity.type,
              riskFactorId: risk.id,
              riskFactor: risk.name,
              riskCategory: analysisPayload?.frps?.trim() || null,
              riskType: risk.type,
              probability,
              probabilityLabel: getProbabilityLabel(probability ?? undefined),
              severity,
              severityLabel: getSeverityLabel(severity ?? undefined),
              riskLevel,
              occupationalRisk:
                severity != null && probability != null
                  ? getOccupationalRiskLabel(severity, probability)
                  : 'Não informado',
              generatingSources: (analysisPayload?.fontesGeradoras ?? []).map(
                (source) => source.nome,
              ),
              recommendations: [
                ...(analysisPayload?.medidasEngenhariaRecomendadas ?? []).map(
                  (item) => item.nome,
                ),
                ...(analysisPayload?.medidasAdministrativasRecomendadas ??
                  []).map((item) => item.nome),
              ],
              aiAnalysis: mapAiAnalysisPayload(analysisPayload, analysis),
              status: analysis?.status ?? null,
              inInventory,
              createdAt: analysis?.createdAt
                ? new Date(analysis.createdAt).toISOString()
                : null,
              updatedAt: analysis?.updatedAt
                ? new Date(analysis.updatedAt).toISOString()
                : null,
              origin: {
                formApplicationId: application.applicationId,
                companyId: application.companyId,
                riskAnalysisId: analysis?.id ?? null,
              },
            });
          }
        }
      } catch (error) {
        warnings.push({
          formApplicationId: application.applicationId,
          applicationName: application.applicationName,
          companyId: application.companyId,
          companyName: application.companyLabel,
          message:
            error instanceof Error
              ? error.message
              : 'Falha ao carregar análise de riscos da aplicação',
        });
      }
    }

    items.sort((left, right) => {
      const companyCompare = left.companyName.localeCompare(
        right.companyName,
        'pt-BR',
      );
      if (companyCompare !== 0) return companyCompare;

      const appCompare = left.applicationName.localeCompare(
        right.applicationName,
        'pt-BR',
      );
      if (appCompare !== 0) return appCompare;

      const sectorCompare = left.sectorName.localeCompare(
        right.sectorName,
        'pt-BR',
      );
      if (sectorCompare !== 0) return sectorCompare;

      return left.riskFactor.localeCompare(right.riskFactor, 'pt-BR');
    });

    return {
      items,
      warnings,
      summary: {
        totalApplications: params.applications.length,
        totalCompanies: uniqueCompanies.size,
        totalRiskAnalyses,
        totalRiskFactors: uniqueRiskFactors.size,
        totalSectors: uniqueSectors.size,
        totalConsolidatedRecords: items.length,
        hasData: items.length > 0,
      },
    };
  }

  getCapabilities() {
    return READ_ONLY_CAPABILITIES;
  }
}
