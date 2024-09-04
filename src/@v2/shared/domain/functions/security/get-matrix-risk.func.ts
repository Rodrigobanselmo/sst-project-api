import { matrixRisk } from "../../constants/security/matriz-risk.constant";

export const getMatrizRisk = (severity?: number, probability?: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
  if (!severity || !probability) return 0;

  if (probability >= 6) return 6;

  const value = matrixRisk[5 - probability][severity - 1];

  return value || 1;
};
