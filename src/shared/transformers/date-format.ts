import { TransformFnParams } from 'class-transformer';
import { dayjs } from '../providers/DateProvider/implementations/DayJSProvider';

export const DateFormat = (data: TransformFnParams, options: { onlyDate?: boolean } = { onlyDate: false }) => {
  const str = data.obj[data.key];
  if (!str) return;

  if (typeof str === 'string') {
    if (str === '') return;

    const splitStr = str.split('/');
    if (splitStr.length === 3) {
      const day = splitStr[0];
      const month = splitStr[1];
      const year = splitStr[2];

      if (day && month && year) {
        const date = dayjs(`${year}-${Number(month)}-${day}`)
          .tz('America/Sao_Paulo', true)
          .toDate();

        return date;
      }
    }

    if (options.onlyDate) {
      return dayjs(str).hour(0).minute(0).second(0).millisecond(0).toDate();
    }
    return dayjs(str).toDate();
  }

  return str;
};
