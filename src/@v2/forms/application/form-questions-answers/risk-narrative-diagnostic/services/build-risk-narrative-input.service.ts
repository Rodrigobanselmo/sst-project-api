import { Injectable } from '@nestjs/common';
import { FormAiAnalysisStatusEnum } from '@prisma/client';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { FormQuestionsAnswersRisksService } from '../../shared/services/form-questions-answers-risks.service';
import { IFormQuestionsAnswersRisksService } from '../../shared/services/form-questions-answers-risks.types';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';
import {
  getOccupationalRiskLabel,
  getProbabilityLabel,
  getSeverityLabel,
} from '../shared/matrix-risk-label.util';
import { RiskNarrativeDiagnosticScope } from '../shared/risk-narrative-diagnostic-scope.types';
import { resolveEffectiveRiskProbability } from '../../shared/utils/resolve-effective-risk-probability.util';

export type RiskNarrativeInputBuildResult = {
  content: Array<{ type: 'text'; text: string }>;
  summary: {
    totalRiskSectorPairs: number;
    distinctRisks: number;
    distinctSectors: number;
    scope: RiskNarrativeDiagnosticScope;
  };
};

@Injectable()
export class BuildRiskNarrativeInputService {
  constructor(
    private readonly formQuestionsAnswersRisksService: FormQuestionsAnswersRisksService,
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
  ) {}

  async build(params: {
    companyId: string;
    formApplicationId: string;
    scope: RiskNarrativeDiagnosticScope;
    formApplicationName?: string;
    formModelName?: string;
  }): Promise<RiskNarrativeInputBuildResult> {
    const formData = await this.formQuestionsAnswersRisksService.getFormQuestionsAnswersRisks({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
    });

    const allowedHierarchyIds = this.resolveAllowedHierarchyIds(formData, params.scope);

    const scope = await this.formApplicationScopeService.resolve({
      formApplicationId: params.formApplicationId,
      accessCompanyId: params.companyId,
    });
    const companyIds = this.formApplicationScopeService.participantCompanyIdsForScope(scope);

    const existingAiAnalyses = await this.prisma.formAiAnalysis.findMany({
      where: {
        companyId: { in: companyIds },
        formApplicationId: params.formApplicationId,
        status: FormAiAnalysisStatusEnum.DONE,
        ...(allowedHierarchyIds
          ? { hierarchyId: { in: allowedHierarchyIds } }
          : {}),
      },
      select: {
        hierarchyId: true,
        riskId: true,
        probability: true,
        confidence: true,
        analysis: true,
        hierarchy: { select: { name: true } },
        riskFactor: { select: { name: true } },
      },
    });

    const lines: string[] = [];

    lines.push('DADOS OBJETIVOS DO SIMPLESST (NÃO RECALCULAR)');
    lines.push(`Formulário / aplicação: ${params.formApplicationName ?? params.formApplicationId}`);
    if (params.formModelName) {
      lines.push(`Modelo: ${params.formModelName}`);
    }

    if (params.scope.groupingQuestionId) {
      lines.push(`Recorte por agrupamento: ${params.scope.groupingLabel ?? params.scope.groupingQuestionId}`);
      if (params.scope.participantGroupIds.length > 0) {
        lines.push(`Grupos de participantes no recorte: ${params.scope.participantGroupIds.join(', ')}`);
      }
    } else {
      lines.push('Recorte: todos os participantes (sem agrupamento por identificação)');
    }

    lines.push('');
    lines.push('---');
    lines.push('');

    const riskSectorRows: Array<{
      hierarchyId: string;
      hierarchyName: string;
      establishment: string;
      riskId: string;
      riskName: string;
      severity: number;
      probability: number;
      nroLabel: string;
      questionsCount: number;
      probabilityNote?: string;
    }> = [];

    Object.entries(formData.hierarchyRiskMap).forEach(([hierarchyId, risks]) => {
      if (allowedHierarchyIds && !allowedHierarchyIds.includes(hierarchyId)) return;

      const hierarchy = formData.hierarchyMap[hierarchyId];
      if (!hierarchy) return;

      const establishment =
        formData.entityEstablishmentMap[hierarchyId]?.trim() || 'Estabelecimento não informado';

      Object.entries(risks).forEach(([riskId, riskSummary]) => {
        const risk = formData.riskMap[riskId];
        if (!risk) return;

        const effective = resolveEffectiveRiskProbability({
          hierarchyId,
          riskId,
          entityRiskMap: formData.entityRiskMap,
          groupedEntityRiskMap: formData.groupedEntityRiskMap,
          hierarchyGroups: formData.hierarchyGroups,
          individualProbabilityFallback: riskSummary.probability,
        });
        const probability = effective.probability;
        const nroLabel = getOccupationalRiskLabel(risk.severity, probability);
        const probabilityNote =
          effective.source === 'hierarchy_group' && effective.groupName
            ? `probabilidade calculada pelo agrupamento ${effective.groupName}`
            : undefined;

        riskSectorRows.push({
          hierarchyId,
          hierarchyName: hierarchy.name,
          establishment,
          riskId,
          riskName: risk.name,
          severity: risk.severity,
          probability,
          nroLabel,
          questionsCount: riskSummary.questions.length,
          probabilityNote,
        });
      });
    });

    riskSectorRows.sort((a, b) => {
      const nroOrder = (label: string) => {
        const order: Record<string, number> = {
          'Muito alto': 5,
          Alto: 4,
          Moderado: 3,
          Baixo: 2,
          'Muito baixo': 1,
          Interromper: 6,
        };
        return order[label] ?? 0;
      };
      return nroOrder(b.nroLabel) - nroOrder(a.nroLabel);
    });

    lines.push('## Matriz objetiva risco × setor (valores oficiais do sistema)');
    lines.push('');

    if (riskSectorRows.length === 0) {
      lines.push('Nenhum par setor×FRPS disponível no recorte informado.');
    } else {
      riskSectorRows.forEach((row, index) => {
        lines.push(
          `${index + 1}. FRPS: ${row.riskName}`,
          `   Setor: ${row.hierarchyName}`,
          `   Estabelecimento: ${row.establishment}`,
          `   Probabilidade (oficial): ${getProbabilityLabel(row.probability)} (${row.probability})${row.probabilityNote ? ` — ${row.probabilityNote}` : ''}`,
          `   Severidade (cadastro FRPS): ${getSeverityLabel(row.severity)} (${row.severity})`,
          `   Risco ocupacional / NRO (oficial): ${row.nroLabel}`,
          `   Perguntas vinculadas no recorte: ${row.questionsCount}`,
          '',
        );
      });
    }

    lines.push('---');
    lines.push('');
    lines.push('## Fontes geradoras e recomendações já geradas pela IA (fluxo anterior, quando existentes)');
    lines.push('');

    if (existingAiAnalyses.length === 0) {
      lines.push('Nenhuma análise de fontes/recomendações concluída para este recorte.');
    } else {
      existingAiAnalyses.forEach((item, index) => {
        const analysis = item.analysis as AiRiskAnalysisResponse | null;
        lines.push(
          `${index + 1}. ${item.riskFactor.name} × ${item.hierarchy.name}`,
          `   Probabilidade registrada: ${item.probability ?? 'N/A'}`,
          `   Confiança da análise anterior: ${item.confidence != null ? `${Math.round(item.confidence * 100)}%` : 'N/A'}`,
        );

        if (analysis?.fontesGeradoras?.length) {
          lines.push('   Fontes geradoras sugeridas:');
          analysis.fontesGeradoras.slice(0, 4).forEach((fg) => {
            lines.push(`   - ${fg.nome}: ${fg.justificativa}`);
          });
        }

        const medidas = [
          ...(analysis?.medidasEngenhariaRecomendadas ?? []),
          ...(analysis?.medidasAdministrativasRecomendadas ?? []),
        ];
        if (medidas.length) {
          lines.push('   Recomendações sugeridas:');
          medidas.slice(0, 4).forEach((m) => {
            lines.push(`   - ${m.nome}: ${m.justificativa}`);
          });
        }

        lines.push('');
      });
    }

    const distinctRisks = new Set(riskSectorRows.map((r) => r.riskId));
    const distinctSectors = new Set(riskSectorRows.map((r) => r.hierarchyId));

    return {
      content: [{ type: 'text', text: lines.join('\n') }],
      summary: {
        totalRiskSectorPairs: riskSectorRows.length,
        distinctRisks: distinctRisks.size,
        distinctSectors: distinctSectors.size,
        scope: params.scope,
      },
    };
  }

  private resolveAllowedHierarchyIds(
    formData: IFormQuestionsAnswersRisksService.Result,
    scope: RiskNarrativeDiagnosticScope,
  ): string[] | null {
    if (scope.allowedHierarchyIds?.length) {
      const validIds = new Set(Object.keys(formData.hierarchyMap));
      return scope.allowedHierarchyIds.filter((id) => validIds.has(id));
    }

    return null;
  }
}
