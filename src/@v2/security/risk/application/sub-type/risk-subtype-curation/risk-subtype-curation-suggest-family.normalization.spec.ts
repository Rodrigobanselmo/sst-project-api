import { describe, expect, it } from '@jest/globals';

import { normalizeSuggestCandidate } from './risk-subtype-curation-suggest.normalization';

const FEN_HA = 'Fenóis e cresóis [FEN/HA]';
const HC_HA = 'Hidrocarbonetos aromáticos [HC/HA]';
const ISO = 'Isocianatos [ISO]';
const HAP = 'Hidrocarbonetos aromáticos policíclicos — HAP [HC/HA/HAP]';
const NITRO_HA = 'Nitrocompostos aromáticos [NITRO/HA]';
const NITRO_FEN_HA = 'Derivados nitroaromáticos e nitrofenílicos [NITRO/FEN/HA]';

const baseRisk = {
  id: 'risk-1',
  cas: null,
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

function normalizeFor(
  subTypeName: string,
  name: string,
  ai?: {
    suggestedInclude: boolean;
    confidence: 'high' | 'medium' | 'low';
    rationale: string;
  },
  synonymous: string[] = [],
) {
  return normalizeSuggestCandidate({
    subTypeName,
    risk: { ...baseRisk, name, synonymous },
    ai: ai
      ? {
          riskFactorId: 'risk-1',
          warnings: [],
          ...ai,
        }
      : undefined,
  });
}

describe('FEN/HA normalization', () => {
  const excludeCases = [
    'Benzeno',
    '1,2-dimetil-benzeno',
    'Xileno',
    'Naftaleno',
    'Anilina',
    'Trinitrotolueno',
    'Bifenil',
    '1,2,4-Triclorobenzeno',
    'Benzo[a]pireno',
    'Ciclohexano',
    'Ciclohexeno',
    'Acetaldeído',
    'Formaldeído',
    'Acetona',
    '1,3-Butadieno',
    '1-Hexeno',
  ];

  it.each(excludeCases)('exclui %s', (name) => {
    const result = normalizeFor(FEN_HA, name, {
      suggestedInclude: true,
      confidence: 'high',
      rationale: 'Composto aromático com anel benzênico.',
    });
    expect(result.suggestedInclude).toBe(false);
    expect(result.reasonCategory).toBe('NOT_A_MATCH');
  });

  const includeCases = [
    'Fenol',
    'o-Cresol',
    'p-Clorofenol',
    'Catecol',
    'Hidroquinona',
    '2,4-dinitrofenol',
    'Aminofenol',
    '4-Metoxifenol',
  ];

  it.each(includeCases)('inclui %s', (name) => {
    const result = normalizeFor(FEN_HA, name);
    expect(result.suggestedInclude).toBe(true);
    expect(result.confidence).toBe('high');
    expect(result.defaultSelected).toBe(true);
  });

  it('acetaldeído CAS 75-07-0 exclui com rationale específico', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: FEN_HA,
      risk: { ...baseRisk, name: 'Acetaldeído', cas: '75-07-0' },
      ai: {
        riskFactorId: 'risk-1',
        suggestedInclude: true,
        confidence: 'high',
        rationale: 'Composto com grupo fenol em texto externo.',
        warnings: [],
      },
    });
    expect(result.suggestedInclude).toBe(false);
    expect(result.rationale).toContain('aldeído alifático');
  });

  const fenHaIsocyanateExcludeCases = [
    '2,4 Diisocianato de tolueno',
    '2,6 Diisocianato de tolueno',
    'TDI',
    'MDI',
    'HDI',
    '2,4-toluene diisocyanate',
    'tolylene diisocyanate',
  ];

  it.each(fenHaIsocyanateExcludeCases)(
    'exclui isocianato %s mesmo com IA e PubChem sugerindo fenol',
    (name) => {
      const result = normalizeSuggestCandidate({
        subTypeName: FEN_HA,
        risk: { ...baseRisk, name, cas: name.includes('2,4') ? '584-84-9' : null },
        ai: {
          riskFactorId: 'risk-1',
          suggestedInclude: true,
          confidence: 'high',
          rationale: 'possui grupo fenólico compatível com FEN/HA',
          warnings: [],
        },
        enrichment: {
          sourceResults: [
            {
              source: 'PUBCHEM',
              found: true,
              confidence: 'high',
              title: name,
              synonyms: ['toluene diisocyanate', 'reaction with phenol'],
            },
          ],
          normalizedHints: {
            isIsocyanateHint: true,
            isPhenolOrCresolHint: true,
            hasAromaticRing: true,
            hasBenzeneRingHint: true,
            classHints: ['isocyanate', 'benzene derivative'],
          },
          warnings: [],
        },
      });

      expect(result.suggestedInclude).toBe(false);
      expect(result.reasonCategory).toBe('NOT_A_MATCH');
      expect(result.rationale).toBe(
        'isocianato sem grupo fenólico; deve ser avaliado no subtipo ISO.',
      );
    },
  );

  it('PubChem aromático sem fenol não inclui em FEN/HA', () => {
    const result = normalizeSuggestCandidate({
      subTypeName: FEN_HA,
      risk: { ...baseRisk, name: 'Composto X' },
      ai: {
        riskFactorId: 'risk-1',
        suggestedInclude: true,
        confidence: 'high',
        rationale: 'Estrutura aromática.',
        warnings: [],
      },
      enrichment: {
        sourceResults: [
          {
            source: 'PUBCHEM',
            found: true,
            confidence: 'high',
            title: 'Benzene',
          },
        ],
        normalizedHints: {
          hasAromaticRing: true,
          hasBenzeneRingHint: true,
          isPhenolOrCresolHint: false,
          classHints: ['aromatic hydrocarbon'],
        },
        warnings: [],
      },
    });

    expect(result.suggestedInclude).toBe(false);
    expect(result.reasonCategory).toBe('NOT_A_MATCH');
  });
});

describe('HC/HA regression', () => {
  it('xileno/dimetilbenzeno inclui', () => {
    const result = normalizeFor(HC_HA, '1,3-dimetil-benzeno');
    expect(result.suggestedInclude).toBe(true);
    expect(result.defaultSelected).toBe(true);
  });

  it('butadieno exclui', () => {
    const result = normalizeFor(HC_HA, '1,3-Butadieno', {
      suggestedInclude: true,
      confidence: 'high',
      rationale: 'Hidrocarboneto.',
    });
    expect(result.suggestedInclude).toBe(false);
  });

  it('acetaldeído exclui', () => {
    const result = normalizeFor(HC_HA, 'Acetaldeído', {
      suggestedInclude: true,
      confidence: 'medium',
      rationale: 'Potencial irritante.',
    });
    expect(result.suggestedInclude).toBe(false);
  });

  it('diisocianato de tolueno fica ambíguo em HC/HA', () => {
    const result = normalizeFor(HC_HA, '2,4 Diisocianato de tolueno', {
      suggestedInclude: true,
      confidence: 'high',
      rationale: 'Derivado de tolueno.',
    });
    expect(result.suggestedInclude).toBe(false);
    expect(result.reasonCategory).toBe('AMBIGUOUS');
  });
});

describe('ISO normalization', () => {
  const isoIncludeCases = [
    '2,4 Diisocianato de tolueno',
    '2,6 Diisocianato de tolueno',
    'TDI',
    'MDI',
    'HDI',
    'toluene diisocyanate',
  ];

  it.each(isoIncludeCases)('inclui isocianato %s em ISO', (name) => {
    const result = normalizeFor(ISO, name);
    expect(result.suggestedInclude).toBe(true);
    expect(result.defaultSelected).toBe(true);
  });
});

describe('HAP normalization', () => {
  it.each(['Naftaleno', 'Acenafteno', 'Benzo[a]pireno'])('inclui %s em HAP', (name) => {
    const result = normalizeFor(HAP, name);
    expect(result.suggestedInclude).toBe(true);
  });

  it('benzeno exclui em HAP', () => {
    const result = normalizeFor(HAP, 'Benzeno', {
      suggestedInclude: true,
      confidence: 'high',
      rationale: 'Aromático.',
    });
    expect(result.suggestedInclude).toBe(false);
  });
});

describe('NITRO/HA normalization', () => {
  it('nitrobenzeno/TNT inclui em NITRO/HA', () => {
    expect(normalizeFor(NITRO_HA, 'Nitrobenzeno').suggestedInclude).toBe(true);
    expect(normalizeFor(NITRO_HA, 'Trinitrotolueno').suggestedInclude).toBe(true);
  });

  it('nitrofenol é ambíguo/excluído em NITRO/HA', () => {
    const result = normalizeFor(NITRO_HA, '2,4-dinitrofenol', {
      suggestedInclude: true,
      confidence: 'high',
      rationale: 'Nitroaromático.',
    });
    expect(result.suggestedInclude).toBe(false);
    expect(result.reasonCategory).toBe('AMBIGUOUS');
  });

  it('nitrofenol inclui em NITRO/FEN/HA', () => {
    const result = normalizeFor(NITRO_FEN_HA, '2,4-dinitrofenol');
    expect(result.suggestedInclude).toBe(true);
  });
});
