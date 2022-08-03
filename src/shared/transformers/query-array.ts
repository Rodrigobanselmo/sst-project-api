import { TransformFnParams } from 'class-transformer';

export const QueryArray = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (typeof str === 'string') {
    return [str];
  }

  return str;
};
