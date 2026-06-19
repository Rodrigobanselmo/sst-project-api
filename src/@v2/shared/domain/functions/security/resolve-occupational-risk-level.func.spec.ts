import { describe, expect, it } from '@jest/globals';

import { resolveOccupationalRiskLevel } from './resolve-occupational-risk-level.func';

describe('resolveOccupationalRiskLevel', () => {
  it('returns persisted level when valid', () => {
    expect(resolveOccupationalRiskLevel(3, 4, 4)).toBe(4);
    expect(resolveOccupationalRiskLevel(undefined, undefined, 6)).toBe(6);
  });

  it('ignores null or zero stored level and computes from matrix', () => {
    expect(resolveOccupationalRiskLevel(4, 4, null)).toBe(4);
    expect(resolveOccupationalRiskLevel(4, 4, 0)).toBe(4);
  });

  it('returns null when matrix inputs are missing', () => {
    expect(resolveOccupationalRiskLevel(null, 4, null)).toBeNull();
    expect(resolveOccupationalRiskLevel(4, null, null)).toBeNull();
  });

  it('returns level 1 from matrix without upgrading to level 2', () => {
    expect(resolveOccupationalRiskLevel(1, 1, null)).toBe(1);
  });
});
