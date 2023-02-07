/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsBoolean = (value: any) => {
  const transformToString = String(value);

  if (!transformToString && transformToString !== '') {
    return false;
  }

  const strLower = transformToString.toLocaleLowerCase();

  if (typeof transformToString === 'string') {
    if (transformToString == 'VERDADEIRO') return 'true';
    if (transformToString == 'FALSO') return 'false';
    if (['sim', 's', 'verdadeito', 'v', 'x'].includes(strLower)) return 'true';
    if (['nao', 'não', 'n', 'falso', 'f'].includes(strLower)) return 'false';

    if (transformToString.length > 0) return false;
  }

  return false;
};
