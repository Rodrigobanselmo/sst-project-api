import { isValidCEP, onlyNumbers } from '@brazilian-utils/brazilian-utils';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsValidCep = (value: any) => {
  const transformToString = String(value);

  if (!transformToString) {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (isValidCEP(transformToString)) return onlyNumbers(transformToString);
  }

  return false;
};
