import { RiskModel } from '../models/risk.model';

export const FRPS_RISK_SUBTYPE_NAME = 'Psicossociais';

export function isFrpsRisk(risk: Pick<RiskModel, 'subTypes'>): boolean {
  return (
    risk.subTypes?.some((s) => s.sub_type.name === FRPS_RISK_SUBTYPE_NAME) ?? false
  );
}
