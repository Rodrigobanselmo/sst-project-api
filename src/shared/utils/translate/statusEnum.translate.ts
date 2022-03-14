import { StatusEnum } from '@prisma/client';

export enum StatusEnumTranslated {
  ACTIVE = 'Ativo',
  PROGRESS = 'Progresso',
  INACTIVE = 'Inativo',
  PENDING = 'Pendente',
  CANCELED = 'Cancelado',
}

export const statusEnumTranslateBrToUs = (portugueseValue: string) => {
  let keyValue = '';
  Object.entries(StatusEnumTranslated).forEach(([key, value]) => {
    if (portugueseValue == value) keyValue = StatusEnum[key];
  });

  return keyValue;
};

export const statusEnumTranslateUsToBr = (portugueseValue: string) => {
  let keyValue = '';
  Object.entries(StatusEnum).forEach(([key, value]) => {
    if (portugueseValue == value) keyValue = StatusEnumTranslated[key];
  });

  return keyValue;
};
