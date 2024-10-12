import { TransformFnParams } from 'class-transformer';

export const NumberTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (str == 'null') return null;
  if (Number.isNaN(Number(str))) return str;


  return Number(str);
};
