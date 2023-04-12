import { ExcelDateToJSDate } from '../ExcelDate';

export const checkIsValidDate = (value: any) => {
  if (typeof value === 'number') {
    return ExcelDateToJSDate(value);
  }

  const transformToString = String(value).trim();

  if (!transformToString) {
    return false;
  }

  const slice = transformToString.replace(/'/, '').split('/');

  if (slice.length == 3) {
    const dateString = slice[1] + '/' + slice[0] + '/' + slice[2];
    const date = new Date(dateString);

    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
  }

  return false;
};
