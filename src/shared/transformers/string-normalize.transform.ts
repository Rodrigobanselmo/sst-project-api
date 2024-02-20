import { TransformFnParams } from 'class-transformer';
import { normalizeToUpperString } from '../utils/normalizeString';

export const StringNormalizeUpperTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (str != '' && !str) return null;

  if (Array.isArray(str)) {
    return str.map((s) => normalizeToUpperString(s));
  }

  if (typeof str === 'string') {
    if (str.includes('??HIERARCHY_NAME??')) {
      const array = str.split('??HIERARCHY_NAME??').map(data => (data.includes('(') ? '(' : '') + normalizeToUpperString(data) + (data.includes(')') ? ')' : ''))
      array.splice(1, 0, '??HIERARCHY_NAME??')

      return array.filter(Boolean).join(' ');
    }

    return normalizeToUpperString(str);
  }

  return null;
};
