/**
 * Modelo OpenAI para diagnóstico narrativo (FRPS/PGR).
 *
 * Ordem de precedência:
 * 1. `explicitModel` — enviado no body por usuário MASTER (opcional)
 * 2. `OPENAI_RISK_NARRATIVE_MODEL` — env específica deste fluxo
 * 3. Fallback em código — `gpt-5` (síntese técnica interpretativa; não usar o4-mini aqui)
 *
 * O fluxo de fontes/recomendações (`ai-analyze-risks`) continua usando
 * `OPENAI_MODEL` via o adapter OpenAI compartilhado quando não há model no body.
 */
export const RISK_NARRATIVE_DIAGNOSTIC_DEFAULT_MODEL = 'gpt-5';

export function resolveRiskNarrativeDiagnosticModel(
  explicitModel?: string | null,
): string {
  const fromRequest = explicitModel?.trim();
  if (fromRequest) return fromRequest;

  const fromEnv = process.env.OPENAI_RISK_NARRATIVE_MODEL?.trim();
  if (fromEnv) return fromEnv;

  return RISK_NARRATIVE_DIAGNOSTIC_DEFAULT_MODEL;
}
