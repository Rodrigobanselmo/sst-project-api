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
import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';

import {
  RISK_FACTOR_AI_SUGGESTIONS_MODEL,
  RISK_FACTOR_AI_SUGGESTIONS_RESPONSE_SCHEMA,
} from '../constants/risk-factor-ai-suggestions.constants';
import { IRiskFactorAiSuggestionsUseCase } from '../risk-factor-ai-suggestions.types';
import { RiskFactorAiSuggestionsPromptService } from '../services/risk-factor-ai-suggestions-prompt.service';
import { validateChemicalRiskSuggestedSeverity } from '../services/validate-chemical-risk-suggested-severity.service';

@Injectable()
export class RiskFactorAiSuggestionsUseCase {
  private readonly logger = new Logger(RiskFactorAiSuggestionsUseCase.name);

  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly promptService: RiskFactorAiSuggestionsPromptService,
    private readonly systemAiPromptResolver: SystemAiPromptResolverService,
  ) {}

  async execute(
    params: IRiskFactorAiSuggestionsUseCase.Params,
  ): Promise<IRiskFactorAiSuggestionsUseCase.Result> {
    const user = this.context.get<UserContext>(ContextKey.USER);
    const isSystemMaster = user.isAdmin;
    if (!params.name?.trim() && !params.cas?.trim()) {
      throw new BadRequestException(
        'Informe ao menos o nome do agente ou o número CAS para gerar sugestão.',
      );
    }

    if (!process.env.OPENAI_API_KEY?.trim()) {
      throw new ServiceUnavailableException(
        'Serviço de IA não configurado neste ambiente.',
      );
    }

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

    const resolvedPrompt = await this.systemAiPromptResolver.resolvePromptWithMeta(
      SystemAiPromptKeyEnum.RISK_FACTOR_CHEMICAL_AI_SUGGESTIONS,
      isSystemMaster ? params.customPrompt : undefined,
    );

    const systemPrompt = resolvedPrompt.content?.trim();
    if (!systemPrompt) {
      throw new BadRequestException(
        'Prompt de sugestão de fator de risco químico não configurado.',
      );
    }

    const { userPrompt, internalMatches } =
      await this.promptService.buildPromptContext(params);

    const model = isSystemMaster && params.model?.trim()
      ? params.model.trim()
      : RISK_FACTOR_AI_SUGGESTIONS_MODEL;

    try {
      const result = await this.aiAdapter.analyze({
        content: [{ type: 'text', text: userPrompt }],
        prompt:
          'Com base no contexto e no critério de severidade do sistema, gere risk, symptoms, severity (1-5), confidence, sourceTrace e warnings. Os textos risk e symptoms devem estar prontos para uso no sistema, sem bullets ou justificativas. Use note=null em sourceTrace quando não houver observação. Para severidade, registre em sourceTrace a justificativa técnica conforme a escala 1-5.',
        language: 'pt-BR',
        systemPrompt,
        model,
        responseFormat: {
          type: 'json_schema',
          json_schema: {
            name: 'risk_factor_ai_suggestions',
            strict: true,
            schema: RISK_FACTOR_AI_SUGGESTIONS_RESPONSE_SCHEMA,
          },
        },
      });

      const parsed = this.parseStructuredResponse(result.analysis);
      const severityValidation = validateChemicalRiskSuggestedSeverity({
        payload: params,
        aiResponse: parsed,
      });

      const warnings = [...parsed.warnings];
      const sourceTrace = [...parsed.sourceTrace];

      if (severityValidation.warning) {
        warnings.push(severityValidation.warning);
      }

      if (severityValidation.sourceTraceEntry) {
        sourceTrace.push(severityValidation.sourceTraceEntry);
      }

      if (!internalMatches.length && !params.cas?.trim()) {
        warnings.push(
          'Nenhum registro interno encontrado e CAS não informado — revise a sugestão com cautela.',
        );
      }

      if (parsed.confidence === 'low') {
        warnings.push(
          'Confiança baixa na sugestão — revise tecnicamente antes de salvar.',
        );
      }

      return {
        ...parsed,
        severity: severityValidation.severity,
        severityAi: severityValidation.severityAi,
        severityAdjusted: severityValidation.severityAdjusted,
        severityAdjustmentReason: severityValidation.severityAdjustmentReason,
        sourceTrace,
        warnings: [...new Set(warnings)],
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof ServiceUnavailableException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao gerar sugestão com IA.';

      this.logger.error(`Falha ao gerar sugestão de fator de risco: ${message}`);

      if (message.includes('OPENAI_API_KEY')) {
        throw new ServiceUnavailableException(
          'Serviço de IA não configurado neste ambiente.',
        );
      }

      if (
        message.includes('Failed to parse structured output') ||
        message.includes('Resposta inválida') ||
        message.includes('Resposta incompleta')
      ) {
        throw new BadRequestException(
          'Dados insuficientes ou inválidos para gerar sugestão.',
        );
      }

      if (
        message.includes('response_format') ||
        message.includes('json_schema') ||
        message.includes('Failed to analyze content')
      ) {
        throw new InternalServerErrorException('Erro ao gerar sugestão com IA.');
      }

      throw new InternalServerErrorException('Erro ao gerar sugestão com IA.');
    }
  }

  private parseStructuredResponse(
    analysis: string,
  ): IRiskFactorAiSuggestionsUseCase.Result {
    let parsed: Record<string, unknown>;

    try {
      parsed = JSON.parse(analysis);
    } catch {
      throw new BadRequestException('Resposta inválida do serviço de IA.');
    }

    const severity = Number(parsed.severity);
    const confidence = parsed.confidence;

    if (
      typeof parsed.risk !== 'string' ||
      typeof parsed.symptoms !== 'string' ||
      !Number.isInteger(severity) ||
      severity < 1 ||
      severity > 5 ||
      (confidence !== 'low' && confidence !== 'medium' && confidence !== 'high')
    ) {
      throw new BadRequestException('Resposta incompleta do serviço de IA.');
    }

    const sourceTrace = Array.isArray(parsed.sourceTrace)
      ? parsed.sourceTrace
          .filter(
            (item): item is IRiskFactorAiSuggestionsUseCase.Result['sourceTrace'][number] =>
              Boolean(item) &&
              typeof item === 'object' &&
              typeof (item as { source?: unknown }).source === 'string' &&
              Array.isArray((item as { usedFor?: unknown }).usedFor),
          )
          .map((item) => ({
            source: item.source,
            usedFor: item.usedFor,
            note:
              typeof item.note === 'string' && item.note.trim()
                ? item.note.trim()
                : undefined,
          }))
      : [];

    const warnings = Array.isArray(parsed.warnings)
      ? parsed.warnings.filter((item): item is string => typeof item === 'string')
      : [];

    return {
      risk: parsed.risk.trim(),
      symptoms: parsed.symptoms.trim(),
      severity,
      confidence,
      sourceTrace,
      warnings,
    };
  }
}
