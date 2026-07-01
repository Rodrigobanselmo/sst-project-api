import { describe, expect, it } from '@jest/globals';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
  BiologicalCollectionMomentEnum,
} from '@prisma/client';

import {
  buildExamCreatePayload,
  buildExamLinkProvisionPolicy,
  buildNormativeExamLinkNotes,
  findExistingExamForIndicator,
  findTenantReferenceExam,
  materialsAreCompatible,
  suggestEsocialEntry,
} from './biological-indicator-exam-provision.util';
import {
  applyExamTechnicalFields,
  buildNr7TechnicalInstructionBlock,
  NR7_INSTRUCTION_BLOCK_PREFIX,
} from '../exam/exam-technical-fields.util';
import { IndicatorExamProvisionInput } from './biological-indicator-exam-provision.types';
import { simpleCompanyId } from '@/shared/constants/ids';

const baseIndicator = (
  overrides: Partial<IndicatorExamProvisionInput> = {},
): IndicatorExamProvisionInput => ({
  id: 'indicator-1',
  biologicalIndicatorOriginal: 'Ácido tricloroacético na urina',
  biologicalIndicatorNormalized: 'acido tricloroacetico na urina',
  biologicalMatrix: 'urina',
  collectionMoment: BiologicalCollectionMomentEnum.FJFS,
  tableNumber: BiologicalIndicatorTableEnum.QUADRO_1,
  indicatorType: BiologicalIndicatorTypeEnum.IBE_EE,
  isSubstanceGroup: false,
  requiresNormativeReview: false,
  referenceValue: '10',
  unit: 'mg/L',
  technicalObservations: [],
  technicalObservationsRaw: 'NE',
  normativeVersion: 'NR-07-2022',
  ...overrides,
});

const esocialCatalog = [
  { code: '0133', name: 'Ácido tricloroacético' },
  { code: '1217', name: 'Tricloroetanol urinário' },
  { code: '1216', name: 'Tricloroetano sanguíneo' },
  { code: '0002', name: '1,1,1-tricloroetano' },
];

describe('biological-indicator-exam-provision.util', () => {
  it('compatibiliza matrizes equivalentes', () => {
    expect(materialsAreCompatible('Urina', 'urina')).toBe(true);
    expect(materialsAreCompatible('Sangue', 'sangue')).toBe(true);
    expect(materialsAreCompatible('Sangue', 'urina')).toBe(false);
  });

  it('reutiliza exame por nome exato e material', () => {
    const match = findExistingExamForIndicator(
      baseIndicator(),
      [
        {
          id: 22,
          name: 'Ácido tricloroacético na urina',
          material: 'urina',
          instruction: null,
          analyses: null,
          esocial27Code: '0133',
          companyId: simpleCompanyId,
          system: true,
        },
      ],
      esocialCatalog,
    );

    expect(match).toMatchObject({
      examId: 22,
      matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
    });
  });

  it('não vincula exame de tenant; usa apenas como referência', () => {
    const tenantExam = {
      id: 22,
      name: 'Ácido tricloroacético',
      material: 'Urina',
      instruction: null,
      analyses: null,
      esocial27Code: '0133',
      companyId: 'tenant',
      system: false,
    };

    expect(findExistingExamForIndicator(baseIndicator(), [tenantExam], esocialCatalog)).toBeNull();
    expect(findTenantReferenceExam(baseIndicator(), [tenantExam], esocialCatalog)?.id).toBe(22);

    const payload = buildExamCreatePayload(
      baseIndicator(),
      esocialCatalog,
      tenantExam,
    );
    expect(payload.companyId).toBe(simpleCompanyId);
    expect(payload.system).toBe(true);
    expect(payload.esocial27Code).toBe('0133');
    expect(payload.name).toBe('Ácido tricloroacético na urina');
  });

  it('sugere eSocial sem forçar código para ar exalado', () => {
    const indicator = baseIndicator({
      biologicalIndicatorOriginal: '1,1,1 Tricloroetano no ar exalado final',
      biologicalIndicatorNormalized: '1 1 1 tricloroetano no ar exalado final',
      biologicalMatrix: 'ar exalado final',
      collectionMoment: BiologicalCollectionMomentEnum.AJFS,
      referenceValue: '40',
      unit: 'ppm',
      technicalObservationsRaw: null,
    });

    expect(suggestEsocialEntry(indicator, esocialCatalog)).toBeNull();

    const payload = buildExamCreatePayload(indicator, esocialCatalog);
    expect(payload.esocial27Code).toBeUndefined();
    expect(payload.name).toBe('1,1,1 Tricloroetano no ar exalado final');
    expect(payload.system).toBe(true);
    expect(payload.companyId).toBe(simpleCompanyId);
  });

  it('aplica código eSocial para tricloroetanol urinário', () => {
    const indicator = baseIndicator({
      biologicalIndicatorOriginal: 'Tricloroetanol total na urina',
      biologicalIndicatorNormalized: 'tricloroetanol total na urina',
      referenceValue: '30',
    });

    expect(suggestEsocialEntry(indicator, esocialCatalog)?.code).toBe('1217');
    expect(buildExamCreatePayload(indicator, esocialCatalog).esocial27Code).toBe('1217');
  });

  it('não confunde etanol com tricloroetanol', () => {
    const indicator = baseIndicator({
      biologicalIndicatorOriginal: 'Tricloroetanol total na urina',
      biologicalIndicatorNormalized: 'tricloroetanol total na urina',
    });

    const match = findExistingExamForIndicator(
      indicator,
      [
        {
          id: 30,
          name: 'Etanol',
          material: 'Urina',
          instruction: null,
          analyses: null,
          esocial27Code: '0580',
          companyId: 'tenant',
          system: false,
        },
      ],
      esocialCatalog,
    );

    expect(match).toBeNull();
  });

  it('auto-confirma vínculo apenas para Quadro 1 simples', () => {
    expect(buildExamLinkProvisionPolicy(baseIndicator())).toMatchObject({
      isConfirmed: true,
      isDefault: true,
      requiresReview: false,
    });

    expect(
      buildExamLinkProvisionPolicy(
        baseIndicator({
          tableNumber: BiologicalIndicatorTableEnum.QUADRO_2,
          requiresNormativeReview: true,
        }),
      ),
    ).toMatchObject({
      isConfirmed: false,
      requiresReview: true,
    });
  });

  it('registra origem NR-07 nas notas do vínculo', () => {
    const notes = buildNormativeExamLinkNotes(
      baseIndicator({
        technicalObservationsRaw: 'NE',
      }),
    );

    expect(notes).toContain('NR-07 Anexo I');
    expect(notes).toContain('Momento da coleta: FJFS');
    expect(notes).toContain('Valor IBE/EE: 10 mg/L');
    expect(notes).toContain('Observações: NE');
    expect(notes).toContain('Provisionado automaticamente');
  });

  it('cria payload NR-7 com material, analyses e instruction técnica', () => {
    const payload = buildExamCreatePayload(baseIndicator(), esocialCatalog);

    expect(payload.material).toBe('urina');
    expect(payload.analyses).toBe('Ácido tricloroacético na urina');
    expect(payload.instruction).toContain('Orientação técnica: coletar em');
    expect(payload.instruction).toContain('Valor de referência: 10 mg/L');
  });

  it('não sobrescreve exame existente com material/analyses/instruction já preenchidos', () => {
    const result = applyExamTechnicalFields({
      existing: {
        material: 'sangue',
        analyses: 'Determinante curado',
        instruction: 'Instrução manual.',
      },
      suggested: {
        material: 'urina',
        analyses: 'Ácido tricloroacético na urina',
        instructionBlock: buildNr7TechnicalInstructionBlock({
          collectionMoment: BiologicalCollectionMomentEnum.FJFS,
          referenceValue: '10',
          unit: 'mg/L',
        }),
        instructionBlockPrefix: NR7_INSTRUCTION_BLOCK_PREFIX,
      },
      mode: 'preserve',
    });

    expect(result.material).toBe('sangue');
    expect(result.analyses).toBe('Determinante curado');
    expect(result.instruction).toBe('Instrução manual.');
  });

  it('reutiliza analyses do exame de referência tenant ao criar exame sistêmico', () => {
    const payload = buildExamCreatePayload(baseIndicator(), esocialCatalog, {
      id: 22,
      name: 'Exame tenant',
      material: 'Urina',
      analyses: 'Determinante curado',
      instruction: null,
      esocial27Code: '0133',
      companyId: 'tenant',
      system: false,
    });

    expect(payload.analyses).toBe('Determinante curado');
    expect(payload.esocial27Code).toBe('0133');
    expect(payload.instruction).toContain('Orientação técnica: coletar em');
  });
});
