import { describe, expect, it } from '@jest/globals';

import { buildRiskSubTypeSlug } from './risk-sub-type-slug.util';

describe('buildRiskSubTypeSlug', () => {
  it('normaliza acentos e espaços', () => {
    expect(buildRiskSubTypeSlug('Solventes orgânicos')).toBe('solventes-organicos');
    expect(buildRiskSubTypeSlug('Mobiliário e Equipamentos')).toBe(
      'mobiliario-e-equipamentos',
    );
  });

  it('preserva slugs legados esperados', () => {
    expect(buildRiskSubTypeSlug('Psicossociais')).toBe('psicossociais');
    expect(buildRiskSubTypeSlug('Biomecânicos')).toBe('biomecanicos');
  });
});
