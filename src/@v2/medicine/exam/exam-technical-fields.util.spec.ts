import { describe, expect, it } from '@jest/globals';
import { BiologicalCollectionMomentEnum } from '@prisma/client';

import {
  ACGIH_INSTRUCTION_BLOCK_PREFIX,
  applyExamTechnicalFields,
  buildAcgihTechnicalInstructionBlock,
  buildNr7TechnicalInstructionBlock,
  EXAM_INSTRUCTION_SEPARATOR,
  instructionContainsTechnicalBlock,
  mergeExamInstruction,
  mergeExamScalarField,
  NR7_INSTRUCTION_BLOCK_PREFIX,
} from './exam-technical-fields.util';

describe('exam-technical-fields.util', () => {
  it('monta bloco NR-7 legível', () => {
    const block = buildNr7TechnicalInstructionBlock({
      collectionMoment: BiologicalCollectionMomentEnum.FJ,
      referenceValue: '40',
      unit: 'ppm',
      technicalObservations: 'NE',
    });

    expect(block).toBe(
      'Orientação técnica NR-7: coletar em final da jornada (FJ). Valor de referência: 40 ppm.',
    );
  });

  it('monta bloco ACGIH/BEI com BEI e notação', () => {
    const block = buildAcgihTechnicalInstructionBlock({
      samplingMoment: 'Final da jornada e da semana',
      referenceValue: '2,5',
      unit: 'mg/L',
      notation: 'Sq, B',
      technicalObservations: 'Conferido contra ACGIH/BEI 2023.',
    });

    expect(block).toContain('Orientação técnica ACGIH/BEI:');
    expect(block).toContain('momento de amostragem final da jornada e da semana.');
    expect(block).toContain('BEI: 2,5 mg/L.');
    expect(block).toContain('Notação: Sq, B.');
    expect(block).toContain('Observações: Conferido contra ACGIH/BEI 2023.');
  });

  it('não sobrescreve material/analyses/instruction em modo preserve', () => {
    const result = applyExamTechnicalFields({
      existing: {
        material: 'sangue',
        analyses: 'Determinante curado',
        instruction: 'Instrução manual.',
      },
      suggested: {
        material: 'urina',
        analyses: 'Novo determinante',
        instructionBlock: buildNr7TechnicalInstructionBlock({
          collectionMoment: BiologicalCollectionMomentEnum.FJFS,
        }),
        instructionBlockPrefix: NR7_INSTRUCTION_BLOCK_PREFIX,
      },
      mode: 'preserve',
    });

    expect(result).toEqual({
      material: 'sangue',
      analyses: 'Determinante curado',
      instruction: 'Instrução manual.',
    });
  });

  it('preenche campos vazios em modo create', () => {
    const block = buildNr7TechnicalInstructionBlock({
      collectionMoment: BiologicalCollectionMomentEnum.AJFS,
      referenceValue: '10',
      unit: 'mg/L',
    });

    const result = applyExamTechnicalFields({
      existing: {
        material: null,
        analyses: '',
        instruction: null,
      },
      suggested: {
        material: 'urina',
        analyses: 'Ácido tricloroacético na urina',
        instructionBlock: block,
        instructionBlockPrefix: NR7_INSTRUCTION_BLOCK_PREFIX,
      },
      mode: 'create',
    });

    expect(result.material).toBe('urina');
    expect(result.analyses).toBe('Ácido tricloroacético na urina');
    expect(result.instruction).toBe(block);
  });

  it('não duplica instrução técnica se bloco já existir', () => {
    const block = buildAcgihTechnicalInstructionBlock({
      samplingMoment: 'Final da jornada',
      referenceValue: '0,7',
      unit: 'µg/L',
      notation: 'Pop',
    });

    const existing = block!;
    const merged = mergeExamInstruction(
      existing,
      block,
      'create',
      ACGIH_INSTRUCTION_BLOCK_PREFIX,
    );

    expect(merged).toBe(existing);
    expect(instructionContainsTechnicalBlock(existing, ACGIH_INSTRUCTION_BLOCK_PREFIX)).toBe(
      true,
    );
  });

  it('preserva separador de múltiplas instruções ao anexar bloco', () => {
    const block = buildNr7TechnicalInstructionBlock({
      collectionMoment: BiologicalCollectionMomentEnum.FJ,
    });

    const merged = mergeExamInstruction(
      'Preparo: jejum de 8h.',
      block,
      'create',
      NR7_INSTRUCTION_BLOCK_PREFIX,
    );

    expect(merged).toBe(
      `Preparo: jejum de 8h.${EXAM_INSTRUCTION_SEPARATOR}${block}`,
    );
  });

  it('mergeExamScalarField respeita curadoria existente', () => {
    expect(mergeExamScalarField('urina', 'sangue', 'preserve')).toBe('urina');
    expect(mergeExamScalarField('', 'urina', 'create')).toBe('urina');
  });
});
