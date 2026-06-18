import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';

/** Formata vigência com dia quando a data completa está disponível no banco. */
export const formatDocumentValidityDate = (date: Date): string =>
  dateUtils(date).format('DD/MM/YYYY');

export const formatDocumentValidityRange = (
  validityStart: Date | null,
  validityEnd: Date | null,
): string => {
  if (!validityStart || !validityEnd) return '';
  return `${formatDocumentValidityDate(validityStart)} a ${formatDocumentValidityDate(validityEnd)}`;
};
