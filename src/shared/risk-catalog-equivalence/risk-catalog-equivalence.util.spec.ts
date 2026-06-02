import { describe, expect, it } from '@jest/globals';

import {
  buildAliasToCanonicalMapFromRows,
  excludeActiveAliasCatalogRows,
  getCanonicalOrSelfFromMap,
  resolveCanonicalIdFromMap,
} from './risk-catalog-equivalence.util';

describe('risk-catalog-equivalence.util', () => {
  it('resolveCanonicalIdFromMap retorna o próprio id sem equivalência', () => {
    const map = new Map<string, string>();
    expect(resolveCanonicalIdFromMap('a', map)).toBe('a');
  });

  it('resolveCanonicalIdFromMap retorna canonicalId para alias ativo', () => {
    const map = buildAliasToCanonicalMapFromRows([
      { aliasId: 'alias-1', canonicalId: 'canonical-1' },
    ]);
    expect(getCanonicalOrSelfFromMap('alias-1', map)).toBe('canonical-1');
  });

  it('resolveCanonicalIdFromMap interrompe em ciclo sem loop infinito', () => {
    const map = new Map([
      ['a', 'b'],
      ['b', 'a'],
    ]);
    expect(resolveCanonicalIdFromMap('a', map)).toBe('a');
  });

  it('excludeActiveAliasCatalogRows remove apenas aliases ativos', () => {
    const map = buildAliasToCanonicalMapFromRows([
      { aliasId: 'alias-1', canonicalId: 'canonical-1' },
    ]);
    const rows = [
      { id: 'canonical-1', name: 'Canônico' },
      { id: 'alias-1', name: 'Alias' },
      { id: 'other-1', name: 'Outro' },
    ];
    expect(excludeActiveAliasCatalogRows(rows, map)).toEqual([
      { id: 'canonical-1', name: 'Canônico' },
      { id: 'other-1', name: 'Outro' },
    ]);
  });
});
