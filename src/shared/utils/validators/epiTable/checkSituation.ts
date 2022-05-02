/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkSituation = (value: any) => {
  const transformToString = String(value);

  if (transformToString.toLocaleLowerCase() === 'vencido') {
    return 'false';
  }

  return true;
};
