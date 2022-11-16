import { ExamHistoryTypeEnum } from '@prisma/client';

export enum ExamHistoryTypeEnumTranslated {
  ADMI = 'ADM',
  PERI = 'PER',
  RETU = 'RET',
  CHAN = 'MUD',
  DEMI = 'DEM',
}

export enum ExamHistoryTypeEnumNotes {
  ADMI = 'Admissional',
  PERI = 'Períodico',
  RETU = 'Retorno ao trabalho',
  CHAN = 'Mudança de risco ocupacional',
  DEMI = 'Demissional',
}

export const examHistoryTypeEnumTranslatedList = [
  ExamHistoryTypeEnumTranslated.ADMI,
  ExamHistoryTypeEnumTranslated.PERI,
  ExamHistoryTypeEnumTranslated.RETU,
  ExamHistoryTypeEnumTranslated.CHAN,
  ExamHistoryTypeEnumTranslated.DEMI,
];

export const examHistoryTypeEnumTranslatedNotes = Object.entries(ExamHistoryTypeEnumTranslated).map(([key, value]) => `${value} : ${ExamHistoryTypeEnumNotes[key]}`);

export const ExamHistoryTypeEnumTranslateBrToUs = (portugueseValue: string) => {
  let keyValue = '';
  Object.entries(ExamHistoryTypeEnumTranslated).forEach(([key, value]) => {
    if (portugueseValue == value) keyValue = ExamHistoryTypeEnum[key];
  });

  return keyValue;
};

export const ExamHistoryTypeEnumTranslateUsToBr = (portugueseValue: string) => {
  let keyValue = '';
  Object.entries(ExamHistoryTypeEnum).forEach(([key, value]) => {
    if (portugueseValue == value) keyValue = ExamHistoryTypeEnumTranslated[key];
  });

  return keyValue;
};
