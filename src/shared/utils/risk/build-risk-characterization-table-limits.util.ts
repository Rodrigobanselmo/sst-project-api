import { hasAcgihCeilingMarker } from './has-acgih-ceiling-marker.util';
import { normalizeOccupationalLimitValue } from './normalize-occupational-limit-value.util';
import { parseOccupationalLimitNumeric } from './parse-occupational-limit-numeric.util';

export type RiskCharacterizationLimitsSource = {
  nr15lt?: string | null;
  twa?: string | null;
  stel?: string | null;
  acgihCeiling?: string | null;
  oshaPel?: string | null;
  oshaStel?: string | null;
  oshaCeiling?: string | null;
  nioshRel?: string | null;
  nioshStel?: string | null;
  nioshCeiling?: string | null;
  aihaWeel?: string | null;
  aihaWeelCeiling?: string | null;
  ipvs?: string | null;
};

export type RiskCharacterizationTableLimitsDisplay = {
  nr15LtColumn: string;
  acgihTwaColumn: string;
  acgihStelColumn: string;
  ipvsColumn: string;
};

type LimitCandidate = {
  raw: string;
  label: string;
  isCeiling?: boolean;
};

const formatAcgihCeilingForTable = (value: string) => {
  if (hasAcgihCeilingMarker(value)) return value;
  return `C ${value}`;
};

const formatLimitWithSourceLabel = (
  raw: string,
  label: string,
  isCeiling = false,
) => {
  const isCeilingLimit = isCeiling || hasAcgihCeilingMarker(raw);

  if (isCeilingLimit) {
    if (hasAcgihCeilingMarker(raw)) {
      return `${raw} ${label}`;
    }

    return `C ${raw} ${label}`;
  }

  return `${raw} ${label}`;
};

const pickMostRestrictiveLimit = (candidates: LimitCandidate[]): string | null => {
  const validCandidates = candidates
    .map((candidate) => ({
      ...candidate,
      raw: normalizeOccupationalLimitValue(candidate.raw) ?? '',
    }))
    .filter((candidate) => candidate.raw);

  if (!validCandidates.length) return null;

  const withNumeric = validCandidates.map((candidate) => ({
    ...candidate,
    numeric: parseOccupationalLimitNumeric(candidate.raw),
  }));

  const comparable = withNumeric.filter((candidate) => candidate.numeric != null);

  if (comparable.length) {
    const mostRestrictive = comparable.reduce((best, current) =>
      current.numeric! < best.numeric! ? current : best,
    );

    return formatLimitWithSourceLabel(
      mostRestrictive.raw,
      mostRestrictive.label,
      mostRestrictive.isCeiling,
    );
  }

  const first = withNumeric[0];
  return formatLimitWithSourceLabel(first.raw, first.label, first.isCeiling);
};

export function buildRiskCharacterizationTableLimitsDisplay(
  risk: RiskCharacterizationLimitsSource,
): RiskCharacterizationTableLimitsDisplay {
  const twaRaw = normalizeOccupationalLimitValue(risk.twa);
  const stelRaw = normalizeOccupationalLimitValue(risk.stel);
  const dedicatedCeiling = normalizeOccupationalLimitValue(risk.acgihCeiling);

  const twaIsCeiling = twaRaw ? hasAcgihCeilingMarker(twaRaw) : false;
  const stelIsCeiling = stelRaw ? hasAcgihCeilingMarker(stelRaw) : false;

  const acgihTwa = twaRaw && !twaIsCeiling ? twaRaw : null;
  const acgihStel = stelRaw && !stelIsCeiling ? stelRaw : null;

  let acgihTwaColumn = '';

  if (acgihTwa) {
    acgihTwaColumn = acgihTwa;
  } else {
    const alternativeTwa = pickMostRestrictiveLimit([
      { raw: risk.oshaPel ?? '', label: 'OSHA PEL' },
      { raw: risk.nioshRel ?? '', label: 'NIOSH REL' },
      { raw: risk.aihaWeel ?? '', label: 'AIHA WEEL' },
    ]);

    acgihTwaColumn = alternativeTwa ?? '';
  }

  let acgihStelColumn = '';

  if (acgihStel) {
    acgihStelColumn = acgihStel;
  } else if (dedicatedCeiling) {
    acgihStelColumn = formatAcgihCeilingForTable(dedicatedCeiling);
  } else if (!dedicatedCeiling && stelIsCeiling && stelRaw) {
    acgihStelColumn = stelRaw;
  } else if (!dedicatedCeiling && twaIsCeiling && twaRaw) {
    acgihStelColumn = twaRaw;
  } else {
    const alternativeStel = pickMostRestrictiveLimit([
      { raw: risk.oshaStel ?? '', label: 'OSHA STEL' },
      { raw: risk.oshaCeiling ?? '', label: 'OSHA Ceiling', isCeiling: true },
      { raw: risk.nioshStel ?? '', label: 'NIOSH STEL' },
      { raw: risk.nioshCeiling ?? '', label: 'NIOSH Ceiling', isCeiling: true },
      { raw: risk.aihaWeelCeiling ?? '', label: 'AIHA WEEL-C', isCeiling: true },
    ]);

    acgihStelColumn = alternativeStel ?? '';
  }

  const nr15Lt = normalizeOccupationalLimitValue(risk.nr15lt);
  const ipvs = normalizeOccupationalLimitValue(risk.ipvs);

  return {
    nr15LtColumn: nr15Lt ?? '--',
    acgihTwaColumn,
    acgihStelColumn,
    ipvsColumn: ipvs ?? '--',
  };
}
