import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import { SystemAiPromptKeyEnum } from '@/@v2/forms/application/system-ai-prompt/constants/system-ai-prompt-key.enum';
import { SystemAiPromptResolverService } from '@/@v2/forms/application/system-ai-prompt/services/system-ai-prompt-resolver.service';
import { getSystemAiPromptDefaultContent } from '@/@v2/forms/application/system-ai-prompt/shared/system-ai-prompt-defaults';
import { isSystemAiPromptEnumUnavailableError } from '@/@v2/forms/application/system-ai-prompt/shared/system-ai-prompt-prisma-error.util';
import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';

import {
  HoExtractionSolventService,
  HoSamplerService,
} from '../ho-catalog.service';
import { HoMethodRiskSearchService } from '../ho-method-risk-search.service';
import {
  HO_METHOD_IMPORT_AI_REVIEW_MODEL,
  HO_METHOD_IMPORT_AI_REVIEW_RESPONSE_SCHEMA,
} from './ho-method-import-ai-review.constants';
import { matchHoMethodImportCatalogItem } from './ho-method-import-ai-review-catalog-match.util';
import {
  buildHoMethodParserAiComparison,
  filterValidHoMethodAiAgents,
} from './ho-method-import-ai-review-diff.util';
import { parseHoMethodAiReviewJson } from './ho-method-import-ai-review-normalize.util';
import { HoMethodImportAiReviewPromptService } from './ho-method-import-ai-review-prompt.service';
import {
  HoMethodAiReviewResult,
  IHoMethodImportAiReviewUseCase,
} from './ho-method-import-ai-review.types';

@Injectable()
export class HoMethodImportAiReviewUseCase {
  private readonly logger = new Logger(HoMethodImportAiReviewUseCase.name);

  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly promptService: HoMethodImportAiReviewPromptService,
    private readonly systemAiPromptResolver: SystemAiPromptResolverService,
    private readonly hoMethodRiskSearchService: HoMethodRiskSearchService,
    private readonly hoSamplerService: HoSamplerService,
    private readonly hoExtractionSolventService: HoExtractionSolventService,
  ) {}

  async execute(
    params: IHoMethodImportAiReviewUseCase.Params,
  ): Promise<IHoMethodImportAiReviewUseCase.Result> {
    if (!params.extractedText?.trim()) {
      throw new BadRequestException(
        'Texto extraído do PDF é obrigatório para análise assistida por IA.',
      );
    }

    if (!process.env.OPENAI_API_KEY?.trim()) {
      throw new ServiceUnavailableException(
        'Serviço de IA não configurado neste ambiente.',
      );
    }

    const user = this.context.get<UserContext>(ContextKey.USER);
    const isSystemMaster = user.isAdmin;

    if (!isSystemMaster && params.customPrompt?.trim()) {
      throw new ForbiddenException(
        'Apenas usuários master do sistema podem enviar prompt personalizado.',
      );
    }

    if (!isSystemMaster && params.model?.trim()) {
      throw new ForbiddenException(
        'Apenas usuários master do sistema podem selecionar o modelo de IA.',
      );
    }

    const systemPrompt = await this.resolveSystemPrompt(
      isSystemMaster ? params.customPrompt : undefined,
    );

    const [samplers, solvents] = await Promise.all([
      params.registeredSamplers?.length
        ? Promise.resolve(params.registeredSamplers)
        : this.hoSamplerService.browse().then((rows) =>
            rows.map((row) => ({
              id: row.id,
              name: row.name,
              synonyms: [row.description, row.type].filter(Boolean) as string[],
            })),
          ),
      params.registeredExtractionSolvents?.length
        ? Promise.resolve(params.registeredExtractionSolvents)
        : this.hoExtractionSolventService.browse().then((rows) =>
            rows.map((row) => ({
              id: row.id,
              name: row.name,
              synonyms: row.synonyms ?? [],
            })),
          ),
    ]);

    const userPrompt = this.promptService.buildUserPrompt({
      ...params,
      registeredSamplers: samplers,
      registeredExtractionSolvents: solvents,
    });

    const model =
      isSystemMaster && params.model?.trim()
        ? params.model.trim()
        : HO_METHOD_IMPORT_AI_REVIEW_MODEL;

    try {
      const result = await this.aiAdapter.analyze({
        content: [{ type: 'text', text: userPrompt }],
        prompt:
          'Analise o método analítico NIOSH/NMAM e retorne JSON estruturado conforme o schema. Não invente dados. Inclua todos os agentes encontrados nas tabelas, com rastreabilidade e warnings quando necessário.',
        language: 'pt-BR',
        systemPrompt,
        model,
        responseFormat: {
          type: 'json_schema',
          json_schema: {
            name: 'ho_method_import_ai_review',
            strict: true,
            schema: HO_METHOD_IMPORT_AI_REVIEW_RESPONSE_SCHEMA,
          },
        },
      });

      const parsed = parseHoMethodAiReviewJson(result.analysis);
      return this.enrichReviewResult({
        params,
        aiResult: parsed,
        samplers,
        solvents,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao analisar PDF com IA.';

      this.logger.error(`Falha na análise assistida de importação HO: ${message}`);

      if (message.includes('OPENAI_API_KEY')) {
        throw new ServiceUnavailableException(
          'Serviço de IA não configurado neste ambiente.',
        );
      }

      if (
        message.includes('Failed to parse structured output') ||
        message.includes('Resposta incompleta')
      ) {
        throw new BadRequestException(
          'A IA não retornou uma estrutura válida para revisão. Tente novamente ou continue com o parser determinístico.',
        );
      }

      throw new InternalServerErrorException('Erro ao analisar PDF com IA.');
    }
  }

  private async resolveSystemPrompt(customPrompt?: string): Promise<string> {
    try {
      const resolved = await this.systemAiPromptResolver.resolvePromptWithMeta(
        SystemAiPromptKeyEnum.HO_METHOD_IMPORT_AI_REVIEW,
        customPrompt,
      );

      const content = resolved.content?.trim();
      if (!content) {
        throw new BadRequestException(
          'Prompt de análise assistida de importação HO não configurado.',
        );
      }

      return content;
    } catch (error) {
      if (isSystemAiPromptEnumUnavailableError(error)) {
        const fallback = getSystemAiPromptDefaultContent(
          SystemAiPromptKeyEnum.HO_METHOD_IMPORT_AI_REVIEW,
        ).trim();

        if (!fallback) {
          throw new ServiceUnavailableException(
            'Prompt de análise assistida de importação HO indisponível neste ambiente.',
          );
        }

        return customPrompt?.trim() || fallback;
      }

      throw error;
    }
  }

  private async enrichReviewResult(params: {
    params: IHoMethodImportAiReviewUseCase.Params;
    aiResult: HoMethodAiReviewResult;
    samplers: IHoMethodImportAiReviewUseCase.Params['registeredSamplers'];
    solvents: IHoMethodImportAiReviewUseCase.Params['registeredExtractionSolvents'];
  }): Promise<HoMethodAiReviewResult> {
    const { aiResult, params: request, samplers = [], solvents = [] } = params;

    const validAgents = filterValidHoMethodAiAgents(aiResult.agents);
    const agentsWithMatches = await Promise.all(
      validAgents.map(async (agent) => {
        const match = await this.hoMethodRiskSearchService.resolveAgentMatch({
          companyId: request.companyId,
          agent: {
            substanceName: agent.name,
            cas: agent.cas,
            synonyms: agent.synonyms ?? [],
          },
        });

        return {
          ...agent,
          matchedRiskFactor: match.match,
          matchConfidence: match.confidence,
          candidateRiskFactors: match.candidateRiskFactors,
        };
      }),
    );

    const samplerCandidate =
      aiResult.sampling?.samplerPtBr || aiResult.sampling?.samplerOriginal;
    const samplerMatch = matchHoMethodImportCatalogItem(samplerCandidate, samplers ?? []);

    const solventCandidate =
      aiResult.preparation?.extractionSolventPtBr ||
      aiResult.preparation?.extractionSolventOriginal;
    const solventMatch = matchHoMethodImportCatalogItem(solventCandidate, solvents ?? []);

    const parserComparison = buildHoMethodParserAiComparison(
      request.parserResult,
      { ...aiResult, agents: agentsWithMatches },
    );

    const warnings = [
      ...(aiResult.diagnostics.warnings ?? []),
      ...(parserComparison.differences ?? []),
    ];

    if (parserComparison.aiAgentCount > parserComparison.parserAgentCount) {
      warnings.push(
        'A IA identificou mais agentes do que o parser determinístico. Revise antes de aplicar.',
      );
    }

    if (parserComparison.aiAgentCount < parserComparison.parserAgentCount) {
      warnings.push(
        'A IA identificou menos agentes que o parser determinístico. Cuidado ao aplicar substituição.',
      );
    }

    return {
      ...aiResult,
      agents: agentsWithMatches,
      sampling: aiResult.sampling
        ? {
            ...aiResult.sampling,
            samplerSuggestedMatchId: samplerMatch?.id ?? null,
            samplerSuggestedMatchName: samplerMatch?.name ?? null,
          }
        : null,
      preparation: aiResult.preparation
        ? {
            ...aiResult.preparation,
            extractionSolventSuggestedMatchId: solventMatch?.id ?? null,
            extractionSolventSuggestedMatchName: solventMatch?.name ?? null,
          }
        : null,
      diagnostics: {
        ...aiResult.diagnostics,
        parserComparison,
        warnings: [...new Set(warnings.filter(Boolean))],
      },
    };
  }
}
