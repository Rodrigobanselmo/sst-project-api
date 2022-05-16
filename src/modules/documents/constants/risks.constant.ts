import { RiskFactorsEnum } from '@prisma/client';

export const riskMap = {
  [RiskFactorsEnum.FIS]: {
    label: 'Físico',
  },
  [RiskFactorsEnum.QUI]: {
    label: 'Químico',
  },
  [RiskFactorsEnum.BIO]: {
    label: 'Biológico',
  },
  [RiskFactorsEnum.ACI]: {
    label: 'Acidente',
  },
  [RiskFactorsEnum.ERG]: {
    label: 'Ergonômico',
  },
};
