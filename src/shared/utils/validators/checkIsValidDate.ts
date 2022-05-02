/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsValidDate = (value: any) => {
  const transformToString = String(value);

  if (!transformToString) {
    return false;
  }

  const slice = transformToString.replace(/'/, '').split('/');
  if (slice.length == 3) {
    const date = slice[0] + '/' + slice[1] + '/' + slice[2];
    return new Date(date);
  }

  return false;
};
