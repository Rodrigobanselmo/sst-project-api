import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';

export const MAX_AI_SOURCES = 4;
export const MAX_AI_RECOMMENDATIONS = 4;
export const AI_ANALYSIS_PROCESSING_FRESHNESS_MS = 60 * 60 * 1000;

export enum AiAnalyzeFormQuestionsRisksModeEnum {
  FULL = 'FULL',
  FULL_INCREMENTAL = 'FULL_INCREMENTAL',
  TARGET = 'TARGET',
}

export type AnalysisItemType =
  | 'fontesGeradoras'
  | 'medidasEngenhariaRecomendadas'
  | 'medidasAdministrativasRecomendadas';

export type ExcludedAnalysisItem = {
  type: AnalysisItemType;
  nome: string;
};

export type AnalysisQuotas = {
  missingSources: number;
  missingRecommendations: number;
};

export function normalizeAnalysisItemName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function parseStoredAnalysisResponse(
  analysis: unknown,
): AiRiskAnalysisResponse | null {
  if (!analysis || typeof analysis !== 'object') return null;

  const parsed = analysis as AiRiskAnalysisResponse;

  return {
    frps: parsed.frps ?? '',
    fontesGeradoras: Array.isArray(parsed.fontesGeradoras)
      ? parsed.fontesGeradoras
      : [],
    medidasEngenhariaRecomendadas: Array.isArray(
      parsed.medidasEngenhariaRecomendadas,
    )
      ? parsed.medidasEngenhariaRecomendadas
      : [],
    medidasAdministrativasRecomendadas: Array.isArray(
      parsed.medidasAdministrativasRecomendadas,
    )
      ? parsed.medidasAdministrativasRecomendadas
      : [],
  };
}

export function computeAnalysisQuotas(
  analysis: AiRiskAnalysisResponse | null,
): AnalysisQuotas {
  const sourcesCount = analysis?.fontesGeradoras?.length ?? 0;
  const recommendationsCount =
    (analysis?.medidasEngenhariaRecomendadas?.length ?? 0) +
    (analysis?.medidasAdministrativasRecomendadas?.length ?? 0);

  return {
    missingSources: Math.max(0, MAX_AI_SOURCES - sourcesCount),
    missingRecommendations: Math.max(
      0,
      MAX_AI_RECOMMENDATIONS - recommendationsCount,
    ),
  };
}

export function shouldSkipCompleteAnalysis(quotas: AnalysisQuotas): boolean {
  return quotas.missingSources === 0 && quotas.missingRecommendations === 0;
}

export function getExcludedItemsFromMetadata(
  metadata: unknown,
): ExcludedAnalysisItem[] {
  if (!metadata || typeof metadata !== 'object') return [];

  const excludedItems = (metadata as Record<string, unknown>).excludedItems;
  if (!Array.isArray(excludedItems)) return [];

  return excludedItems.filter((item): item is ExcludedAnalysisItem => {
    if (!item || typeof item !== 'object') return false;

    const typedItem = item as ExcludedAnalysisItem;
    return (
      typeof typedItem.nome === 'string' &&
      (typedItem.type === 'fontesGeradoras' ||
        typedItem.type === 'medidasEngenhariaRecomendadas' ||
        typedItem.type === 'medidasAdministrativasRecomendadas')
    );
  });
}

function isExcludedItem(
  name: string,
  type: AnalysisItemType,
  excludedItems: ExcludedAnalysisItem[],
): boolean {
  const normalizedName = normalizeAnalysisItemName(name);

  return excludedItems.some(
    (item) =>
      item.type === type &&
      normalizeAnalysisItemName(item.nome) === normalizedName,
  );
}

function dedupeAnalysisItems<T extends { nome: string }>(
  items: T[],
  type: AnalysisItemType,
  excludedItems: ExcludedAnalysisItem[],
  seenNames: Set<string>,
): T[] {
  const result: T[] = [];

  for (const item of items) {
    if (!item?.nome?.trim()) continue;

    const normalizedName = normalizeAnalysisItemName(item.nome);
    if (seenNames.has(normalizedName)) continue;
    if (isExcludedItem(item.nome, type, excludedItems)) continue;

    seenNames.add(normalizedName);
    result.push(item);
  }

  return result;
}

export function mergeAiRiskAnalysis(params: {
  existing: AiRiskAnalysisResponse | null;
  incoming: AiRiskAnalysisResponse;
  excludedItems: ExcludedAnalysisItem[];
  riskName: string;
}): AiRiskAnalysisResponse {
  const existing = params.existing ?? {
    frps: params.riskName,
    fontesGeradoras: [],
    medidasEngenhariaRecomendadas: [],
    medidasAdministrativasRecomendadas: [],
  };

  const seenNames = new Set<string>();
  const existingFontes = [...(existing.fontesGeradoras ?? [])].slice(
    0,
    MAX_AI_SOURCES,
  );
  const existingEng = [...(existing.medidasEngenhariaRecomendadas ?? [])];
  const existingAdm = [...(existing.medidasAdministrativasRecomendadas ?? [])];

  for (const item of [...existingFontes, ...existingEng, ...existingAdm]) {
    seenNames.add(normalizeAnalysisItemName(item.nome));
  }

  const incomingFontes = dedupeAnalysisItems(
    params.incoming.fontesGeradoras ?? [],
    'fontesGeradoras',
    params.excludedItems,
    seenNames,
  );
  const mergedFontes = [...existingFontes, ...incomingFontes].slice(
    0,
    MAX_AI_SOURCES,
  );

  for (const item of mergedFontes) {
    seenNames.add(normalizeAnalysisItemName(item.nome));
  }

  const incomingEng = dedupeAnalysisItems(
    params.incoming.medidasEngenhariaRecomendadas ?? [],
    'medidasEngenhariaRecomendadas',
    params.excludedItems,
    seenNames,
  );
  const incomingAdm = dedupeAnalysisItems(
    params.incoming.medidasAdministrativasRecomendadas ?? [],
    'medidasAdministrativasRecomendadas',
    params.excludedItems,
    seenNames,
  );

  const mergedEng = [...existingEng];
  const mergedAdm = [...existingAdm];

  for (const item of incomingEng) {
    if (mergedEng.length + mergedAdm.length >= MAX_AI_RECOMMENDATIONS) break;
    mergedEng.push(item);
  }

  for (const item of incomingAdm) {
    if (mergedEng.length + mergedAdm.length >= MAX_AI_RECOMMENDATIONS) break;
    mergedAdm.push(item);
  }

  return {
    ...existing,
    frps: existing.frps || params.incoming.frps || params.riskName,
    fontesGeradoras: mergedFontes,
    medidasEngenhariaRecomendadas: mergedEng,
    medidasAdministrativasRecomendadas: mergedAdm,
  };
}

export function buildIncrementalPromptContext(params: {
  existing: AiRiskAnalysisResponse | null;
  excludedItems: ExcludedAnalysisItem[];
  quotas: AnalysisQuotas;
}): string {
  const existingFontes =
    params.existing?.fontesGeradoras?.map((item) => `- ${item.nome}`).join('\n') ||
    '(nenhuma)';
  const existingEng =
    params.existing?.medidasEngenhariaRecomendadas
      ?.map((item) => `- ${item.nome}`)
      .join('\n') || '(nenhuma)';
  const existingAdm =
    params.existing?.medidasAdministrativasRecomendadas
      ?.map((item) => `- ${item.nome}`)
      .join('\n') || '(nenhuma)';
  const excludedText =
    params.excludedItems.length > 0
      ? params.excludedItems
          .map((item) => `- [${item.type}] ${item.nome}`)
          .join('\n')
      : '(nenhum)';

  return `
CONTEXTO DE COMPLEMENTO INCREMENTAL:
- Esta execução deve COMPLEMENTAR a análise existente, sem duplicar itens já presentes.
- Não altere, remova ou reescreva os itens existentes listados abaixo.
- Gere exatamente até ${params.quotas.missingSources} Fonte(s) Geradora(s) adicional(is).
- Gere exatamente até ${params.quotas.missingRecommendations} Recomendação(ões) adicional(is) no total, distribuindo entre engenharia e administrativas conforme pertinência.
- Se a quantidade solicitada for 0 para um grupo, retorne array vazio para esse grupo.
- O total final de recomendações (engenharia + administrativas) não pode ultrapassar ${MAX_AI_RECOMMENDATIONS}.

ITENS JÁ EXISTENTES (NÃO DUPLICAR):
Fontes Geradoras:
${existingFontes}

Medidas de Engenharia:
${existingEng}

Medidas Administrativas:
${existingAdm}

ITENS EXCLUÍDOS PELO USUÁRIO (NÃO SUGERIR NOVAMENTE):
${excludedText}
`.trim();
}

export function detectRemovedAnalysisItems(
  previous: AiRiskAnalysisResponse | null,
  next: AiRiskAnalysisResponse,
): ExcludedAnalysisItem[] {
  if (!previous) return [];

  const removed: ExcludedAnalysisItem[] = [];

  const collectRemoved = (
    type: AnalysisItemType,
    previousItems: Array<{ nome: string }> | undefined,
    nextItems: Array<{ nome: string }> | undefined,
  ) => {
    const nextNames = new Set(
      (nextItems ?? []).map((item) => normalizeAnalysisItemName(item.nome)),
    );

    for (const item of previousItems ?? []) {
      if (!item?.nome?.trim()) continue;

      const normalizedName = normalizeAnalysisItemName(item.nome);
      if (!nextNames.has(normalizedName)) {
        removed.push({ type, nome: item.nome });
      }
    }
  };

  collectRemoved(
    'fontesGeradoras',
    previous.fontesGeradoras,
    next.fontesGeradoras,
  );
  collectRemoved(
    'medidasEngenhariaRecomendadas',
    previous.medidasEngenhariaRecomendadas,
    next.medidasEngenhariaRecomendadas,
  );
  collectRemoved(
    'medidasAdministrativasRecomendadas',
    previous.medidasAdministrativasRecomendadas,
    next.medidasAdministrativasRecomendadas,
  );

  return removed;
}

export function mergeExcludedItems(
  existing: ExcludedAnalysisItem[],
  additions: ExcludedAnalysisItem[],
): ExcludedAnalysisItem[] {
  const seen = new Set(
    existing.map(
      (item) => `${item.type}:${normalizeAnalysisItemName(item.nome)}`,
    ),
  );
  const merged = [...existing];

  for (const item of additions) {
    const key = `${item.type}:${normalizeAnalysisItemName(item.nome)}`;
    if (seen.has(key)) continue;

    seen.add(key);
    merged.push(item);
  }

  return merged;
}

export function isRecentlyProcessingRecord(params: {
  status: string;
  updatedAt?: Date | null;
  createdAt?: Date | null;
}): boolean {
  if (params.status !== 'PROCESSING') return false;

  const referenceDate = params.updatedAt ?? params.createdAt;
  if (!referenceDate) return false;

  return (
    Date.now() - referenceDate.getTime() < AI_ANALYSIS_PROCESSING_FRESHNESS_MS
  );
}
