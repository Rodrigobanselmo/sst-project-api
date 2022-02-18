/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsEnum = (value: any) => {
  // TODO
  const transformToNumber = String(value);

  if (!transformToNumber) {
    return false;
  }

  if (typeof value === 'string') {
    return transformToNumber;
  }

  return false;
};
