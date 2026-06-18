/** Calcula a data final de vigência a partir da data de criação e do prazo. */
export function computeDocumentValidityEnd(
  creationDate: Date,
  years: number,
  months: number,
): Date {
  const result = new Date(creationDate);
  result.setFullYear(result.getFullYear() + years);
  result.setMonth(result.getMonth() + months);
  return result;
}
