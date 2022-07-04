import { TransformFnParams } from 'class-transformer';

export const StringRemoveSpacesTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (str != '' && !str) return null;

  if (typeof str === 'string') {
    return str.replace(/\s+/g, ' ').trim();
  }

  return null;
};
