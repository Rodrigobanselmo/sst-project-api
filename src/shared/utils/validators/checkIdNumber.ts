/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsNumber = (value: any) => {
  const transformToNumber = Number(value);

  if (!transformToNumber && transformToNumber !== 0) {
    return false;
  }

  if (typeof transformToNumber === 'number') {
    return transformToNumber;
  }

  return false;
};
