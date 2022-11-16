import { TransformFnParams } from 'class-transformer';

export const QueryArray = (data: TransformFnParams, transformValue?: (v: string) => any) => {
  const str = data.obj[data.key];

  if (typeof str === 'string') {
    if (transformValue) return [transformValue(str)];
    return [str];
  }

  return str;
};
