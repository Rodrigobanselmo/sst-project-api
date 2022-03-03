import { isValidCNPJ, formatCNPJ } from '@brazilian-utils/brazilian-utils';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsValidCnpj = (value: any) => {
  const transformToString = String(value);

  if (!transformToString) {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (isValidCNPJ(transformToString)) return formatCNPJ(transformToString);
  }

  return false;
};
