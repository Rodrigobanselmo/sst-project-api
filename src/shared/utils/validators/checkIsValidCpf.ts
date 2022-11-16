import { isValidCPF, onlyNumbers } from '@brazilian-utils/brazilian-utils';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsValidCpf = (value: any) => {
  const transformToString = String(value);

  if (!transformToString) {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (isValidCPF(transformToString.padStart(11, '0'))) return onlyNumbers(transformToString.padStart(11, '0'));
  }

  return false;
};
