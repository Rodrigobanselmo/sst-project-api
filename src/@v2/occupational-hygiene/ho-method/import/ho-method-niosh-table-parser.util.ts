import {
  HoMethodImportField,
  HoMethodImportOccupationalLimitSuggestions,
} from './ho-method-import.types';

export type ParsedCompoundTableRow = {
  compound: string;
  cas: string;
  rtecs: string | null;
  synonyms: string[];
};

export type ParsedExposureLimitRow = {
  compound: string;
  oshaPel: string | null;
  nioshRel: string | null;
  nioshStel: string | null;
};

const field = <T>(
  value: T | null,
  confidence: HoMethodImportField<T>['confidence'],
  rawText?: string | null,
): HoMethodImportField<T> => ({
  value,
  confidence,
  rawText: rawText ?? null,
});

export const INVALID_AGENT_NAME_PATTERN =
  /^(table\s*\d+|sampling|analyte|cas|synonyms|osha(?:\s*pel)?|niosh(?:\s*rel)?|properties|method|filter|shipment|sampler|blank|accuracy|range|technique|measurement|mw|rtecs|compound|other names?)$/i;

export const referencesNmamTable = (
  value: string | null | undefined,
  tableNumber: number,
): boolean => {
  if (!value?.trim()) return false;

  const normalized = value.trim().toLowerCase().replace(/\s+/g, ' ');
  return (
    normalized === `table ${tableNumber}` ||
    normalized.startsWith(`table ${tableNumber} `) ||
    normalized.endsWith(` table ${tableNumber}`)
  );
};

export const normalizeNmamTableText = (text: string): string =>
  text
    .replace(/\u00a0/g, ' ')
    .replace(/mg\/m\s*3\s*\n\s*\)/gi, 'mg/m3)')
    .replace(/mg\/m\s*3/gi, 'mg/m3')
    .replace(/\t+/g, '\t')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

export const isInvalidAgentCandidate = (name: string): boolean =>
  INVALID_AGENT_NAME_PATTERN.test(name.trim());

export const normalizeCompoundNameForMatch = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

export const formatCompoundName = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const splitSynonyms = (raw?: string | null): string[] => {
  if (!raw?.trim()) return [];

  return raw
    .split(/[;]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const mergeBrokenTableLines = (tableText: string): string[] => {
  const mergedLines: string[] = [];
  let current = '';

  for (const line of tableText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (
      /^(compound|cas|rtecs|other names|osha pel|niosh rel|\(alphabetically\)|\(\d+\)|table\s+\d+)/i.test(
        trimmed,
      )
    ) {
      if (current) mergedLines.push(current.trim());
      current = '';
      continue;
    }

    if (!current) {
      current = trimmed;
      continue;
    }

    const currentUnitMatches =
      current.match(/\d+(?:[.,]\d+)?\s*(?:mg\/m3|ppm)/gi) ?? [];

    const currentLooksComplete =
      /\d{2,7}-\d{2}-\d\s+[A-Z]{2}\d{6,7}/i.test(current) ||
      /;\s*STEL\s+\d+(?:[.,]\d+)?\s*(?:mg\/m3|ppm)/i.test(current) ||
      currentUnitMatches.length >= 2;

    if (currentLooksComplete && /^[A-Za-z\[]/.test(trimmed)) {
      mergedLines.push(current.trim());
      current = trimmed;
    } else {
      current = `${current} ${trimmed}`;
    }
  }

  if (current) mergedLines.push(current.trim());

  return mergedLines;
};

export const parseCompoundSynonymsTable = (
  text: string,
): ParsedCompoundTableRow[] => {
  const normalized = normalizeNmamTableText(text);
  const startMatch =
    normalized.match(/Table\s+1\.\s*CAS Numbers, RTECS Numbers, and Synonyms/i) ??
    normalized.match(/CAS Numbers, RTECS Numbers, and Synonyms/i);

  if (startMatch?.index == null) return [];

  const slice = normalized.slice(startMatch.index);
  const endMatch = slice.match(
    /\n\(\d+\)\s+Registry of Toxic Effects|\nTable\s+2\b|\n-- \d+ of \d+ --/i,
  );
  const tableText = endMatch?.index ? slice.slice(0, endMatch.index) : slice;

  const rows: ParsedCompoundTableRow[] = [];

  for (const trimmed of mergeBrokenTableLines(tableText)) {
    const match = trimmed.match(
      /^(.+?)\s+(\d{2,7}-\d{2}-\d)\s+([A-Z]{2}\d{6,7})\s*(.*)$/i,
    );
    if (!match) continue;

    const compound = match[1].trim();
    if (isInvalidAgentCandidate(compound)) continue;
    if (/^(compound|cas|rtecs|other names?)\b/i.test(compound)) continue;

    rows.push({
      compound,
      cas: match[2],
      rtecs: match[3] ?? null,
      synonyms: splitSynonyms(match[4]),
    });
  }

  return rows;
};

const buildLimitExpression = (
  value: string,
  unit: string,
  note?: string | null,
): string => {
  const normalizedValue = value.replace('.', ',');
  const noteSuffix = note?.trim() ? ` ${note.trim()}` : '';
  return `${normalizedValue} ${unit}${noteSuffix}`.trim();
};

export const parseExposureLimitsTable = (
  text: string,
): ParsedExposureLimitRow[] => {
  const normalized = normalizeNmamTableText(text);
  const startMatch =
    normalized.match(/Table\s+3\.\s*Exposure Limits/i) ??
    normalized.match(/Exposure Limits\s*\(/i);

  if (startMatch?.index == null) return [];

  const slice = normalized.slice(startMatch.index);
  const endMatch = slice.match(
    /\n\(\d+\)\s+OSHA Recommendations|\nTable\s+4\b/i,
  );
  const tableText = endMatch?.index ? slice.slice(0, endMatch.index) : slice;

  const rows: ParsedExposureLimitRow[] = [];

  for (const rawLine of mergeBrokenTableLines(tableText)) {
    const line = rawLine.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!line) continue;

    const match = line.match(
      /^([A-Za-z][A-Za-z0-9\[\],.'()-]*)\s+(\d+(?:[.,]\d+)?)\s*(mg\/m3|ppm)\s*(\([^)]*\))?\s+(\d+(?:[.,]\d+)?)\s*(mg\/m3|ppm)\s*(\([^)]*\))?(?:\s*;\s*STEL\s+(\d+(?:[.,]\d+)?)\s*(mg\/m3|ppm)\s*(\([^)]*\))?)?$/i,
    );

    if (!match) continue;

    const compound = match[1].trim();
    if (isInvalidAgentCandidate(compound)) continue;
    if (/^compound\b/i.test(compound)) continue;

    rows.push({
      compound,
      oshaPel: buildLimitExpression(match[2], match[3], match[4]),
      nioshRel: buildLimitExpression(match[5], match[6], match[7]),
      nioshStel:
        match[8] && match[9]
          ? buildLimitExpression(match[8], match[9], match[10])
          : null,
    });
  }

  return rows;
};

export const createEmptyOccupationalLimits =
  (): HoMethodImportOccupationalLimitSuggestions => ({
    acgihTwa: field(null, 'low'),
    acgihStel: field(null, 'low'),
    acgihCeiling: field(null, 'low'),
    aihaWeel: field(null, 'low'),
    aihaWeelCeiling: field(null, 'low'),
    oshaPel: field(null, 'low'),
    oshaStel: field(null, 'low'),
    oshaCeiling: field(null, 'low'),
    nioshRel: field(null, 'low'),
    nioshStel: field(null, 'low'),
    nioshCeiling: field(null, 'low'),
    nioshIdlh: field(null, 'low'),
  });

export const buildOccupationalLimitsFromExposureRow = (
  row: ParsedExposureLimitRow,
): HoMethodImportOccupationalLimitSuggestions => ({
  ...createEmptyOccupationalLimits(),
  oshaPel: field(row.oshaPel, row.oshaPel ? 'high' : 'low', row.oshaPel),
  nioshRel: field(row.nioshRel, row.nioshRel ? 'high' : 'low', row.nioshRel),
  nioshStel: field(
    row.nioshStel,
    row.nioshStel ? 'medium' : 'low',
    row.nioshStel,
  ),
});

export const associateExposureLimitsWithCompounds = (
  compounds: ParsedCompoundTableRow[],
  exposureRows: ParsedExposureLimitRow[],
): Map<string, ParsedExposureLimitRow> => {
  const limitsByCompound = new Map<string, ParsedExposureLimitRow>();

  exposureRows.forEach((row) => {
    limitsByCompound.set(normalizeCompoundNameForMatch(row.compound), row);
  });

  return limitsByCompound;
};
