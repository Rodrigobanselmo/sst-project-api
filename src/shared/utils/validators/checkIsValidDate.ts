import { ExcelDateToJSDate } from '../ExcelDate';

export const checkIsValidDate = (value: any) => {
  if (typeof value === 'number') {
    return ExcelDateToJSDate(value);
  }

  const transformToString = String(value);

  if (!transformToString) {
    return false;
  }

  const slice = transformToString.replace(/'/, '').split('/');
  if (slice.length == 3) {
    const date = slice[1] + '/' + slice[2] + '/' + slice[2];
    return new Date(date);
  }

  return false;
};
