import { isValidCNPJ, onlyNumbers } from '@brazilian-utils/brazilian-utils';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsValidCnpj = (value: any) => {
  const transformToString = String(value);

  if (!transformToString) {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (isValidCNPJ(transformToString.padStart(14, '0')))
      return onlyNumbers(transformToString.padStart(14, '0'));
  }

  return false;
};
