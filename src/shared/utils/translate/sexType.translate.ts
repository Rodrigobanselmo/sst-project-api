import { SexTypeEnum } from '@prisma/client';

export enum SexTypeEnumTranslated {
  M = 'M',
  F = 'F',
}

export enum SexTypeEnumNotes {
  M = 'Masculino',
  F = 'Feminino',
}

export const SexTypeEnumTranslatedList = [SexTypeEnumTranslated.M, SexTypeEnumTranslated.F];

export const SexTypeEnumTranslatedNotes = Object.entries(SexTypeEnumTranslated).map(([key, value]) => `${value} ou ${SexTypeEnumNotes[key]}`);

export const SexTypeEnumTranslateBrToUs = (portugueseValue: string) => {
  let keyValue = '';
  Object.entries(SexTypeEnumTranslated).forEach(([key, value]) => {
    if (portugueseValue.substring(0, 1).toUpperCase() == value) keyValue = SexTypeEnum[key];
  });

  return keyValue;
};

export const SexTypeEnumTranslateUsToBr = (portugueseValue: string) => {
  let keyValue = '';
  Object.entries(SexTypeEnum).forEach(([key, value]) => {
    if (portugueseValue == value) keyValue = SexTypeEnumTranslated[key];
  });

  return keyValue;
};
