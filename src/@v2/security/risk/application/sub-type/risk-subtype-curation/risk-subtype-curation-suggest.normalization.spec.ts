import { describe, expect, it } from '@jest/globals';

import {
  matchesAromaticNameSignal,
  matchesNonAromaticFunctionalClass,
  normalizeSuggestCandidate,
} from './risk-subtype-curation-suggest.normalization';

const baseRisk = {
  id: 'risk-1',
  name: 'Tolueno',
  cas: '108-88-3',
  synonymous: [],
  esocialCode: null,
  risk: null,
  symptoms: null,
  coments: null,
  method: null,
  nr15lt: null,
  twa: null,
  stel: null,
  ipvs: null,
  subTypes: [],
};

describe('risk-subtype-curation-suggest.normalization', () => {
  it('omissão com nome genérico vira low/exclude com aviso discreto', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: 'Hidrocarbonetos aromáticos',
      risk: { ...baseRisk, name: 'Composto orgânico sintético A-17' },
    });

    expect(result.suggestedInclude).toBe(false);
    expect(result.confidence).toBe('low');
    expect(result.reasonCategory).toBe('INSUFFICIENT_DATA');
    expect(result.warnings[0]).toContain('Sem evidência suficiente');
  });

  it('omissão com padrão aromático no nome vira include high', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: 'Hidrocarbonetos aromáticos',
      risk: { ...baseRisk, name: '1,2-dimetil-benzeno' },
    });

    expect(result.suggestedInclude).toBe(true);
    expect(result.confidence).toBe('high');
    expect(result.reasonCategory).toBe('NAME_SYNONYM_MATCH');
    expect(result.defaultSelected).toBe(true);
  });

  it('acetaldeído sugerido pela IA é rebaixado para NOT_A_MATCH', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: 'Hidrocarbonetos aromáticos',
      risk: { ...baseRisk, name: 'Acetaldeído', synonymous: ['Etanal'] },
      ai: {
        riskFactorId: 'risk-1',
        suggestedInclude: true,
        confidence: 'medium',
        rationale: 'Potencial irritante e efeito no SNC.',
        warnings: [],
      },
    });

    expect(result.suggestedInclude).toBe(false);
    expect(result.confidence).toBe('high');
    expect(result.reasonCategory).toBe('NOT_A_MATCH');
    expect(result.defaultSelected).toBe(false);
  });

  it('dimetilbenzeno com confiança média é elevado para alta', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: 'Hidrocarbonetos aromáticos',
      risk: { ...baseRisk, name: '1,3-dimetil-benzeno' },
      ai: {
        riskFactorId: 'risk-1',
        suggestedInclude: true,
        confidence: 'medium',
        rationale: 'Composto aromático.',
        warnings: [],
      },
    });

    expect(result.suggestedInclude).toBe(true);
    expect(result.confidence).toBe('high');
    expect(result.reasonCategory).toBe('NAME_SYNONYM_MATCH');
  });

  it('detecta sinais aromáticos e não aromáticos no nome', () => {
    expect(
      matchesAromaticNameSignal({ ...baseRisk, name: '2-Metil naftaleno' }),
    ).toBe(true);
    expect(
      matchesNonAromaticFunctionalClass({
        ...baseRisk,
        name: 'Acetaldeído',
        synonymous: [],
      }),
    ).toBe(true);
    expect(
      matchesNonAromaticFunctionalClass({
        ...baseRisk,
        name: 'Ácido benzoico',
        synonymous: ['Benzoato'],
      }),
    ).toBe(false);
  });

  it('butadieno não é tratado como aromático', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: 'Hidrocarbonetos aromáticos',
      risk: { ...baseRisk, name: '1,3-Butadieno', synonymous: [] },
      ai: {
        riskFactorId: 'risk-1',
        suggestedInclude: true,
        confidence: 'high',
        rationale: 'Hidrocarboneto.',
        warnings: [],
      },
    });

    expect(result.suggestedInclude).toBe(false);
    expect(result.reasonCategory).toBe('NOT_A_MATCH');
  });

  it('diisocianato de tolueno fica ambíguo com warning de isocianato', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: 'Hidrocarbonetos aromáticos',
      risk: {
        ...baseRisk,
        name: '2,4 Diisocianato de tolueno',
        synonymous: [],
      },
      ai: {
        riskFactorId: 'risk-1',
        suggestedInclude: true,
        confidence: 'high',
        rationale: 'Derivado de tolueno.',
        warnings: [],
      },
    });

    expect(result.suggestedInclude).toBe(false);
    expect(result.reasonCategory).toBe('AMBIGUOUS');
    expect(result.warnings.join(' ')).toMatch(/isocianato/i);
  });

  it('não permite include com justificativa contraditória', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: 'Hidrocarbonetos aromáticos',
      risk: { ...baseRisk, name: 'Composto X-9', synonymous: [] },
      ai: {
        riskFactorId: 'risk-1',
        suggestedInclude: true,
        confidence: 'high',
        rationale: 'Sem características aromáticas no composto.',
        warnings: [],
      },
    });

    expect(result.suggestedInclude).toBe(false);
    expect(result.reasonCategory).toBe('NOT_A_MATCH');
  });

  it('PubChem aromático reforça include quando IA hesita', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: 'Hidrocarbonetos aromáticos',
      risk: { ...baseRisk, name: 'Composto X-9', synonymous: [] },
      ai: {
        riskFactorId: 'risk-1',
        suggestedInclude: false,
        confidence: 'low',
        rationale: 'Incerto.',
        warnings: [],
      },
      enrichment: {
        sourceResults: [
          {
            source: 'PUBCHEM',
            found: true,
            matchedBy: 'CAS',
            confidence: 'high',
            title: 'o-Xylene',
            synonyms: ['1,2-dimethylbenzene'],
          },
        ],
        normalizedHints: {
          hasAromaticRing: true,
          hasBenzeneRingHint: true,
          classHints: ['benzene derivative'],
        },
        warnings: [],
      },
    });

    expect(result.suggestedInclude).toBe(true);
    expect(result.confidence).toBe('high');
    expect(result.reasonCategory).toBe('STRUCTURAL_MATCH');
  });
});
