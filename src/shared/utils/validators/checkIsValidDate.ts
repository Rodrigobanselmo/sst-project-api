import { dayjs } from '../../../shared/providers/DateProvider/implementations/DayJSProvider';
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
    const day = slice[0];
    const month = slice[1];
    const year = slice[2];

    const date = dayjs(`${year}-${Number(month)}-${day}`)
      .tz('America/Sao_Paulo', true)
      .toDate();

    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
  }

  return false;
};
