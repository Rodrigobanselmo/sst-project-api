/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsString = (value: any) => {
  const transformToString = String(value);

  if (!transformToString && transformToString !== '') {
    return false;
  }

  if (typeof transformToString === 'string') {
    return transformToString;
  }

  return false;
};
