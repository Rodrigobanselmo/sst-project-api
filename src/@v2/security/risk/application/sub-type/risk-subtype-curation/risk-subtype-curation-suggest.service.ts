import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';

import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { arrayChunks } from '@/@v2/shared/utils/helpers/array-chunks';

import { SuggestRiskSubtypeCandidatesBody } from './risk-subtype-curation.dto';
import { RiskSubtypeCurationRepository } from './risk-subtype-curation.repository';
import {
  RISK_SUBTYPE_CURATION_SUGGEST_ABSOLUTE_MAX,
  RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_RESPONSE_SCHEMA,
  RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_SIZE,
  RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_TIMEOUT_MS,
  RISK_SUBTYPE_CURATION_SUGGEST_DEFAULT_MAX,
} from './constants/risk-subtype-curation-suggest.constants';
import {
  normalizeSuggestCandidate,
} from './risk-subtype-curation-suggest.normalization';
import { ChemicalIdentityEnrichmentService } from './chemical-identity-enrichment/chemical-identity-enrichment.service';
import { ENRICHMENT_PARTIAL_WARNING } from './chemical-identity-enrichment/chemical-identity-enrichment.constants';
import type {
  RiskSubtypeCurationSuggestCandidate,
  RiskSubtypeCurationSuggestChunkAiItem,
  RiskSubtypeCurationSuggestEligibleRisk,
  RiskSubtypeCurationSuggestResponse,
} from './risk-subtype-curation-suggest.types';
import { RiskSubtypeCurationAiPromptService } from './risk-subtype-curation-ai-prompt.service';
import type { PreviewRiskSubtypeCurationAiPromptBody } from './risk-subtype-curation-ai-instruction.dto';
import { RiskSubtypeSuggestObservability } from './risk-subtype-curation-suggest-observability.util';

@Injectable()
export class RiskSubtypeCurationSuggestService {
  private readonly logger = new Logger(RiskSubtypeCurationSuggestService.name);

  constructor(
    private readonly repository: RiskSubtypeCurationRepository,
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    private readonly chemicalIdentityEnrichmentService: ChemicalIdentityEnrichmentService,
    private readonly aiPromptService: RiskSubtypeCurationAiPromptService,
  ) {}

  async suggestCandidates(
    body: SuggestRiskSubtypeCandidatesBody,
  ): Promise<RiskSubtypeCurationSuggestResponse> {
    const observability = new RiskSubtypeSuggestObservability(this.logger);

    try {
      if (body.type !== RiskFactorsEnum.QUI) {
        throw new BadRequestException(
          'Nesta fase apenas fatores químicos (QUI) são suportados.',
        );
      }

      if (!process.env.OPENAI_API_KEY?.trim()) {
        throw new ServiceUnavailableException(
          'Serviço de IA não configurado neste ambiente.',
        );
      }

      const subType = await this.repository.findSubTypeById(body.subTypeId);
      if (!subType) {
        throw new NotFoundException('Subtipo de risco não encontrado.');
      }

      if (subType.status !== StatusEnum.ACTIVE) {
        throw new BadRequestException(
          'Subtipo inativo não pode ser usado para sugestão de candidatos.',
        );
      }

      if (subType.type !== RiskFactorsEnum.QUI) {
        throw new BadRequestException(
          'Subtipo deve ser do tipo químico (QUI) nesta fase.',
        );
      }

      if (!subType.name?.trim()) {
        throw new BadRequestException('Subtipo sem nome não pode ser analisado.');
      }

      const warnings: string[] = [];
      if (!subType.description?.trim()) {
        warnings.push(
          'Subtipo sem descrição — a IA terá menos contexto para classificar candidatos.',
        );
      }

      const page = Math.max(1, body.page ?? 1);
      const limit = Math.min(
        body.limit ?? body.maxCandidates ?? RISK_SUBTYPE_CURATION_SUGGEST_DEFAULT_MAX,
        RISK_SUBTYPE_CURATION_SUGGEST_ABSOLUTE_MAX,
      );
      const onlyPcmso = body.onlyPcmso !== false;
      const search = body.search?.trim() || null;
      const sessionModel = this.aiPromptService.resolveModel({
        sessionModel: body.model,
      });

      observability.log('risk_subtype_suggest_start', {
        subTypeId: subType.id,
        subTypeName: subType.name,
        page,
        limit,
        search,
        onlyPcmso,
        model: sessionModel,
      });

      observability.setStage('db');
      const dbStartedAt = Date.now();
      const { rows, total } = await this.repository.findEligibleRisksForSuggestion(
        {
          type: body.type,
          onlyPcmso,
          search: body.search?.trim() || undefined,
          page,
          limit,
        },
      );
      observability.log('risk_subtype_suggest_db_done', {
        durationMs: Date.now() - dbStartedAt,
        eligibleTotal: total,
        rowsInBatch: rows.length,
      });

      const skip = (page - 1) * limit;
      const rangeStart = total > 0 && rows.length > 0 ? skip + 1 : 0;
      const rangeEnd = skip + rows.length;
      const hasNextPage = page * limit < total;
      const nextPage = hasNextPage ? page + 1 : null;
      const truncated = hasNextPage;

      const buildScope = (analyzed: number) => ({
        analyzed,
        eligibleTotal: total,
        truncated,
        onlyPcmso,
        search,
        page,
        limit,
        hasNextPage,
        nextPage,
        rangeStart: analyzed > 0 ? rangeStart : 0,
        rangeEnd: analyzed > 0 ? rangeEnd : 0,
        maxCandidates: limit,
      });

      if (!rows.length) {
        const emptyMessage =
          page > 1 && total > 0
            ? `Nenhum risco elegível no lote ${page} (${skip + 1}–${Math.min(skip + limit, total)} de ${total}).`
            : 'Nenhum risco químico elegível sem subtipo foi encontrado para análise.';

        const emptyWarnings = [...warnings, emptyMessage];
        observability.setStage('response');
        observability.log('risk_subtype_suggest_done', {
          totalDurationMs: observability.elapsedMs(),
          warningsCount: emptyWarnings.length,
          candidatesCount: 0,
          analyzed: 0,
          eligibleTotal: total,
          hasNextPage,
        });

        return {
          targetSubType: {
            id: subType.id,
            name: subType.name,
            description: subType.description,
            type: subType.type,
            status: subType.status,
          },
          scope: buildScope(0),
          summary: {
            suggestedInclude: 0,
            suggestedExclude: 0,
            lowConfidence: 0,
            includedWithConfidence: 0,
            excludedWithConfidence: 0,
          },
          candidates: [],
          warnings: emptyWarnings,
          model: sessionModel,
          generatedAt: new Date().toISOString(),
        };
      }

      if (truncated) {
        warnings.push(
          `Lote ${page}: analisados ${rangeStart}–${rangeEnd} de ${total} riscos elegíveis. Use o próximo lote para continuar.`,
        );
      }

      observability.setStage('enrichment');
      const enrichmentStartedAt = Date.now();
      const enrichmentByRiskId =
        await this.chemicalIdentityEnrichmentService.enrichBatch(
          rows.map((risk) => ({
            riskFactorId: risk.id,
            name: risk.name,
            cas: risk.cas,
            synonyms: risk.synonymous,
          })),
        );

      const enrichedCount = rows.filter((risk) =>
        enrichmentByRiskId
          .get(risk.id)
          ?.sourceResults.some((result) => result.source === 'PUBCHEM' && result.found),
      ).length;
      const failedEnrichmentCount = rows.length - enrichedCount;
      observability.log('risk_subtype_suggest_enrichment_done', {
        durationMs: Date.now() - enrichmentStartedAt,
        attempted: rows.length,
        enriched: enrichedCount,
        failed: failedEnrichmentCount,
        unavailable: failedEnrichmentCount,
      });
      if (failedEnrichmentCount > 0) {
        warnings.push(ENRICHMENT_PARTIAL_WARNING);
      }

      observability.setStage('prompt');
      const promptStartedAt = Date.now();
      const promptBuild = await this.aiPromptService.buildPrompt({
        subType,
        sessionCustomPrompt: body.customPrompt,
      });
      const systemPrompt = promptBuild.assembledPrompt;
      const selectedModel = this.aiPromptService.resolveModel({
        sessionModel: body.model,
        preferredModel: promptBuild.preferredModel,
      });
      observability.log('risk_subtype_suggest_prompt_built', {
        durationMs: Date.now() - promptStartedAt,
        systemPromptChars: systemPrompt.length,
        useSystemDefault: promptBuild.useSystemDefault,
        revision: promptBuild.revision ?? 0,
      });

      if (!systemPrompt.trim()) {
        throw new BadRequestException(
          'Prompt de sugestão de subtipo não configurado.',
        );
      }

      const chunks = arrayChunks(rows, RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_SIZE);
      const aiByRiskId = new Map<string, RiskSubtypeCurationSuggestChunkAiItem>();

      observability.setStage('openai');
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];
        const chunkStartedAt = Date.now();
        try {
          const chunkItems = await this.analyzeChunk({
            subType,
            risks: chunk,
            systemPrompt,
            enrichmentByRiskId,
            model: selectedModel,
          });
          observability.log('risk_subtype_suggest_openai_chunk_done', {
            chunkIndex,
            chunkSize: chunk.length,
            durationMs: Date.now() - chunkStartedAt,
            itemsReturned: chunkItems.length,
          });
          for (const item of chunkItems) {
            if (!chunk.some((risk) => risk.id === item.riskFactorId)) {
              continue;
            }
            aiByRiskId.set(item.riskFactorId, item);
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Erro ao analisar lote com IA.';
          this.logger.warn(
            `Falha parcial na sugestão de candidatos (requestId=${observability.requestId}, chunkIndex=${chunkIndex}): ${message}`,
          );
          observability.log('risk_subtype_suggest_openai_chunk_done', {
            chunkIndex,
            chunkSize: chunk.length,
            durationMs: Date.now() - chunkStartedAt,
            itemsReturned: 0,
            error: message,
            warning: message,
          });
          warnings.push(
            `Falha ao analisar um lote de ${chunk.length} risco(s) com IA. Os riscos desse lote retornarão como baixa confiança.`,
          );
        }
      }

      observability.setStage('normalize');
      const normalizeStartedAt = Date.now();
      const candidates = rows.map((risk) => {
        const enrichment = enrichmentByRiskId.get(risk.id);
        const candidate = normalizeSuggestCandidate({
          subTypeName: subType.name,
          subTypeDescription: subType.description,
          risk,
          ai: aiByRiskId.get(risk.id),
          enrichment,
        });
        return {
          ...candidate,
          chemicalIdentity:
            this.chemicalIdentityEnrichmentService.toCandidateChemicalIdentity(
              enrichment,
            ),
        };
      });
      observability.log('risk_subtype_suggest_normalize_done', {
        durationMs: Date.now() - normalizeStartedAt,
      });

      observability.setStage('response');
      observability.log('risk_subtype_suggest_done', {
        totalDurationMs: observability.elapsedMs(),
        warningsCount: warnings.length,
        candidatesCount: candidates.length,
        analyzed: rows.length,
        eligibleTotal: total,
        hasNextPage,
      });

      return {
        targetSubType: {
          id: subType.id,
          name: subType.name,
          description: subType.description,
          type: subType.type,
          status: subType.status,
        },
        scope: buildScope(rows.length),
        summary: this.buildSummary(candidates),
        candidates,
        warnings,
        enrichment: {
          attempted: rows.length,
          enriched: enrichedCount,
          failed: failedEnrichmentCount,
          sources: ['PUBCHEM'],
        },
        model: selectedModel,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      observability.logError(error);
      throw error;
    }
  }

  async previewAiPrompt(body: PreviewRiskSubtypeCurationAiPromptBody) {
    const subType = await this.repository.findSubTypeById(body.subTypeId);
    if (!subType) {
      throw new NotFoundException('Subtipo de risco não encontrado.');
    }

    const promptBuild = await this.aiPromptService.buildPrompt({
      subType,
      draft: {
        useSystemDefault: body.useSystemDefault,
        instructions: body.instructions,
        positiveExamples: body.positiveExamples,
        negativeExamples: body.negativeExamples,
        cautionRules: body.cautionRules,
        preferredModel: body.preferredModel,
      },
      sessionCustomPrompt: body.customPrompt,
    });

    return {
      assembledPrompt: promptBuild.assembledPrompt,
      sections: promptBuild.sections,
      selectedModel: this.aiPromptService.resolveModel({
        sessionModel: body.model,
        preferredModel: body.preferredModel ?? promptBuild.preferredModel,
      }),
      sources: promptBuild.sources,
      useSystemDefault: promptBuild.useSystemDefault,
      revision: promptBuild.revision,
    };
  }

  private async analyzeChunk(params: {
    subType: {
      id: number;
      name: string;
      description: string | null;
      type: string;
    };
    risks: RiskSubtypeCurationSuggestEligibleRisk[];
    systemPrompt: string;
    enrichmentByRiskId: Map<
      string,
      import('./chemical-identity-enrichment/chemical-identity-enrichment.types').ChemicalIdentityEnrichmentResult
    >;
    model: string;
  }): Promise<RiskSubtypeCurationSuggestChunkAiItem[]> {
    const userPrompt = this.buildChunkUserPrompt(
      params.subType,
      params.risks,
      params.enrichmentByRiskId,
    );

    const result = await this.withTimeout(
      this.aiAdapter.analyze({
        content: [{ type: 'text', text: userPrompt }],
        prompt:
          'Classifique cada risco do lote pelo critério estrutural/químico do subtipo alvo (não por toxicidade ou órgão-alvo). Retorne apenas o array items com riskFactorId, suggestedInclude, confidence, rationale e warnings.',
        language: 'pt-BR',
        systemPrompt: params.systemPrompt,
        model: params.model,
        responseFormat: {
          type: 'json_schema',
          json_schema: {
            name: 'risk_subtype_curation_suggest_chunk',
            strict: true,
            schema: RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_RESPONSE_SCHEMA,
          },
        },
      }),
      RISK_SUBTYPE_CURATION_SUGGEST_CHUNK_TIMEOUT_MS,
    );

    return this.parseChunkResponse(result.analysis, params.risks);
  }

  private buildChunkUserPrompt(
    subType: {
      id: number;
      name: string;
      description: string | null;
      type: string;
    },
    risks: RiskSubtypeCurationSuggestEligibleRisk[],
    enrichmentByRiskId: Map<
      string,
      import('./chemical-identity-enrichment/chemical-identity-enrichment.types').ChemicalIdentityEnrichmentResult
    >,
  ): string {
    const payload = {
      targetSubType: {
        id: subType.id,
        name: subType.name,
        description: subType.description ?? '',
        type: subType.type,
      },
      risks: risks.map((risk) => ({
        riskFactorId: risk.id,
        name: risk.name,
        cas: risk.cas,
        synonyms: risk.synonymous,
        esocialCode: risk.esocialCode,
        risk: risk.risk,
        symptoms: risk.symptoms,
        comments: risk.coments,
        method: risk.method,
        limits: {
          nr15lt: risk.nr15lt,
          twa: risk.twa,
          stel: risk.stel,
          ipvs: risk.ipvs,
        },
        currentSubTypes: risk.subTypes,
        chemicalIdentity: this.chemicalIdentityEnrichmentService.toAiChemicalIdentitySummary(
          enrichmentByRiskId.get(risk.id),
        ),
      })),
    };

    return JSON.stringify(payload, null, 2);
  }

  private parseChunkResponse(
    analysis: string,
    chunkRisks: RiskSubtypeCurationSuggestEligibleRisk[],
  ): RiskSubtypeCurationSuggestChunkAiItem[] {
    let parsed: { items?: unknown[] };
    try {
      parsed = JSON.parse(analysis);
    } catch {
      throw new BadRequestException('Resposta inválida do serviço de IA.');
    }

    const allowedIds = new Set(chunkRisks.map((risk) => risk.id));
    const items: RiskSubtypeCurationSuggestChunkAiItem[] = [];

    if (Array.isArray(parsed.items)) {
      for (const raw of parsed.items) {
        if (!raw || typeof raw !== 'object') continue;
        const item = raw as Record<string, unknown>;
        const riskFactorId = item.riskFactorId;
        if (typeof riskFactorId !== 'string' || !allowedIds.has(riskFactorId)) {
          continue;
        }

        const confidence = item.confidence;
        const suggestedInclude = item.suggestedInclude;
        const rationale = item.rationale;

        if (
          typeof suggestedInclude !== 'boolean' ||
          (confidence !== 'low' &&
            confidence !== 'medium' &&
            confidence !== 'high') ||
          typeof rationale !== 'string'
        ) {
          continue;
        }

        items.push({
          riskFactorId,
          suggestedInclude,
          confidence,
          rationale: rationale.trim(),
          warnings: Array.isArray(item.warnings)
            ? item.warnings.filter((w): w is string => typeof w === 'string')
            : [],
        });
      }
    }

    return items;
  }

  private buildSummary(candidates: RiskSubtypeCurationSuggestCandidate[]) {
    const hasConfidence = (confidence: 'high' | 'medium' | 'low') =>
      confidence === 'high' || confidence === 'medium';

    return {
      suggestedInclude: candidates.filter((c) => c.suggestedInclude).length,
      suggestedExclude: candidates.filter((c) => !c.suggestedInclude).length,
      lowConfidence: candidates.filter((c) => c.confidence === 'low').length,
      includedWithConfidence: candidates.filter(
        (c) => c.suggestedInclude && hasConfidence(c.confidence),
      ).length,
      excludedWithConfidence: candidates.filter(
        (c) => !c.suggestedInclude && hasConfidence(c.confidence),
      ).length,
    };
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('AI_TIMEOUT')), timeoutMs);
      promise
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
}
