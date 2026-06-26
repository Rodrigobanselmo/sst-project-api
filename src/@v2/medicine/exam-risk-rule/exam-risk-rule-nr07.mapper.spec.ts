import { describe, expect, it } from '@jest/globals';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';

import { buildNr07RuleData, Nr07IndicatorWithLinks } from './exam-risk-rule-nr07.mapper';

const baseIndicator = (
  overrides: Partial<Nr07IndicatorWithLinks> = {},
): Nr07IndicatorWithLinks => {
  const indicator = {
    id: 'ind-1',
    normativeSource: 'NR_07',
    annex: 'ANNEX_I',
    tableNumber: 'QUADRO_1',
    indicatorType: 'IBE_EE',
    normativeVersion: '1.0',
    substanceName: 'Tolueno',
    substanceNameNormalized: 'tolueno',
    casPrimary: '108-88-3',
    casNumbers: ['108-88-3'],
    substanceGroupId: null,
    isSubstanceGroup: false,
    biologicalIndicatorOriginal: 'o-Cresol na urina',
    biologicalIndicatorNormalized: 'o-cresol na urina',
    biologicalMatrix: 'urina',
    collectionMoment: 'FJFS',
    referenceValue: '0,5 mg/g',
    referenceValueRaw: null,
    unit: 'mg/g creat',
    technicalObservations: [],
    technicalObservationsRaw: null,
    defaultValidityMonths: 12,
    collectionToleranceDays: 45,
    occupationalApplicability: {
      isPeriodic: true,
      isAdmission: false,
      isReturn: false,
      isChange: false,
      isDismissal: false,
      allowSeasonalAnnual: true,
      clinicalSignificance: false,
      requiresMedicalReview: false,
    },
    requiresNormativeReview: false,
    generalApplicabilityNotes: null,
    status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
    dataOrigin: 'MANUAL',
    importBatchId: null,
    idempotencyKey: 'key-1',
    supersededById: null,
    reviewedById: null,
    reviewedAt: null,
    reviewNotes: null,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    riskLinks: [
      {
        id: 'rl-1',
        deleted_at: null,
        isConfirmed: true,
        isPrimary: true,
        riskFactor: { id: 'risk-1', name: 'Tolueno', system: true, deleted_at: null },
      },
    ],
    examLinks: [
      {
        id: 'el-1',
        deleted_at: null,
        isConfirmed: true,
        isDefault: true,
        examId: 50,
        examNameSnapshot: 'o-Cresol',
        exam: { id: 50, name: 'o-Cresol urinário', system: true, deleted_at: null },
      },
    ],
  } as unknown as Nr07IndicatorWithLinks;

  return { ...indicator, ...overrides };
};

describe('buildNr07RuleData', () => {
  it('cria regra AGENT/NR_07 com sourceIndicatorId e snapshot do exame', () => {
    const data = buildNr07RuleData(baseIndicator());

    expect(data.scope).toBe(PcmsoExamRiskRuleScopeEnum.AGENT);
    expect(data.source).toBe(PcmsoExamRiskRuleSourceEnum.NR_07);
    expect(data.sourceIndicatorId).toBe('ind-1');
    expect(data.agentCas).toBe('108-88-3');
    expect(data.agentName).toBe('Tolueno');
    expect(data.agentNameNormalized).toBe('tolueno');
    expect(data.status).toBe(PcmsoExamRiskRuleStatusEnum.ACTIVE);
    expect(data.pendingReasons).toEqual([]);
    expect(data.exam?.examId).toBe(50);
    expect(data.exam?.examNameSnapshot).toBe('o-Cresol urinário');
  });

  it('grava collectionToleranceDays e collectionMoment da base', () => {
    const data = buildNr07RuleData(baseIndicator());
    expect(data.exam?.collectionToleranceDays).toBe(45);
    expect(data.exam?.collectionMoment).toBe('FJFS');
  });

  it('mantém considerBetweenDays = null', () => {
    const data = buildNr07RuleData(baseIndicator());
    expect(data.exam?.considerBetweenDays).toBeNull();
  });

  it('usa defaultValidityMonths da base, não fixa 6', () => {
    const data = buildNr07RuleData(baseIndicator());
    expect(data.exam?.validityInMonths).toBe(12);
  });

  it('usa periodicidade do occupationalApplicability', () => {
    const data = buildNr07RuleData(
      baseIndicator({
        occupationalApplicability: {
          isPeriodic: true,
          isAdmission: true,
          isReturn: false,
          isChange: false,
          isDismissal: false,
          allowSeasonalAnnual: true,
          clinicalSignificance: false,
          requiresMedicalReview: false,
        },
      } as never),
    );
    expect(data.exam?.isPeriodic).toBe(true);
    expect(data.exam?.isAdmission).toBe(true);
    expect(data.exam?.isReturn).toBe(false);
  });

  it('grava minRiskDegree = 3 e minRiskDegreeQuantity = null', () => {
    const data = buildNr07RuleData(baseIndicator());
    expect(data.exam?.minRiskDegree).toBe(3);
    expect(data.exam?.minRiskDegreeQuantity).toBeNull();
  });

  it('sexo true/true e idade null por padrão', () => {
    const data = buildNr07RuleData(baseIndicator());
    expect(data.exam?.isMale).toBe(true);
    expect(data.exam?.isFemale).toBe(true);
    expect(data.exam?.fromAge).toBeNull();
    expect(data.exam?.toAge).toBeNull();
  });

  it('indicador sem CAS mas com substanceName ainda gera regra AGENT', () => {
    const data = buildNr07RuleData(
      baseIndicator({ casPrimary: null } as never),
    );
    expect(data.scope).toBe(PcmsoExamRiskRuleScopeEnum.AGENT);
    expect(data.agentCas).toBeNull();
    expect(data.agentName).toBe('Tolueno');
  });

  it('indicador sem exame default/confirmado vira DRAFT e pendência', () => {
    const data = buildNr07RuleData(
      baseIndicator({ examLinks: [] } as never),
    );
    expect(data.status).toBe(PcmsoExamRiskRuleStatusEnum.DRAFT);
    expect(data.exam).toBeNull();
    expect(data.pendingReasons).toContain('EXAM_NOT_CONFIRMED');
  });

  it('indicador não-ACTIVE vira DRAFT com motivo INDICATOR_NOT_ACTIVE', () => {
    const data = buildNr07RuleData(
      baseIndicator({ status: 'DRAFT' } as never),
    );
    expect(data.status).toBe(PcmsoExamRiskRuleStatusEnum.DRAFT);
    expect(data.pendingReasons).toContain('INDICATOR_NOT_ACTIVE');
  });
});
