import { onlyNumbers } from '@brazilian-utils/brazilian-utils';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsValidCnae = (value: any) => {
  const transformToString = String(value);

  if (!transformToString) {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (onlyNumbers(transformToString).length == 7) return onlyNumbers(transformToString);
  }

  return false;
};
