import { hasAcgihCeilingMarker } from './has-acgih-ceiling-marker.util';
import { normalizeOccupationalLimitValue } from './normalize-occupational-limit-value.util';

export type RiskOccupationalLimitsSource = {
  twa?: string | null;
  stel?: string | null;
  acgihCeiling?: string | null;
};

export type RiskOccupationalLimitsDisplay = {
  acgihTwa: string | null;
  acgihStel: string | null;
  acgihCeiling: string | null;
  documentAcgihTwa: string | null;
  documentAcgihStel: string | null;
};

export function buildRiskOccupationalLimitsDisplay(
  risk: RiskOccupationalLimitsSource,
): RiskOccupationalLimitsDisplay {
  const twaRaw = normalizeOccupationalLimitValue(risk.twa);
  const stelRaw = normalizeOccupationalLimitValue(risk.stel);
  const dedicatedCeiling = normalizeOccupationalLimitValue(risk.acgihCeiling);

  const twaIsCeiling = twaRaw ? hasAcgihCeilingMarker(twaRaw) : false;
  const stelIsCeiling = stelRaw ? hasAcgihCeilingMarker(stelRaw) : false;

  const legacyCeilingSource =
    [stelRaw, twaRaw].find((value) => value && hasAcgihCeilingMarker(value)) ??
    null;

  let acgihCeiling: string | null = dedicatedCeiling;

  if (!acgihCeiling && legacyCeilingSource) {
    acgihCeiling = legacyCeilingSource;
  }

  const acgihTwa = twaRaw && !twaIsCeiling ? twaRaw : null;
  const acgihStel = stelRaw && !stelIsCeiling ? stelRaw : null;

  const documentAcgihTwa = acgihTwa;
  const documentAcgihStel = acgihStel ?? acgihCeiling;

  return {
    acgihTwa,
    acgihStel,
    acgihCeiling,
    documentAcgihTwa,
    documentAcgihStel,
  };
}
