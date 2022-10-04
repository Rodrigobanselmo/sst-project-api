/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsTrue = (value: any) => {
  const transformToString = String(value);
  if (!transformToString && transformToString !== '') {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (transformToString != 'VERDADEIRO' && transformToString != 'FALSO')
      return false;
    return transformToString == 'VERDADEIRO' ? 'true' : 'false';
  }

  return false;
};
