import { describe, expect, it } from '@jest/globals';

import { normalizeAgentName, normalizeCas } from './agent-normalize.util';

describe('normalizeAgentName', () => {
  it('remove diacríticos, faz trim e lower-case', () => {
    expect(normalizeAgentName('  Tolueno  ')).toBe('tolueno');
    expect(normalizeAgentName('Ácido fórmico')).toBe('acido formico');
    expect(normalizeAgentName('n-Heptano')).toBe('n-heptano');
  });

  it('retorna null para entrada vazia/branca/nula', () => {
    expect(normalizeAgentName(undefined)).toBeNull();
    expect(normalizeAgentName(null)).toBeNull();
    expect(normalizeAgentName('')).toBeNull();
    expect(normalizeAgentName('   ')).toBeNull();
  });
});

describe('normalizeCas', () => {
  it('mantém somente dígitos', () => {
    expect(normalizeCas('108-88-3')).toBe('108883');
    expect(normalizeCas(' 50-00-0 ')).toBe('50000');
  });

  it('retorna null quando não há dígitos', () => {
    expect(normalizeCas(undefined)).toBeNull();
    expect(normalizeCas(null)).toBeNull();
    expect(normalizeCas('')).toBeNull();
    expect(normalizeCas('n/a')).toBeNull();
  });
});
