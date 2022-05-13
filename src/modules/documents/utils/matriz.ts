import { matrixRisk, matrixRiskMap } from '../constants/matrizRisk.constant';

export const getMatrizRisk = (severity?: number, probability?: number) => {
  if (!severity || !probability) return null;

  const value = matrixRisk[5 - probability][
    severity - 1
  ] as keyof typeof matrixRiskMap;

  return matrixRiskMap[value || 1];
};
