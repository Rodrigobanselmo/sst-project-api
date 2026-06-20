import { describe, expect, it } from '@jest/globals';

import { formatVisitDateForDocument } from './format-visit-date.util';

describe('formatVisitDateForDocument', () => {
  it('formats a valid date in Brazilian format', () => {
    expect(formatVisitDateForDocument(new Date('2025-12-01T12:00:00.000Z'))).toBe('01/12/2025');
  });

  it('returns empty string for null, undefined and empty values', () => {
    expect(formatVisitDateForDocument(null)).toBe('');
    expect(formatVisitDateForDocument(undefined)).toBe('');
    expect(formatVisitDateForDocument('')).toBe('');
  });

  it('returns empty string for invalid dates', () => {
    expect(formatVisitDateForDocument('Invalid Date')).toBe('');
    expect(formatVisitDateForDocument(new Date('invalid'))).toBe('');
  });
});
