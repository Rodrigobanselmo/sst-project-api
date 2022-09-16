import { TransformFnParams } from 'class-transformer';
import { dayjs } from '../providers/DateProvider/implementations/DayJSProvider';

export const DateFormat = (
  data: TransformFnParams,
  options: { onlyDate?: boolean } = { onlyDate: true },
) => {
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
        const date = new Date(Number(year), Number(month) - 1, Number(day));
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
