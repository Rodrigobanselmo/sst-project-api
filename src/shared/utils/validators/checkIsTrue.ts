/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsTrue = (value: any) => {
  const transformToString = String(value);

  if (!transformToString && transformToString !== '') {
    return false;
  }

  if (typeof transformToString === 'string') {
    if (transformToString === 'FALSE') return false; //! not working when importing from excel
    return true;
  }

  return false;
};
