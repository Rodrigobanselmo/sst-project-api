/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsValidCid = (value: any) => {
  const transformToString = String(value);

  if (!transformToString) {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (transformToString.length == 3) return transformToString;
  }

  return false;
};
