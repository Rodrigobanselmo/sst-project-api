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
  mgPerPpmFactor: string | null;
  limitUnit: 'ppm' | 'mg/m3' | null;
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
  /^(table\s*\d+|sampling|analyte|cas|synonyms|osha(?:\s*pel)?|niosh(?:\s*rel)?|properties|method|filter|shipment|sampler|blank|accuracy|range|technique|measurement|mw|rtecs|compound|other names?|substance)$/i;

export const referencesNmamTable = (
  value: string | null | undefined,
  tableNumber: number,
): boolean => {
  if (!value?.trim()) return false;

  return new RegExp(`\\btable\\s+${tableNumber}\\b`, 'i').test(value.trim());
};

export const normalizeNmamTableText = (text: string): string =>
  text
    .replace(/\u00a0/g, ' ')
    .replace(/mg\/m\s*3\s*\n\s*\)/gi, 'mg/m3)')
    .replace(/mg\/m\s*3/gi, 'mg/m3')
    .replace(/mg\/m³/gi, 'mg/m3')
    .replace(/\t+/g, '\t')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

export const isInvalidAgentCandidate = (name: string): boolean =>
  INVALID_AGENT_NAME_PATTERN.test(name.trim());

export const normalizeCompoundNameForMatch = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

export const compactCompoundNameForMatch = (value: string): string =>
  normalizeCompoundNameForMatch(value).replace(/[^a-z0-9]/g, '');

export const formatCompoundName = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export const formatDecimalPtBr = (value: string | number): string =>
  String(value).replace('.', ',');

const splitSynonyms = (raw?: string | null): string[] => {
  if (!raw?.trim()) return [];

  return raw
    .split(/[;\n]/)
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
      /^(compound|substance|cas|rtecs|other names|osha pel|niosh rel|\(alphabetically\)|\(\d+\)|table\s+\d+)/i.test(
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
      currentUnitMatches.length >= 2 ||
      /^\d+(?:[.,]\d+)?\s+\d+(?:[.,]\d+)?(?:\s+\d+(?:[.,]\d+)?)?(?:\s+\d+(?:[.,]\d+)?)?$/.test(
        current.split(/\s+/).slice(1).join(' '),
      );

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

const parseCompoundNameFromLines = (
  lines: string[],
): { compound: string; synonyms: string[] } => {
  const joined = lines.join(' ').replace(/\s+/g, ' ').trim();
  if (!joined) return { compound: '', synonyms: [] };

  const slashParts = joined
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);

  if (slashParts.length >= 2) {
    return {
      compound: slashParts[0],
      synonyms: slashParts.slice(1),
    };
  }

  if (lines.length >= 2) {
    return {
      compound: lines[0].trim(),
      synonyms: lines.slice(1).map((line) => line.trim()).filter(Boolean),
    };
  }

  return { compound: joined, synonyms: [] };
};

const isTableHeaderLine = (line: string) =>
  /^(compound|synonyms|cas|rtecs|empirical|molecular|boiling|melting|vapor|density|table\s+1|substance|osha|niosh|\(alphabetically\))/i.test(
    line.trim(),
  );

const isPropertyMetadataLine = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (isTableHeaderLine(trimmed)) return true;
  if (/^\(g\/ml\)|^\(mm hg\)|^\(kpa\)|^\(°c\)/i.test(trimmed)) return true;
  if (/^@/.test(trimmed)) return true;
  if (/°c/i.test(trimmed) && trimmed.length < 20) return true;
  if (/^[A-Z]{2}\d{6,7}$/i.test(trimmed)) return true;
  if (/^C\d.*H/i.test(trimmed)) return true;
  if (/^[\d.,\t\s-]+$/.test(trimmed)) return true;
  if (/^a physical and chemical property/i.test(trimmed)) return true;
  if (/^b vapor pressure/i.test(trimmed)) return true;
  return false;
};

const normalizeBrokenCompoundName = (value: string) =>
  value
    .replace(/\s+-\s+/g, '-')
    .replace(/-\s+/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

export const parseCompoundPropertiesTable = (
  text: string,
): ParsedCompoundTableRow[] => {
  const normalized = normalizeNmamTableText(text);
  const startMatch = normalized.match(
    /Table\s+1\.\s*Synonyms,?\s*Formulae/i,
  );

  if (startMatch?.index == null) return [];

  const slice = normalized.slice(startMatch.index);
  const endMatch = slice.match(/\nTable\s+2\./i);
  const tableText = endMatch?.index ? slice.slice(0, endMatch.index) : slice;
  const lines = tableText.split('\n').map((line) => line.trim());

  const rows: ParsedCompoundTableRow[] = [];
  const casLineRegex = /^(\d{2,7}-\d{2}-\d)$/;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!casLineRegex.test(line)) continue;

    const cas = line;
    const nameLines: string[] = [];

    for (let back = index - 1; back >= 0; back -= 1) {
      const previous = lines[back];
      if (!previous) break;
      if (isPropertyMetadataLine(previous)) break;
      if (/^(\d{2,7}-\d{2}-\d)$/.test(previous)) break;
      nameLines.unshift(previous);
    }

    const { compound, synonyms } = parseCompoundNameFromLines(nameLines);
    const normalizedCompound = normalizeBrokenCompoundName(compound);
    if (!normalizedCompound || isInvalidAgentCandidate(normalizedCompound)) continue;

    const rtecsLine = lines[index + 1];
    const rtecs = /^[A-Z]{2}\d{6,7}$/i.test(rtecsLine ?? '')
      ? rtecsLine
      : null;

    rows.push({
      compound: normalizedCompound,
      cas,
      rtecs,
      synonyms: synonyms.map(normalizeBrokenCompoundName),
    });
  }

  return rows;
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

export const parseNmamCompoundTable = (
  text: string,
): ParsedCompoundTableRow[] => {
  const candidates = [
    parseCompoundSynonymsTable(text),
    parseCompoundPropertiesTable(text),
  ];

  return candidates.reduce(
    (best, current) => (current.length > best.length ? current : best),
    [] as ParsedCompoundTableRow[],
  );
};

const buildLimitExpression = (
  value: string,
  unit: string,
  note?: string | null,
): string => {
  const normalizedValue = formatDecimalPtBr(value);
  const noteSuffix = note?.trim() ? ` ${note.trim()}` : '';
  return `${normalizedValue} ${unit}${noteSuffix}`.trim();
};

const parsePpmLimitNumbers = (numbersPart: string) => {
  const nums =
    numbersPart.match(/\d+(?:[.,]\d+)?/g)?.map((value) => value.replace(',', '.')) ??
    [];

  if (!nums.length) {
    return {
      oshaPel: null,
      nioshRel: null,
      nioshStel: null,
      mgPerPpmFactor: null,
    };
  }

  const last = parseFloat(nums[nums.length - 1] ?? '');
  const lastIsFactor =
    nums.length >= 3 &&
    Number.isFinite(last) &&
    last < 20 &&
    (nums[nums.length - 1]?.includes('.') || nums[nums.length - 1]?.includes(','));

  if (nums.length === 1) {
    if (lastIsFactor || last < 20) {
      return {
        oshaPel: null,
        nioshRel: null,
        nioshStel: null,
        mgPerPpmFactor: nums[0],
      };
    }

    return {
      oshaPel: buildLimitExpression(nums[0], 'ppm'),
      nioshRel: null,
      nioshStel: null,
      mgPerPpmFactor: null,
    };
  }

  if (nums.length === 2) {
    return {
      oshaPel: buildLimitExpression(nums[0], 'ppm'),
      nioshRel: buildLimitExpression(nums[1], 'ppm'),
      nioshStel: null,
      mgPerPpmFactor: null,
    };
  }

  if (nums.length === 3 && lastIsFactor) {
    return {
      oshaPel: buildLimitExpression(nums[0], 'ppm'),
      nioshRel: buildLimitExpression(nums[1], 'ppm'),
      nioshStel: null,
      mgPerPpmFactor: nums[2],
    };
  }

  if (nums.length === 3) {
    return {
      oshaPel: buildLimitExpression(nums[0], 'ppm'),
      nioshRel: buildLimitExpression(nums[1], 'ppm'),
      nioshStel: buildLimitExpression(nums[2], 'ppm'),
      mgPerPpmFactor: null,
    };
  }

  return {
    oshaPel: buildLimitExpression(nums[0], 'ppm'),
    nioshRel: buildLimitExpression(nums[1], 'ppm'),
    nioshStel: buildLimitExpression(nums[2], 'ppm'),
    mgPerPpmFactor: nums[3] ?? null,
  };
};

export const parsePpmExposureLimitsTable = (
  text: string,
): ParsedExposureLimitRow[] => {
  const normalized = normalizeNmamTableText(text);
  const startMatch = normalized.match(
    /Table\s+2\.\s*Occupational exposure limits/i,
  );

  if (startMatch?.index == null) return [];

  const slice = normalized.slice(startMatch.index);
  const endMatch = slice.match(/\nTable\s+3\.|\n-- \d+ of \d+ --/i);
  const tableText = endMatch?.index ? slice.slice(0, endMatch.index) : slice;
  const rows: ParsedExposureLimitRow[] = [];

  for (const rawLine of tableText.split('\n')) {
    const line = rawLine.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!line) continue;
    if (/^table\s+2/i.test(line)) continue;
    if (/^substance\b/i.test(line)) continue;
    if (/^twa\b/i.test(line)) continue;
    if (/^--\s+\d+\s+of/i.test(line)) continue;
    if (/^ketones:/i.test(line)) continue;
    if (/^niosh manual/i.test(line)) continue;
    if (/^mg\/m3 per ppm/i.test(line)) continue;

    const match = line.match(
      /^([A-Za-z0-9][A-Za-z0-9\[\],.'()\/\s-]*?)\s+([\d.,\s]+)$/,
    );
    if (!match) continue;

    const compound = normalizeBrokenCompoundName(match[1].trim());
    if (isInvalidAgentCandidate(compound)) continue;
    if (/^substance\b/i.test(compound)) continue;

    const limits = parsePpmLimitNumbers(match[2]);
    if (
      !limits.oshaPel &&
      !limits.nioshRel &&
      !limits.nioshStel &&
      !limits.mgPerPpmFactor
    ) {
      continue;
    }

    rows.push({
      compound,
      oshaPel: limits.oshaPel,
      nioshRel: limits.nioshRel,
      nioshStel: limits.nioshStel,
      mgPerPpmFactor: limits.mgPerPpmFactor,
      limitUnit: 'ppm',
    });
  }

  return rows;
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
      mgPerPpmFactor: null,
      limitUnit: match[3]?.toLowerCase().includes('ppm') ? 'ppm' : 'mg/m3',
    });
  }

  return rows;
};

const mergeExposureRows = (
  current: ParsedExposureLimitRow,
  incoming: ParsedExposureLimitRow,
): ParsedExposureLimitRow => ({
  compound: current.compound || incoming.compound,
  oshaPel: current.oshaPel ?? incoming.oshaPel,
  nioshRel: current.nioshRel ?? incoming.nioshRel,
  nioshStel: current.nioshStel ?? incoming.nioshStel,
  mgPerPpmFactor: current.mgPerPpmFactor ?? incoming.mgPerPpmFactor,
  limitUnit: current.limitUnit ?? incoming.limitUnit,
});

export const parseNmamExposureLimitsTable = (
  text: string,
): ParsedExposureLimitRow[] => {
  const merged = new Map<string, ParsedExposureLimitRow>();

  [...parsePpmExposureLimitsTable(text), ...parseExposureLimitsTable(text)].forEach(
    (row) => {
      const key = compactCompoundNameForMatch(row.compound);
      const existing = merged.get(key);
      merged.set(key, existing ? mergeExposureRows(existing, row) : row);
    },
  );

  return [...merged.values()];
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

export const buildAgentTechnicalNotesFromExposureRow = (
  row?: ParsedExposureLimitRow | null,
): string[] => {
  if (!row?.mgPerPpmFactor) return [];

  return [
    `Fator mg/m³ por ppm: ${formatDecimalPtBr(row.mgPerPpmFactor)}`,
  ];
};

export const findExposureLimitForCompound = (
  compound: string,
  exposureRows: ParsedExposureLimitRow[],
): ParsedExposureLimitRow | undefined => {
  const exactKey = normalizeCompoundNameForMatch(compound);
  const compactKey = compactCompoundNameForMatch(compound);

  return exposureRows.find((row) => {
    const rowExact = normalizeCompoundNameForMatch(row.compound);
    const rowCompact = compactCompoundNameForMatch(row.compound);
    return rowExact === exactKey || rowCompact === compactKey;
  });
};

export const associateExposureLimitsWithCompounds = (
  compounds: ParsedCompoundTableRow[],
  exposureRows: ParsedExposureLimitRow[],
): Map<string, ParsedExposureLimitRow> => {
  const limitsByCompound = new Map<string, ParsedExposureLimitRow>();

  compounds.forEach((compoundRow) => {
    const limits = findExposureLimitForCompound(
      compoundRow.compound,
      exposureRows,
    );
    if (limits) {
      limitsByCompound.set(
        normalizeCompoundNameForMatch(compoundRow.compound),
        limits,
      );
    }
  });

  return limitsByCompound;
};
