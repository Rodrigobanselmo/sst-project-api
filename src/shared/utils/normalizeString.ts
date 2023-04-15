export const normalizeString = (str?: string): string => {
  if (!str) return str;

  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
};

export const normalizeToUpperString = (str?: string): string => {
  if (!str) return str;

  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toUpperCase()
    .trim();
};
