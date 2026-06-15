import { Injectable } from '@nestjs/common';

import { HoMethodImportParseResult } from './ho-method-import.types';
import { IHoMethodImportAiReviewUseCase } from './ho-method-import-ai-review.types';

@Injectable()
export class HoMethodImportAiReviewPromptService {
  buildUserPrompt(params: IHoMethodImportAiReviewUseCase.Params): string {
    const { parserResult, extractedText, originalFileName } = params;
    const fields = parserResult.fields;

    const parserAgentsSummary = parserResult.agents.map((agent, index) => ({
      index: index + 1,
      substanceName: agent.substanceName,
      cas: agent.cas,
      synonyms: agent.synonyms,
      technicalNotes: agent.technicalNotes ?? [],
      occupationalLimits: agent.occupationalLimits,
      matchedRiskFactor: agent.matchedRiskFactor
        ? { id: agent.matchedRiskFactor.id, name: agent.matchedRiskFactor.name }
        : null,
    }));

    const methodContext = {
      institution: fields.institution.value,
      methodCode: fields.methodCode.value,
      methodVersion: fields.methodVersion.value,
      issueDate: fields.issueDate.value,
      displayName: fields.displayName.value,
      analyticalMethod: fields.analyticalMethod.value,
      evaluation: fields.evaluation.value,
      sampler: fields.sampler.value,
      extractionSolvent: fields.extractionSolvent.value,
      flowRate: {
        min: fields.minimumFlowRate.value,
        max: fields.maximumFlowRate.value,
        unit: fields.flowRateUnit.value,
      },
      volume: {
        min: fields.minimumVolume.value,
        max: fields.maximumVolume.value,
        unit: fields.volumeUnit.value,
      },
      stabilityDays: fields.stabilityDays.value,
      storageTemperature: fields.storageTemperature.value,
      technique: fields.technique.value,
      analyte: fields.analyte.value,
      detector: fields.detector.value,
      lod: fields.lod.value,
      range: fields.range.value,
      applicability: fields.applicability.value,
      interferences: fields.interferences.value,
      observations: fields.observations.value,
    };

    const catalogContext = {
      registeredSamplers: (params.registeredSamplers ?? []).slice(0, 80).map((item) => ({
        id: item.id,
        name: item.name,
        synonyms: item.synonyms ?? [],
      })),
      registeredExtractionSolvents: (params.registeredExtractionSolvents ?? [])
        .slice(0, 80)
        .map((item) => ({
          id: item.id,
          name: item.name,
          synonyms: item.synonyms ?? [],
        })),
    };

    const truncatedText =
      extractedText.length > 120_000
        ? `${extractedText.slice(0, 120_000)}\n\n[... texto truncado para análise ...]`
        : extractedText;

    return [
      `Arquivo: ${originalFileName ?? 'método.pdf'}`,
      `Formato detectado pelo parser: ${parserResult.detectedFormat}`,
      `Avisos do parser: ${parserResult.warnings.length ? parserResult.warnings.join(' | ') : 'nenhum'}`,
      '',
      '=== Resultado atual do parser determinístico (referência, pode estar incompleto) ===',
      JSON.stringify(
        {
          methodContext,
          agentCount: parserResult.agents.length,
          agents: parserAgentsSummary,
        },
        null,
        2,
      ),
      '',
      '=== Cadastros disponíveis (apenas referência, não vincular automaticamente) ===',
      JSON.stringify(catalogContext, null, 2),
      '',
      '=== Texto extraído do PDF ===',
      truncatedText,
    ].join('\n');
  }
}
