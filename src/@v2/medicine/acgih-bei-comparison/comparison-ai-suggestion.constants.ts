import { PcmsoAcgihBeiComparisonDecisionEnum } from '@prisma/client';

/** Valores de decisão expostos à IA (espelham o enum da 4O.1). */
export const COMPARISON_AI_DECISION_VALUES = Object.values(
  PcmsoAcgihBeiComparisonDecisionEnum,
) as PcmsoAcgihBeiComparisonDecisionEnum[];

/** Schema estruturado (strict) da sugestão de decisão técnica (4O.2). */
export const COMPARISON_AI_SUGGESTION_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    decisionSuggestion: {
      type: 'string',
      enum: COMPARISON_AI_DECISION_VALUES,
    },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    rationale: { type: 'string' },
    matchedFields: {
      type: 'array',
      items: { type: 'string' },
    },
    divergentFields: {
      type: 'array',
      items: { type: 'string' },
    },
    suggestedTechnicalNote: { type: 'string' },
    warnings: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'decisionSuggestion',
    'confidence',
    'rationale',
    'matchedFields',
    'divergentFields',
    'suggestedTechnicalNote',
    'warnings',
  ],
  additionalProperties: false,
} as const;

export const COMPARISON_AI_SUGGESTION_MODEL =
  process.env.COMPARISON_AI_SUGGESTION_MODEL ||
  process.env.OPENAI_MODEL ||
  'gpt-4o-mini';

/** System prompt: curadoria técnica ACGIH/BEI × NR-7 × Biblioteca. */
export const COMPARISON_AI_SUGGESTION_SYSTEM_PROMPT = `Você é um especialista técnico em saúde ocupacional (PCMSO/NR-7) e em monitoramento biológico ACGIH/BEI.
Sua tarefa é analisar UMA linha de comparação entre a base ACGIH/BEI, a base NR-7 e a Biblioteca Risco × Exame e sugerir uma decisão técnica de curadoria para revisão humana.

Considere equivalências de nomenclatura/codificação do momento de coleta. Exemplos de equivalência operacional:
- "Final da jornada e da semana" (ACGIH/BEI) equivale ao código "FJFS" (NR-7).
- "Final da jornada" equivale a "FJ"; "Antes da jornada" equivale a "AJ".
Diferenças apenas de nomenclatura/codificação NÃO são divergência técnica real; classifique como equivalência técnica / falso divergente.

Regras:
- decisionSuggestion deve ser exatamente um dos valores do enum fornecido.
- Avalie determinante, matriz biológica, momento de coleta e valor/unidade.
- matchedFields e divergentFields devem listar nomes curtos dos campos (ex.: "determinant", "biologicalMatrix", "samplingTime", "value").
- rationale: justificativa técnica objetiva em português.
- suggestedTechnicalNote: nota técnica pronta para um revisor humano editar e salvar, em português, sem bullets.
- confidence é apenas a confiança DA SUGESTÃO, nunca uma validação técnica definitiva.
- warnings: alerte sobre incertezas, dados faltantes ou baixa confiança da transcrição.
- Você NUNCA decide nada de forma definitiva; um humano sempre revisa e confirma.`;
