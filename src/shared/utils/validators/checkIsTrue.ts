/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsTrue = (value: any) => {
  const transformToString = String(value);

  if (transformToString == '') return 'true';
  if (!transformToString) return 'true';
  return null;

  if (!transformToString && transformToString !== '') {
    return false;
  }

  if (typeof transformToString === 'string') {
    // if (transformToString != 'VERDADEIRO' && transformToString != 'FALSO') return false;
    if (transformToString == 'VERDADEIRO') return 'true';
    if (transformToString == 'FALSO') return 'false';
  }

  return false;
};
