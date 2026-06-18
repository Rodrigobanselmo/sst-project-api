import { describe, expect, it } from '@jest/globals';

import {
  filterOfficialVersions,
  filterOfficialVersionsBySeries,
  filterUnofficialVersions,
  getNextOfficialVersion,
  getNextUnofficialVersion,
  isOfficialDocumentVersion,
  isRevisionControlledDocumentVersion,
  isUnofficialDocumentVersion,
  normalizeDocumentVersion,
} from './is-revision-controlled-version.func';

describe('isUnofficialDocumentVersion', () => {
  it('identifica versões de teste 0.0.N', () => {
    expect(isUnofficialDocumentVersion('0.0.0')).toBe(true);
    expect(isUnofficialDocumentVersion('0.0.1')).toBe(true);
    expect(isUnofficialDocumentVersion('0.0.12')).toBe(true);
  });

  it('exclui versões fora da família de teste', () => {
    expect(isUnofficialDocumentVersion('0.1.0')).toBe(false);
    expect(isUnofficialDocumentVersion('1.0.0')).toBe(false);
    expect(isUnofficialDocumentVersion('1.0.1')).toBe(false);
  });
});

describe('isOfficialDocumentVersion', () => {
  it('identifica versões oficiais N.0.0 com N >= 1', () => {
    expect(isOfficialDocumentVersion('1.0.0')).toBe(true);
    expect(isOfficialDocumentVersion('2.0.0')).toBe(true);
    expect(isOfficialDocumentVersion('+ 1.0.0')).toBe(true);
  });

  it('exclui versões de teste e intermediárias', () => {
    expect(isOfficialDocumentVersion('0.0.0')).toBe(false);
    expect(isOfficialDocumentVersion('0.0.1')).toBe(false);
    expect(isOfficialDocumentVersion('0.1.0')).toBe(false);
    expect(isOfficialDocumentVersion('1.0.1')).toBe(false);
    expect(isOfficialDocumentVersion('1.1.0')).toBe(false);
  });
});

describe('isRevisionControlledDocumentVersion', () => {
  it('é alias de isOfficialDocumentVersion', () => {
    expect(isRevisionControlledDocumentVersion('1.0.0')).toBe(true);
    expect(isRevisionControlledDocumentVersion('0.0.1')).toBe(false);
  });
});

describe('filterOfficialVersions', () => {
  it('remove versões de teste do histórico oficial', () => {
    const versions = [
      { version: '0.0.0' },
      { version: '0.0.1' },
      { version: '1.0.0' },
      { version: '2.0.0' },
    ];

    expect(filterOfficialVersions(versions)).toEqual([
      { version: '1.0.0' },
      { version: '2.0.0' },
    ]);
  });
});

describe('filterOfficialVersionsBySeries', () => {
  it('isola versões oficiais por série', () => {
    const versions = [
      { version: '1.0.0', officialRevisionSeries: 1 },
      { version: '2.0.0', officialRevisionSeries: 1 },
      { version: '1.0.0', officialRevisionSeries: 2 },
    ];

    expect(filterOfficialVersionsBySeries(versions, 1)).toEqual([
      { version: '1.0.0', officialRevisionSeries: 1 },
      { version: '2.0.0', officialRevisionSeries: 1 },
    ]);
  });
});

describe('filterUnofficialVersions', () => {
  it('mantém somente a série 0.0.x', () => {
    const versions = [
      { version: '0.0.0' },
      { version: '0.0.1' },
      { version: '1.0.0' },
    ];

    expect(filterUnofficialVersions(versions)).toEqual([
      { version: '0.0.0' },
      { version: '0.0.1' },
    ]);
  });
});

describe('getNextUnofficialVersion', () => {
  it('sugere 0.0.0 quando não há versão de teste', () => {
    expect(getNextUnofficialVersion([])).toBe('0.0.0');
    expect(getNextUnofficialVersion([{ version: '1.0.0' }])).toBe('0.0.0');
  });

  it('incrementa o patch da série 0.0.x', () => {
    expect(
      getNextUnofficialVersion([{ version: '0.0.0' }, { version: '0.0.1' }]),
    ).toBe('0.0.2');
  });
});

describe('getNextOfficialVersion', () => {
  it('sugere 1.0.0 quando não há versão oficial na série ativa', () => {
    expect(getNextOfficialVersion([], 1)).toBe('1.0.0');
    expect(getNextOfficialVersion([{ version: '0.0.1' }], 1)).toBe('1.0.0');
    expect(
      getNextOfficialVersion(
        [{ version: '1.0.0', officialRevisionSeries: 1 }],
        2,
      ),
    ).toBe('1.0.0');
  });

  it('incrementa o major da série oficial ativa', () => {
    expect(
      getNextOfficialVersion(
        [
          { version: '1.0.0', officialRevisionSeries: 1 },
          { version: '2.0.0', officialRevisionSeries: 1 },
        ],
        1,
      ),
    ).toBe('3.0.0');
  });
});

describe('normalizeDocumentVersion', () => {
  it('remove prefixo do seletor', () => {
    expect(normalizeDocumentVersion('+ 1.0.0')).toBe('1.0.0');
  });
});
