/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsXTrue = (value: any) => {
  const transformToString = String(value);
  if (!transformToString && transformToString !== '') {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (transformToString == 'VERDADEIRO') return 'true';
    if (transformToString == 'FALSO') return 'false';

    if (transformToString.length > 0 && transformToString.toLocaleLowerCase() != 'x') return false;
    return transformToString.length > 0 ? 'true' : 'false';
  }

  return false;
};
