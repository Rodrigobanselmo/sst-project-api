import { describe, expect, it } from '@jest/globals';

import { HoMethodRiskFactorSnapshot } from '../ho-method.types';
import {
  collectAgentSearchTerms,
  resolveBestRiskMatch,
  scoreRiskMatch,
} from './ho-method-risk-match.util';

const baseSnapshot = (
  overrides: Partial<HoMethodRiskFactorSnapshot> = {},
): HoMethodRiskFactorSnapshot => ({
  id: 'risk-1',
  name: 'Benzene',
  cas: '71-43-2',
  synonymous: ['Benzeno'],
  type: 'QUI',
  unit: 'ppm',
  nr15lt: null,
  twa: '0.5',
  stel: null,
  acgihCeiling: null,
  ipvs: null,
  nioshRel: null,
  nioshStel: null,
  nioshCeiling: null,
  oshaPel: null,
  oshaStel: null,
  oshaCeiling: null,
  aihaWeel: null,
  aihaWeelCeiling: null,
  ...overrides,
});

describe('ho-method-risk-match.util', () => {
  describe('scoreRiskMatch', () => {
    it('matches by normalized CAS', () => {
      expect(
        scoreRiskMatch(
          { substanceName: 'Benzene', cas: '71-43-2', synonyms: [] },
          baseSnapshot(),
        ),
      ).toBe('high');

      expect(
        scoreRiskMatch(
          { substanceName: 'Benzene', cas: '71432', synonyms: [] },
          baseSnapshot({ cas: '71-43-2' }),
        ),
      ).toBe('high');
    });

    it('returns low when CAS differs', () => {
      expect(
        scoreRiskMatch(
          { substanceName: 'Benzene', cas: '50-00-0', synonyms: [] },
          baseSnapshot(),
        ),
      ).toBe('low');
    });

    it('matches by exact normalized name', () => {
      expect(
        scoreRiskMatch(
          { substanceName: 'benzene', cas: null, synonyms: [] },
          baseSnapshot(),
        ),
      ).toBe('high');
    });

    it('matches by synonym against registered name or synonym', () => {
      expect(
        scoreRiskMatch(
          { substanceName: 'Unknown', cas: null, synonyms: ['Benzeno'] },
          baseSnapshot(),
        ),
      ).toBe('high');
    });
  });

  describe('resolveBestRiskMatch', () => {
    it('auto-matches only a single high-confidence candidate', () => {
      const result = resolveBestRiskMatch(
        { substanceName: 'Benzene', cas: '71-43-2', synonyms: [] },
        [baseSnapshot()],
      );

      expect(result.confidence).toBe('high');
      expect(result.match?.id).toBe('risk-1');
    });

    it('does not auto-match when multiple high-confidence candidates exist', () => {
      const result = resolveBestRiskMatch(
        { substanceName: 'Benzene', cas: '71-43-2', synonyms: [] },
        [
          baseSnapshot({ id: 'risk-1' }),
          baseSnapshot({ id: 'risk-2', name: 'Benzene duplicate' }),
        ],
      );

      expect(result.confidence).toBe('low');
      expect(result.match).toBeNull();
      expect(result.candidateRiskFactors.length).toBe(2);
    });

    it('returns low confidence for weak candidates without auto-link', () => {
      const result = resolveBestRiskMatch(
        { substanceName: 'Benz', cas: null, synonyms: [] },
        [baseSnapshot()],
      );

      expect(result.confidence).toBe('low');
      expect(result.match).toBeNull();
      expect(result.candidateRiskFactors.length).toBe(1);
    });
  });

  describe('collectAgentSearchTerms', () => {
    it('collects CAS, name and expanded synonyms', () => {
      const terms = collectAgentSearchTerms({
        substanceName: 'Benzene',
        cas: '71-43-2',
        synonyms: ['Benzeno; Tolueno'],
      });

      expect(terms).toEqual(
        expect.arrayContaining(['71-43-2', 'Benzene', 'Benzeno', 'Tolueno']),
      );
    });
  });
});
