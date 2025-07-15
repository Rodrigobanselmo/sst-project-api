import { RiskFactorsEnum } from '@prisma/client';

export enum RiskFactorsEnumTranslated {
  FIS = 'FIS',
  QUI = 'QUI',
  BIO = 'BIO',
  ACI = 'ACI',
  ERG = 'ERG',
  OUTROS = 'OUTROS',
}

export enum RiskFactorsEnumNotes {
  FIS = 'Físico',
  QUI = 'Químico',
  BIO = 'Biológico',
  ACI = 'Acidente',
  ERG = 'Ergonômico',
  OUTROS = 'Outros',
}

export const RiskFactorsEnumTranslatedList = [
  RiskFactorsEnumTranslated.FIS,
  RiskFactorsEnumTranslated.QUI,
  RiskFactorsEnumTranslated.BIO,
  RiskFactorsEnumTranslated.ACI,
  RiskFactorsEnumTranslated.ERG,
  RiskFactorsEnumTranslated.OUTROS,
];

export const RiskFactorsEnumTranslatedNotes = Object.entries(RiskFactorsEnumTranslated).map(([key, value]) => `${value}: ${RiskFactorsEnumNotes[key]}`);

export const RiskFactorsEnumTranslateBrToUs = (portugueseValue: string) => {
  let keyValue = '';
  Object.entries(RiskFactorsEnumTranslated).forEach(([key, value]) => {
    if (portugueseValue.substring(0, 3).toUpperCase() === value) {
      keyValue = RiskFactorsEnum[key];
    }
  });

  return keyValue;
};

export const RiskFactorsEnumTranslateUsToBr = (englishValue: string) => {
  let keyValue = '';
  Object.entries(RiskFactorsEnum).forEach(([key, value]) => {
    if (englishValue === value) {
      keyValue = RiskFactorsEnumTranslated[key];
    }
  });

  return keyValue;
};
