import { TransformFnParams } from 'class-transformer';

export const NumberFormat = (data: TransformFnParams) => {
  const num = data.obj[data.key];

  if (!num) return null;

  const numType = typeof num;

  if (numType === 'string' || numType === 'number') {
    const parts = num.toString().split('.');

    if (parts.length > 2) return null;

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  }

  return null;
};
