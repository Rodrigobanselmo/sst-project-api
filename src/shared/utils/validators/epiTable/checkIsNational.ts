/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsNational = (value: any) => {
  const transformToString = String(value);

  if (transformToString.toLocaleLowerCase() === 'importado') {
    return 'false';
  }

  return true;
};
