import { TransformFnParams } from 'class-transformer';

export const QueryArray = (data: TransformFnParams, transformValue?: (v: string) => any) => {
  const str = data.obj[data.key];

  if (typeof str === 'string') {
    if (transformValue) return [transformValue(str)];
    return [str];
  }

  return str;
};

/** Normalizes query params like `n=1`, `n=1&n=2`, comma lists, or JSON arrays into integers. */
export const QueryIntArray = ({ obj, key }: TransformFnParams): number[] | undefined => {
  const raw = obj[key];
  if (raw === undefined || raw === null || raw === '') return undefined;

  const pieces: unknown[] = Array.isArray(raw)
    ? raw
    : typeof raw === 'string'
      ? raw.split(',').map((s) => s.trim()).filter(Boolean)
      : [raw];

  const nums = pieces
    .map((v) => (typeof v === 'number' ? v : parseInt(String(v), 10)))
    .filter((n) => Number.isInteger(n));

  return nums.length ? nums : undefined;
};
