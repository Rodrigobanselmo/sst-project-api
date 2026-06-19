import { describe, expect, it } from '@jest/globals';

import {
  buildDocumentGenerationSnapshot,
  parseDocumentGenerationSnapshot,
} from '@/@v2/documents/domain/types/document-generation-snapshot.type';

describe('document generation snapshot', () => {
  it('builds snapshot with filters and model metadata', () => {
    const snapshot = buildDocumentGenerationSnapshot({
      ghoIds: ['gho-1', 'gho-2'],
      filterViewType: 'ENVIRONMENT',
      selectedFilters: [{ id: 'gho-1', name: 'Ambiente A' }],
      modelId: 10,
      coordinatorBy: 'Coordenador',
      legalResponsibleBy: 'Responsável',
      json: { source: 'Fonte' },
      professionalSignatures: [{ professionalId: 1, isSigner: true }],
    });

    expect(snapshot).toEqual({
      ghoIds: ['gho-1', 'gho-2'],
      filterViewType: 'ENVIRONMENT',
      selectedFilters: [{ id: 'gho-1', name: 'Ambiente A' }],
      modelId: 10,
      coordinatorBy: 'Coordenador',
      legalResponsibleBy: 'Responsável',
      json: { source: 'Fonte' },
      professionalSignatures: [{ professionalId: 1, isSigner: true }],
    });
  });

  it('parses nullable snapshot safely', () => {
    expect(parseDocumentGenerationSnapshot(null)).toBeNull();
    expect(parseDocumentGenerationSnapshot({ ghoIds: ['a'] })?.ghoIds).toEqual([
      'a',
    ]);
  });
});
