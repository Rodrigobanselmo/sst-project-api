import { describe, expect, it } from '@jest/globals';

import {
  hasOccupationalLimitValue,
  normalizeOccupationalLimitValue,
} from './normalize-occupational-limit-value.util';

describe('normalizeOccupationalLimitValue', () => {
  it('trata traços como ausência de limite', () => {
    expect(normalizeOccupationalLimitValue('-')).toBeNull();
    expect(normalizeOccupationalLimitValue('--')).toBeNull();
    expect(normalizeOccupationalLimitValue('  -  ')).toBeNull();
    expect(hasOccupationalLimitValue('-')).toBe(false);
  });

  it('preserva valores ocupacionais reais', () => {
    expect(normalizeOccupationalLimitValue('0,5 mg/m³')).toBe('0,5 mg/m³');
    expect(normalizeOccupationalLimitValue('C 5')).toBe('C 5');
  });
});
