import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PcmsoAcgihBeiComparisonDecisionEnum } from '@prisma/client';

import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';

import { AcgihBeiComparisonService } from './acgih-bei-comparison.service';
import {
  COMPARISON_AI_DECISION_VALUES,
  COMPARISON_AI_SUGGESTION_MODEL,
  COMPARISON_AI_SUGGESTION_RESPONSE_SCHEMA,
  COMPARISON_AI_SUGGESTION_SYSTEM_PROMPT,
} from './comparison-ai-suggestion.constants';
import { ComparisonResult } from './acgih-bei-comparison.util';

export type ComparisonAiSuggestion = {
  decisionSuggestion: PcmsoAcgihBeiComparisonDecisionEnum;
  confidence: 'low' | 'medium' | 'high';
  rationale: string;
  matchedFields: string[];
  divergentFields: string[];
  suggestedTechnicalNote: string;
  warnings: string[];
};

const AI_TIMEOUT_MS = 30000;

/**
 * 4O.2 — Sugestão de decisão técnica assistida por IA para UMA linha da
 * comparação. É APENAS leitura/sugestão: não grava decisão, não grava sugestão,
 * não toca NR-7/ACGIH/BEI/Biblioteca/regras/fonte/sync/status. O contexto é
 * montado server-side por allow-list (sem PII e sem confiar no Client).
 */
@Injectable()
export class ComparisonAiSuggestionService {
  private readonly logger = new Logger(ComparisonAiSuggestionService.name);

  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    private readonly comparisonService: AcgihBeiComparisonService,
  ) {}

  async suggest(params: {
    acgihBeiIndicatorId: string;
  }): Promise<ComparisonAiSuggestion> {
    const acgihBeiIndicatorId = params.acgihBeiIndicatorId?.trim();
    if (!acgihBeiIndicatorId) {
      throw new BadRequestException('acgihBeiIndicatorId é obrigatório.');
    }

    if (!process.env.OPENAI_API_KEY?.trim()) {
      throw new ServiceUnavailableException(
        'Serviço de IA não configurado neste ambiente.',
      );
    }

    // Localiza a linha server-side (nunca confia em contexto vindo do Client).
    const rows = await this.comparisonService.computeAll();
    const row = rows.find((r) => r.acgihBeiId === acgihBeiIndicatorId);
    if (!row) {
      throw new NotFoundException(
        'Indicador ACGIH/BEI não encontrado ou indisponível para comparação.',
      );
    }

    const technicalContext = this.buildTechnicalContext(row);

    try {
      const result = await this.withTimeout(
        this.aiAdapter.analyze({
          content: [{ type: 'text', text: technicalContext }],
          prompt:
            'Analise a linha de comparação a seguir e gere decisionSuggestion (um dos valores do enum), confidence, rationale, matchedFields, divergentFields, suggestedTechnicalNote e warnings. A confiança é apenas da sugestão, nunca validação definitiva.',
          language: 'pt-BR',
          systemPrompt: COMPARISON_AI_SUGGESTION_SYSTEM_PROMPT,
          model: COMPARISON_AI_SUGGESTION_MODEL,
          responseFormat: {
            type: 'json_schema',
            json_schema: {
              name: 'acgih_comparison_decision_suggestion',
              strict: true,
              schema: COMPARISON_AI_SUGGESTION_RESPONSE_SCHEMA,
            },
          },
        }),
        AI_TIMEOUT_MS,
      );

      return this.parseResponse(result.analysis);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ServiceUnavailableException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao gerar sugestão com IA.';
      this.logger.error(`Falha ao gerar sugestão de decisão (4O.2): ${message}`);

      if (message.includes('OPENAI_API_KEY')) {
        throw new ServiceUnavailableException(
          'Serviço de IA não configurado neste ambiente.',
        );
      }
      if (message === 'AI_TIMEOUT') {
        throw new ServiceUnavailableException(
          'Tempo de resposta da IA excedido. Tente novamente ou registre a decisão manualmente.',
        );
      }
      throw new InternalServerErrorException(
        'Erro ao gerar sugestão com IA. Registre a decisão manualmente.',
      );
    }
  }

  /**
   * Monta o contexto técnico via ALLOW-LIST explícita. Apenas dados técnicos
   * de catálogo da linha — nenhum dado de empresa/trabalhador/documento/PII e
   * nenhum identificador interno (cuid) é enviado à IA.
   */
  private buildTechnicalContext(row: ComparisonResult): string {
    const lines: string[] = [];

    lines.push('Valores possíveis de decisionSuggestion (enum):');
    lines.push(COMPARISON_AI_DECISION_VALUES.join(', '));
    lines.push('');

    lines.push('ACGIH/BEI:');
    lines.push(`- substância: ${row.substanceName ?? '—'}`);
    lines.push(`- CAS: ${row.cas ?? '—'}`);
    lines.push(`- determinante: ${row.determinant ?? '—'}`);
    lines.push(`- matriz biológica: ${row.biologicalMatrix ?? '—'}`);
    lines.push(`- momento de coleta: ${row.samplingTime ?? '—'}`);
    lines.push(
      `- valor/BEI: ${row.beiValue ?? '—'}${row.unit ? ` ${row.unit}` : ''}`,
    );
    lines.push(`- confiança da transcrição ACGIH/BEI: ${row.confidence ?? '—'}`);
    lines.push('');

    lines.push('NR-7:');
    lines.push(`- match NR-7: ${row.nr7MatchStatus}`);
    lines.push(`- substância NR-7: ${row.nr7SubstanceName ?? '—'}`);
    lines.push(`- indicador/determinante NR-7: ${row.nr7IndicatorName ?? '—'}`);
    lines.push('');

    lines.push('Biblioteca Risco × Exame:');
    lines.push(`- match Biblioteca: ${row.examRiskRuleMatchStatus}`);
    lines.push(`- método do match: ${row.ruleMatchMethod ?? '—'}`);
    lines.push(`- origem da regra: ${row.examRiskRuleSource ?? '—'}`);
    lines.push(`- exames da regra: ${row.examNameSnapshot ?? '—'}`);
    lines.push('');

    lines.push('Resultado calculado pelo sistema:');
    lines.push(`- classificação: ${row.comparisonStatus}`);
    lines.push(`- ação sugerida: ${row.suggestedAction}`);
    lines.push(`- diferenças técnicas: ${row.technicalDiff || 'nenhuma'}`);

    return lines.join('\n');
  }

  private parseResponse(analysis: string): ComparisonAiSuggestion {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(analysis);
    } catch {
      throw new BadRequestException('Resposta inválida do serviço de IA.');
    }

    const decision = parsed.decisionSuggestion;
    const confidence = parsed.confidence;

    const isValidDecision =
      typeof decision === 'string' &&
      (COMPARISON_AI_DECISION_VALUES as string[]).includes(decision);
    const isValidConfidence =
      confidence === 'low' || confidence === 'medium' || confidence === 'high';

    if (
      !isValidDecision ||
      !isValidConfidence ||
      typeof parsed.rationale !== 'string' ||
      typeof parsed.suggestedTechnicalNote !== 'string'
    ) {
      throw new BadRequestException('Resposta incompleta do serviço de IA.');
    }

    const toStringArray = (value: unknown): string[] =>
      Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : [];

    const warnings = toStringArray(parsed.warnings);
    if (confidence === 'low') {
      warnings.push(
        'Confiança baixa na sugestão — revise tecnicamente antes de salvar.',
      );
    }

    return {
      decisionSuggestion: decision as PcmsoAcgihBeiComparisonDecisionEnum,
      confidence,
      rationale: parsed.rationale.trim(),
      matchedFields: toStringArray(parsed.matchedFields),
      divergentFields: toStringArray(parsed.divergentFields),
      suggestedTechnicalNote: parsed.suggestedTechnicalNote.trim(),
      warnings: [...new Set(warnings)],
    };
  }

  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('AI_TIMEOUT')), ms),
      ),
    ]);
  }
}
