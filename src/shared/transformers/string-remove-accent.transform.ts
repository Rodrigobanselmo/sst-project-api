import { TransformFnParams } from 'class-transformer';

export const StringRemoveAccentTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (str != '' && !str) return null;

  if (typeof str === 'string') {
    return str.replace(/[\u0300-\u036f]/g, '').trim();
  }

  return null;
};
