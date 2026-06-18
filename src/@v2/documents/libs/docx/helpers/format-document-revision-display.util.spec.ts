import { describe, expect, it } from '@jest/globals';

import {
  formatRevisionDisplayLabel,
  formatRevisionDisplayNumber,
} from './format-document-revision-display.util';

describe('formatRevisionDisplayNumber', () => {
  it('numera série de teste 0.0.N a partir de 01', () => {
    expect(formatRevisionDisplayNumber('0.0.0')).toBe('01');
    expect(formatRevisionDisplayNumber('0.0.1')).toBe('02');
    expect(formatRevisionDisplayNumber('0.0.2')).toBe('03');
  });

  it('numera série oficial N.0.0 a partir de 01', () => {
    expect(formatRevisionDisplayNumber('1.0.0')).toBe('01');
    expect(formatRevisionDisplayNumber('2.0.0')).toBe('02');
    expect(formatRevisionDisplayNumber('3.0.0')).toBe('03');
  });
});

describe('formatRevisionDisplayLabel', () => {
  it('formata rótulo REV. com zero à esquerda', () => {
    expect(formatRevisionDisplayLabel('0.0.2')).toBe('REV. 03');
    expect(formatRevisionDisplayLabel('2.0.0')).toBe('REV. 02');
    expect(formatRevisionDisplayLabel('1.0.0')).toBe('REV. 01');
  });
});
