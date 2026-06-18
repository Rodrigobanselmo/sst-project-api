import { describe, expect, it } from '@jest/globals';

import { computeDocumentValidityEnd } from './compute-document-validity.util';

describe('computeDocumentValidityEnd', () => {
  it('adiciona anos e meses à data de criação', () => {
    const creation = new Date('2026-12-01T12:00:00.000Z');
    const end = computeDocumentValidityEnd(creation, 2, 0);

    expect(end.getFullYear()).toBe(2028);
    expect(end.getMonth()).toBe(creation.getMonth());
    expect(end.getDate()).toBe(creation.getDate());
  });

  it('adiciona apenas meses quando anos é zero', () => {
    const creation = new Date('2026-06-01T12:00:00.000Z');
    const end = computeDocumentValidityEnd(creation, 0, 6);

    expect(end.getFullYear()).toBe(2026);
    expect(end.getMonth()).toBe(creation.getMonth() + 6);
  });
});
