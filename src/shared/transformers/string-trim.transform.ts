import { TransformFnParams } from 'class-transformer';

export const StringTrimTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (Array.isArray(str)) {
    return str.map((s) => (typeof s === 'string' ? s.trim() : s));
  }

  if (str != '' && !str) return null;

  if (typeof str === 'string') {
    return str.trim();
  }

  return null;
};
