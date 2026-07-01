import { describe, expect, it } from '@jest/globals';

import { buildRiskSubTypeSlug } from './risk-sub-type-slug.util';
import { LEGACY_RISK_SUB_TYPE_SLUGS } from './risk-sub-type-legacy-slugs.constant';

describe('legacy risk sub type backfill slugs', () => {
  it('1. migration/backfill preserva slugs dos 7 subtipos legados', () => {
    Object.entries(LEGACY_RISK_SUB_TYPE_SLUGS).forEach(([name, expectedSlug]) => {
      expect(buildRiskSubTypeSlug(name)).toBe(expectedSlug);
    });
    expect(Object.keys(LEGACY_RISK_SUB_TYPE_SLUGS)).toHaveLength(7);
  });
});
