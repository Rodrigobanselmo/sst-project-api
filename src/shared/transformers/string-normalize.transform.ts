import { TransformFnParams } from 'class-transformer';
import { normalizeToUpperString } from '../utils/normalizeString';

export const StringNormalizeUpperTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (str != '' && !str) return null;

  if (Array.isArray(str)) {
    return str.map((s) => normalizeToUpperString(s));
  }

  if (typeof str === 'string') {
    return normalizeToUpperString(str);
  }

  return null;
};
