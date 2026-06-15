import {
  HoMethodAiReviewAgent,
  HoMethodAiReviewConfidence,
  HoMethodAiReviewResult,
  HoMethodAiReviewSourceTrace,
} from './ho-method-import-ai-review.types';

const asNullableString = (value: unknown): string | null => {
  if (value == null) return null;
  if (typeof value !== 'string') return String(value);
  const trimmed = value.trim();
  return trimmed || null;
};

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
};

const asConfidence = (value: unknown): HoMethodAiReviewConfidence => {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return 'low';
};

const asSourceTrace = (value: unknown): HoMethodAiReviewSourceTrace[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      page:
        typeof item.page === 'number' && Number.isFinite(item.page)
          ? item.page
          : null,
      table: asNullableString(item.table),
      field: asNullableString(item.field) ?? 'unknown',
      excerpt: asNullableString(item.excerpt) ?? '',
    }))
    .filter((item) => item.field && item.excerpt);
};

const normalizeLimits = (value: unknown) => {
  if (!value || typeof value !== 'object') return null;

  const limits = value as Record<string, unknown>;
  const normalized = {
    nr15Lt: asNullableString(limits.nr15Lt),
    acgihTwa: asNullableString(limits.acgihTwa),
    acgihStel: asNullableString(limits.acgihStel),
    acgihCeiling: asNullableString(limits.acgihCeiling),
    nioshRel: asNullableString(limits.nioshRel),
    nioshStel: asNullableString(limits.nioshStel),
    nioshCeiling: asNullableString(limits.nioshCeiling),
    oshaPel: asNullableString(limits.oshaPel),
    oshaStel: asNullableString(limits.oshaStel),
    oshaCeiling: asNullableString(limits.oshaCeiling),
    aihaWeel: asNullableString(limits.aihaWeel),
    aihaWeelCeiling: asNullableString(limits.aihaWeelCeiling),
    unit: asNullableString(limits.unit),
    notes: asNullableString(limits.notes),
  };

  const hasValue = Object.values(normalized).some(Boolean);
  return hasValue ? normalized : null;
};

const normalizeAgent = (value: unknown): HoMethodAiReviewAgent | null => {
  if (!value || typeof value !== 'object') return null;
  const agent = value as Record<string, unknown>;
  const name = asNullableString(agent.name);
  if (!name) return null;

  return {
    name,
    cas: asNullableString(agent.cas),
    synonyms: asStringArray(agent.synonyms),
    translatedNamePtBr: asNullableString(agent.translatedNamePtBr),
    technicalNotes: asStringArray(agent.technicalNotes),
    occupationalLimits: normalizeLimits(agent.occupationalLimits),
    sourceTrace: asSourceTrace(agent.sourceTrace),
    confidence: asConfidence(agent.confidence),
    warnings: asStringArray(agent.warnings),
  };
};

const normalizeSection = <T extends Record<string, string | null>>(
  value: unknown,
  keys: Array<keyof T>,
): T | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const normalized = {} as T;

  keys.forEach((key) => {
    normalized[key] = asNullableString(record[key as string]) as T[keyof T];
  });

  const hasValue = Object.values(normalized).some(Boolean);
  return hasValue ? normalized : null;
};

export const normalizeHoMethodAiReviewResponse = (
  raw: unknown,
): HoMethodAiReviewResult => {
  const parsed =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  const agents = Array.isArray(parsed.agents)
    ? parsed.agents
        .map((agent) => normalizeAgent(agent))
        .filter((agent): agent is HoMethodAiReviewAgent => Boolean(agent))
    : [];

  const diagnosticsRaw =
    parsed.diagnostics && typeof parsed.diagnostics === 'object'
      ? (parsed.diagnostics as Record<string, unknown>)
      : {};

  const detectedTables = Array.isArray(diagnosticsRaw.detectedTables)
    ? diagnosticsRaw.detectedTables
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
        .map((item) => ({
          label: asNullableString(item.label),
          title: asNullableString(item.title),
          page:
            typeof item.page === 'number' && Number.isFinite(item.page)
              ? item.page
              : null,
          inferredPurpose:
            (item.inferredPurpose === 'agents' ||
            item.inferredPurpose === 'limits' ||
            item.inferredPurpose === 'sampling' ||
            item.inferredPurpose === 'properties'
              ? item.inferredPurpose
              : 'unknown') as HoMethodAiReviewResult['diagnostics']['detectedTables'][number]['inferredPurpose'],
          confidence: asConfidence(item.confidence),
        }))
    : [];

  const diagnosticsWarnings = asStringArray(diagnosticsRaw.warnings);

  return {
    method: normalizeSection(parsed.method, [
      'institution',
      'methodCode',
      'issue',
      'issueDate',
      'displayName',
      'analyticalMethod',
      'evaluation',
    ]),
    agents,
    sampling: normalizeSection(parsed.sampling, [
      'samplerOriginal',
      'samplerPtBr',
      'flowMin',
      'flowMax',
      'flowUnit',
      'volumeMin',
      'volumeMax',
      'volumeUnit',
      'shipment',
    ]),
    preparation: normalizeSection(parsed.preparation, [
      'stabilityDays',
      'stabilityText',
      'storageTemperature',
      'storageTemperatureUnit',
      'extractionSolventOriginal',
      'extractionSolventPtBr',
    ]),
    analytical: normalizeSection(parsed.analytical, [
      'technique',
      'analyte',
      'detector',
      'lod',
      'range',
    ]),
    observations: normalizeSection(parsed.observations, [
      'applicability',
      'interferences',
      'notes',
    ]),
    diagnostics: {
      detectedTables,
      warnings: diagnosticsWarnings,
    },
  };
};

export const parseHoMethodAiReviewJson = (analysis: string): HoMethodAiReviewResult => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(analysis);
  } catch {
    throw new Error('Failed to parse structured output');
  }

  const normalized = normalizeHoMethodAiReviewResponse(parsed);

  if (!normalized.agents.length) {
    throw new Error('Resposta incompleta do serviço de IA.');
  }

  return normalized;
};
