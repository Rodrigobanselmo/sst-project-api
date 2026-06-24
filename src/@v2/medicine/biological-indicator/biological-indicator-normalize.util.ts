import { createHash } from 'crypto';

import {
  BiologicalCollectionMomentEnum,
  BiologicalIndicatorAnnexEnum,
  BiologicalIndicatorTechnicalObservationEnum,
  BiologicalNormativeSourceEnum,
  BiologicalIndicatorTableEnum,
} from '@prisma/client';

const COLLECTION_MOMENT_MAP: Record<string, BiologicalCollectionMomentEnum> = {
  AJ: BiologicalCollectionMomentEnum.AJ,
  FJ: BiologicalCollectionMomentEnum.FJ,
  FJFS: BiologicalCollectionMomentEnum.FJFS,
  AJFS: BiologicalCollectionMomentEnum.AJFS,
  AJ48: BiologicalCollectionMomentEnum.AJ48,
  NC: BiologicalCollectionMomentEnum.NC,
  FS: BiologicalCollectionMomentEnum.FS,
  'AJ-FJ': BiologicalCollectionMomentEnum.AJ_FJ,
  AJ_FJ: BiologicalCollectionMomentEnum.AJ_FJ,
};

const TECHNICAL_OBSERVATION_TOKENS = new Set<string>(
  Object.values(BiologicalIndicatorTechnicalObservationEnum),
);

export function normalizeText(value?: string | null): string {
  if (!value) return '';

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function parseCasNumbers(raw?: string | null): string[] {
  if (!raw) return [];

  const trimmed = raw.trim();
  if (!trimmed || trimmed === '-') return [];

  return Array.from(
    new Set(
      trimmed
        .split(/[;,]/)
        .map((part) => part.trim())
        .filter(Boolean),
    ),
  );
}

export function resolveCasPrimary(casNumbers: string[]): string | null {
  return casNumbers[0] ?? null;
}

export function parseCollectionMoment(raw?: string | null): BiologicalCollectionMomentEnum {
  const key = raw?.trim().toUpperCase().replace(/\s+/g, '') ?? '';
  const mapped = COLLECTION_MOMENT_MAP[key];

  if (!mapped) {
    throw new Error(`Momento de coleta inválido: "${raw}"`);
  }

  return mapped;
}

export function parseTechnicalObservations(
  raw?: string | null,
): BiologicalIndicatorTechnicalObservationEnum[] {
  if (!raw || raw.trim() === '-' || !raw.trim()) return [];

  const tokens = raw
    .replace(/[()]/g, ' ')
    .split(/[\s,;]+/)
    .map((token) => token.trim().toUpperCase())
    .filter(Boolean);

  const observations = new Set<BiologicalIndicatorTechnicalObservationEnum>();

  tokens.forEach((token) => {
    if (TECHNICAL_OBSERVATION_TOKENS.has(token)) {
      observations.add(token as BiologicalIndicatorTechnicalObservationEnum);
    }
  });

  return Array.from(observations);
}

export function normalizeReferenceValue(raw?: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '-') return null;
  return trimmed;
}

export type IdempotencyKeyInput = {
  normativeSource: BiologicalNormativeSourceEnum;
  normativeVersion: string;
  annex: BiologicalIndicatorAnnexEnum;
  tableNumber: BiologicalIndicatorTableEnum;
  substanceNameNormalized: string;
  casNumbers: string[];
  biologicalIndicatorNormalized: string;
  biologicalMatrixNormalized: string;
  collectionMoment: BiologicalCollectionMomentEnum;
};

export function buildIdempotencyKey(input: IdempotencyKeyInput): string {
  const payload = [
    input.normativeSource,
    input.normativeVersion,
    input.annex,
    input.tableNumber,
    input.substanceNameNormalized,
    [...input.casNumbers].sort().join('|'),
    input.biologicalIndicatorNormalized,
    input.biologicalMatrixNormalized,
    input.collectionMoment,
  ].join('::');

  return createHash('sha256').update(payload).digest('hex');
}

export function sha256File(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}
