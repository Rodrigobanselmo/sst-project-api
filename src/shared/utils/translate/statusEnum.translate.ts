import { StatusEnum } from '@prisma/client';

export enum StatusEnumTranslated {
  ACTIVE = 'Ativo',
  PROGRESS = 'Progresso',
  INACTIVE = 'Inativo',
  PENDING = 'Pendente',
  CANCELED = 'Cancelado',
}

export const statusEnumTranslate = (portugueseValue: string) => {
  let keyValue = '';
  Object.entries(StatusEnumTranslated).forEach(([key, value]) => {
    if (portugueseValue == value) keyValue = StatusEnum[key];
  });

  return keyValue;
};
