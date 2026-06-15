import { Transform } from 'class-transformer';

export const transformOptionalNumber = (value: unknown): number | null | undefined => {
  if (value == null || value === '') return value === '' ? null : undefined;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const normalized = value
      .trim()
      .replace(/\s+/g, '')
      .replace(/ppm|mg\/m³|mg\/m3|µg\/m³|µg\/m3/gi, '')
      .replace(',', '.');

    if (!normalized || normalized === '.' || normalized === '-.') return null;

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const TransformOptionalNumber = () =>
  Transform(({ value }) => transformOptionalNumber(value));
