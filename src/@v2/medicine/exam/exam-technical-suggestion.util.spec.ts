import { describe, expect, it } from '@jest/globals';
import { BiologicalCollectionMomentEnum, BiologicalNormativeSourceEnum } from '@prisma/client';

import { buildExamTechnicalSuggestion } from './exam-technical-suggestion.util';

describe('exam-technical-suggestion.util', () => {
  it('monta sugestão NR-7 aplicável apenas em campos vazios', () => {
    const result = buildExamTechnicalSuggestion({
      indicators: [
        {
          normativeSource: BiologicalNormativeSourceEnum.NR_07,
          biologicalIndicatorOriginal: 'Acetona na urina',
          biologicalMatrix: 'urina',
          collectionMoment: BiologicalCollectionMomentEnum.FJ,
          referenceValue: '50',
          unit: 'mg/L',
          technicalObservationsRaw: 'NE',
          samplingTime: null,
          notation: null,
          internalNotes: null,
          ruleCollectionMoment: null,
        },
      ],
      exam: {
        material: '',
        analyses: 'Quantitativo',
        instruction: null,
      },
    });

    expect(result.source).toBe('NR_07');
    expect(result.material).toBe('urina');
    expect(result.analyses).toBe('Acetona na urina');
    expect(result.instruction).toContain('Orientação técnica NR-7:');
    expect(result.shouldApply).toEqual({
      material: true,
      analyses: false,
      instruction: true,
    });
    expect(result.notes.some((note) => note.includes('Determinante/análise'))).toBe(
      true,
    );
  });

  it('monta sugestão ACGIH/BEI', () => {
    const result = buildExamTechnicalSuggestion({
      indicators: [
        {
          normativeSource: BiologicalNormativeSourceEnum.ACGIH_BEI,
          biologicalIndicatorOriginal: 'Ácido s-fenilmercaptúrico (S-PMA) na urina',
          biologicalMatrix: 'urina',
          collectionMoment: BiologicalCollectionMomentEnum.FJFS,
          referenceValue: '25',
          unit: 'µg/g creatinina',
          technicalObservationsRaw: null,
          samplingTime: 'Final da jornada e da semana',
          notation: 'B',
          internalNotes: 'Conferido ACGIH/BEI.',
          ruleCollectionMoment: null,
        },
      ],
      exam: {
        material: 'urina',
        analyses: 'Ácido s-fenilmercaptúrico (S-PMA) na urina',
        instruction: '',
      },
    });

    expect(result.source).toBe('ACGIH_BEI');
    expect(result.instruction).toContain('Orientação técnica ACGIH/BEI:');
    expect(result.shouldApply.instruction).toBe(true);
    expect(result.shouldApply.material).toBe(false);
    expect(result.shouldApply.analyses).toBe(false);
  });

  it('retorna NONE quando não há indicador', () => {
    const result = buildExamTechnicalSuggestion({
      indicators: [],
      exam: {
        material: 'urina',
        analyses: 'Quantitativo',
        instruction: 'Manual',
      },
    });

    expect(result.source).toBe('NONE');
    expect(result.shouldApply).toEqual({
      material: false,
      analyses: false,
      instruction: false,
    });
    expect(result.notes).toEqual([]);
  });
});
