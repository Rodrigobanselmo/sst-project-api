/**
 * Modelo efetivo do diagnóstico narrativo de Indicadores:
 * 1. `model` no body (apenas MASTER)
 * 2. `OPENAI_INDICATORS_NARRATIVE_MODEL` — env específica deste fluxo
 * 3. Fallback em código: gpt-4o-mini (mais barato/seguro para testes)
 */
export const INDICATORS_NARRATIVE_DIAGNOSTIC_DEFAULT_MODEL = 'gpt-4o-mini';

export function resolveIndicatorsNarrativeDiagnosticModel(
  requestModel?: string,
): string {
  const fromRequest = requestModel?.trim();
  if (fromRequest) return fromRequest;

  const fromEnv = process.env.OPENAI_INDICATORS_NARRATIVE_MODEL?.trim();
  if (fromEnv) return fromEnv;

  return INDICATORS_NARRATIVE_DIAGNOSTIC_DEFAULT_MODEL;
}
