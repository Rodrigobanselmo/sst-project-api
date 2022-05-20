import { TransformFnParams } from 'class-transformer';

export const DateFormat = (data: TransformFnParams) => {
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
    return new Date(str);
  }

  return str;
};
