import dayjs from 'dayjs';

export function formatVisitDateForDocument(visitDate?: Date | string | null): string {
  if (visitDate == null || visitDate === '') return '';

  const parsed = dayjs(visitDate);
  if (!parsed.isValid()) return '';

  return parsed.format('DD/MM/YYYY');
}
