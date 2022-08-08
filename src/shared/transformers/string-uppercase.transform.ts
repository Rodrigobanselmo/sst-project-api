import { TransformFnParams } from 'class-transformer';

export const StringUppercaseTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (Array.isArray(str)) {
    return str.map((s) => s.toUpperCase());
  }

  if (str != '' && !str) return null;

  if (typeof str === 'string') {
    return str.toUpperCase();
  }

  return null;
};
