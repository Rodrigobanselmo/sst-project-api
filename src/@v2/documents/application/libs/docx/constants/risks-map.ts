import { RiskFactorsEnum } from '@prisma/client';

export const riskMap = {
  [RiskFactorsEnum.FIS]: {
    label: 'Físico',
    order: 1,
  },
  [RiskFactorsEnum.QUI]: {
    label: 'Químico',
    order: 2,
  },
  [RiskFactorsEnum.BIO]: {
    label: 'Biológico',
    order: 3,
  },
  [RiskFactorsEnum.ERG]: {
    label: 'Ergonômico',
    order: 4,
  },
  [RiskFactorsEnum.ACI]: {
    label: 'Acidente',
    order: 5,
  },
};
