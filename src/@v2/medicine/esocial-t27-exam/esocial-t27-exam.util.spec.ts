import { describe, expect, it } from '@jest/globals';

import {
  ESOCIAL_T27_SEARCH_MIN_LENGTH,
  buildEsocialT27SourceIndicatorId,
  searchEsocialT27Catalog,
} from './esocial-t27-exam.util';

describe('esocial-t27-exam.util', () => {
  const catalog = [
    { code: '0005', name: '1,2-ciclo-hexanediol' },
    { code: '0100', name: 'Ácido etoxiacético' },
    { code: '0101', name: 'Ácido fórmico' },
  ];

  it('searchEsocialT27Catalog respects minimum length', () => {
    expect(searchEsocialT27Catalog(catalog, 'ac')).toEqual([]);
    expect(ESOCIAL_T27_SEARCH_MIN_LENGTH).toBe(3);
  });

  it('searchEsocialT27Catalog finds normalized matches', () => {
    const result = searchEsocialT27Catalog(catalog, 'acido etox');
    expect(result.map((item) => item.code)).toEqual(['0100']);
  });

  it('searchEsocialT27Catalog finds by T27 code', () => {
    const result = searchEsocialT27Catalog(catalog, '0100');
    expect(result.map((item) => item.code)).toEqual(['0100']);
  });

  it('searchEsocialT27Catalog finds by T27 code without leading zeros', () => {
    const result = searchEsocialT27Catalog(catalog, '100');
    expect(result.map((item) => item.code)).toEqual(['0100']);
  });

  it('buildEsocialT27SourceIndicatorId is stable', () => {
    expect(buildEsocialT27SourceIndicatorId('risk-1', 10)).toBe(
      'esocial-t27::risk-1::10',
    );
  });
});
