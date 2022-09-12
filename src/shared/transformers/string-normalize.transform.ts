import { TransformFnParams } from 'class-transformer';

export const StringNormalizeTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (str != '' && !str) return null;

  if (typeof str === 'string') {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9s]/g, '')
      .trim();
  }

  return null;
};
