import { TransformFnParams } from 'class-transformer';

export const StringCapitalizeParagraphTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (!str) return null;

  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return null;
};
