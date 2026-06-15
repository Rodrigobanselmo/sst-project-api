import { describe, expect, it } from '@jest/globals';

import { matchHoMethodImportCatalogItem } from './ho-method-import-ai-review-catalog-match.util';

describe('ho-method-import-ai-review-catalog-match.util', () => {
  const solvents = [
    { id: 'sol-1', name: 'Diclorometano', synonyms: ['CH2Cl2', 'Dichloromethane'] },
    { id: 'sol-2', name: 'Dissulfeto de carbono', synonyms: ['CS2'] },
    { id: 'sol-3', name: 'Metanol', synonyms: ['Methanol'] },
  ];

  it('matches solvent by chemical synonym', () => {
    expect(matchHoMethodImportCatalogItem('CH2Cl2', solvents)?.id).toBe('sol-1');
  });

  it('matches solvent by translated name', () => {
    expect(matchHoMethodImportCatalogItem('dissulfeto de carbono', solvents)?.id).toBe(
      'sol-2',
    );
  });

  it('returns null for ambiguous or unknown solvent', () => {
    expect(matchHoMethodImportCatalogItem('solvente desconhecido', solvents)).toBeNull();
  });
});
