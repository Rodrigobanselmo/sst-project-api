import { Injectable } from '@nestjs/common';

import {
  ConsolidatedViewRiskAnalysisItem,
  ConsolidatedViewRiskAnalysisSummary,
} from '../use-cases/company-group-consolidated-view-risk-analysis.types';
import {
  ConsolidatedRiskNarrativeScope,
  normalizeConsolidatedRiskNarrativeScope,
} from '../utils/consolidated-risk-narrative-scope.types';

export type BuildConsolidatedRiskNarrativeInputResult = {
  content: Array<{ type: 'text'; text: string }>;
  summary: {
    totalConsolidatedRecords: number;
    distinctRiskFactors: number;
    distinctSectors: number;
    distinctCompanies: number;
    totalAiAnalyses: number;
    scope: ConsolidatedRiskNarrativeScope;
  };
};

@Injectable()
export class BuildConsolidatedRiskNarrativeInputService {
  build(params: {
    items: ConsolidatedViewRiskAnalysisItem[];
    summary: ConsolidatedViewRiskAnalysisSummary;
    scope: ConsolidatedRiskNarrativeScope;
    businessGroupName: string;
    applicationCount: number;
    companyCount: number;
  }): BuildConsolidatedRiskNarrativeInputResult {
    const scope = normalizeConsolidatedRiskNarrativeScope(params.scope);
    const filteredItems = this.applyFilters(params.items, scope.filters);

    const lines: string[] = [];
    lines.push('DADOS OBJETIVOS DO SIMPLESST — VISÃO CONSOLIDADA VIRTUAL (NÃO RECALCULAR)');
    lines.push(`Grupo empresarial: ${params.businessGroupName}`);
    lines.push(`Aplicações elegíveis consolidadas: ${params.applicationCount}`);
    lines.push(`Empresas no conjunto: ${params.companyCount}`);
    lines.push(`Registros consolidados de leitura (setor × fator): ${filteredItems.length}`);
    lines.push(`Análises de IA já registradas nas aplicações individuais: ${params.summary.totalRiskAnalyses}`);
    lines.push(`Modo de agrupamento solicitado na tela: ${scope.groupingMode}`);
    lines.push('');
    lines.push(
      'IMPORTANTE: estes dados são uma consolidação gerencial read-only de análises já existentes nas aplicações individuais. Não recalcule probabilidade, severidade, NRO, fontes, recomendações, inventário ou PGR.',
    );
    lines.push('');
    lines.push('---');
    lines.push('');

    const byRiskFactor = new Map<string, ConsolidatedViewRiskAnalysisItem[]>();
    filteredItems.forEach((item) => {
      const current = byRiskFactor.get(item.riskFactorId) ?? [];
      current.push(item);
      byRiskFactor.set(item.riskFactorId, current);
    });

    lines.push('## Matriz consolidada risco × setor × origem (valores oficiais já existentes)');
    lines.push('');

    if (filteredItems.length === 0) {
      lines.push('Nenhum registro disponível no recorte informado.');
    } else {
      Array.from(byRiskFactor.entries())
        .sort(([, left], [, right]) =>
          (left[0]?.riskFactor ?? '').localeCompare(
            right[0]?.riskFactor ?? '',
            'pt-BR',
          ),
        )
        .forEach(([riskFactorId, entries]) => {
          const sample = entries[0];
          lines.push(`### ${sample.riskFactor} (${sample.riskType})`);
          lines.push(`Registros no fator: ${entries.length}`);

          entries.slice(0, 40).forEach((item, index) => {
            lines.push(
              `${index + 1}. Empresa: ${item.companyName}`,
              `   Aplicação: ${item.applicationName}`,
              `   Estabelecimento: ${item.establishmentName ?? 'Não informado'}`,
              `   Setor: ${item.sectorName}`,
              `   Probabilidade (oficial): ${item.probabilityLabel}`,
              `   Severidade (oficial): ${item.severityLabel}`,
              `   NRO / risco ocupacional (oficial): ${item.occupationalRisk}`,
              `   Status da análise individual: ${item.status ?? 'Sem análise registrada'}`,
            );

            if (item.aiAnalysis?.frps) {
              lines.push(`   FRPS (análise existente): ${item.aiAnalysis.frps}`);
            }

            if (item.aiAnalysis?.confidence != null) {
              lines.push(
                `   Confiança da análise existente: ${Math.round(item.aiAnalysis.confidence * 100)}%`,
              );
            }

            if (item.aiAnalysis?.fontesGeradoras?.length) {
              lines.push('   Fontes geradoras já registradas:');
              item.aiAnalysis.fontesGeradoras.slice(0, 3).forEach((source) => {
                lines.push(`   - ${source.nome}: ${source.justificativa}`);
              });
            }

            const recommendations = [
              ...(item.aiAnalysis?.medidasEngenhariaRecomendadas ?? []),
              ...(item.aiAnalysis?.medidasAdministrativasRecomendadas ?? []),
            ];

            if (recommendations.length) {
              lines.push('   Recomendações já registradas:');
              recommendations.slice(0, 3).forEach((rec) => {
                lines.push(`   - ${rec.nome}: ${rec.justificativa}`);
              });
            }

            lines.push('');
          });

          if (entries.length > 40) {
            lines.push(
              `... ${entries.length - 40} registros adicionais omitidos neste fator (${riskFactorId}).`,
            );
            lines.push('');
          }
        });
    }

    const distinctRiskFactors = new Set(filteredItems.map((item) => item.riskFactorId));
    const distinctSectors = new Set(
      filteredItems.map((item) => `${item.formApplicationId}:${item.hierarchyId}`),
    );
    const distinctCompanies = new Set(filteredItems.map((item) => item.companyId));
    const totalAiAnalyses = filteredItems.filter((item) => item.riskAnalysisId).length;

    return {
      content: [{ type: 'text', text: lines.join('\n') }],
      summary: {
        totalConsolidatedRecords: filteredItems.length,
        distinctRiskFactors: distinctRiskFactors.size,
        distinctSectors: distinctSectors.size,
        distinctCompanies: distinctCompanies.size,
        totalAiAnalyses,
        scope,
      },
    };
  }

  private applyFilters(
    items: ConsolidatedViewRiskAnalysisItem[],
    filters: ConsolidatedRiskNarrativeScope['filters'],
  ) {
    const normalizedSearch = filters.search?.toLowerCase() ?? '';

    return items.filter((item) => {
      if (filters.companyId && item.companyId !== filters.companyId) {
        return false;
      }
      if (
        filters.formApplicationId &&
        item.formApplicationId !== filters.formApplicationId
      ) {
        return false;
      }
      if (filters.riskLevel && item.occupationalRisk !== filters.riskLevel) {
        return false;
      }
      if (
        filters.status &&
        (item.status || 'Sem análise registrada') !== filters.status
      ) {
        return false;
      }

      if (!normalizedSearch) return true;

      const haystack = [
        item.companyName,
        item.applicationName,
        item.establishmentName,
        item.sectorName,
        item.riskFactor,
        item.riskCategory,
        item.occupationalRisk,
        item.probabilityLabel,
        item.severityLabel,
        item.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }
}
