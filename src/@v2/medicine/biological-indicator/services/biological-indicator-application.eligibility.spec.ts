import { describe, expect, it } from '@jest/globals';
import {
  BiologicalIndicatorStatusEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
  BiologicalCollectionMomentEnum,
  BiologicalIndicatorDataOriginEnum,
  BiologicalNormativeSourceEnum,
  BiologicalIndicatorAnnexEnum,
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
} from '@prisma/client';

import { QUADRO_1_APPLICABILITY_DEFAULT, QUADRO_2_APPLICABILITY_DEFAULT } from '../biological-indicator-applicability.schema';
import {
  buildExamToRiskPayload,
  compareExistingExamToRisk,
  validateApplicationEligibility,
} from './biological-indicator-application.eligibility';

const baseIndicator = (overrides: Record<string, unknown> = {}) => ({
  id: 'ind-1',
  deleted_at: null,
  status: BiologicalIndicatorStatusEnum.ACTIVE,
  requiresNormativeReview: false,
  reviewedAt: new Date(),
  substanceName: 'Benzeno',
  tableNumber: BiologicalIndicatorTableEnum.QUADRO_1,
  indicatorType: BiologicalIndicatorTypeEnum.IBE_EE,
  normativeSource: BiologicalNormativeSourceEnum.NR_07,
  annex: BiologicalIndicatorAnnexEnum.ANNEX_I,
  normativeVersion: '2024',
  collectionMoment: BiologicalCollectionMomentEnum.AJ,
  collectionToleranceDays: 45,
  defaultValidityMonths: 6,
  occupationalApplicability: QUADRO_1_APPLICABILITY_DEFAULT,
  dataOrigin: BiologicalIndicatorDataOriginEnum.SPREADSHEET_IMPORT,
  riskLinks: [
    {
      id: 'risk-link-1',
      deleted_at: null,
      isConfirmed: true,
      isPrimary: true,
      riskFactorId: 'risk-1',
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
      matchMethod: BiologicalIndicatorMatchMethodEnum.CAS_EXACT,
      requiresReview: false,
      confirmedById: null,
      confirmedAt: null,
      notes: null,
      riskNameSnapshot: 'Benzeno',
      riskCasSnapshot: '71-43-2',
      indicatorId: 'ind-1',
      riskFactor: { id: 'risk-1', name: 'Benzeno', system: true, deleted_at: null },
    },
  ],
  examLinks: [
    {
      id: 'exam-link-1',
      deleted_at: null,
      isConfirmed: true,
      isDefault: true,
      examId: 10,
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.MANUAL,
      matchMethod: BiologicalIndicatorMatchMethodEnum.MANUAL,
      requiresReview: false,
      confirmedById: null,
      confirmedAt: null,
      notes: null,
      examNameSnapshot: 'Exame biológico',
      examMaterialSnapshot: 'Sangue',
      indicatorId: 'ind-1',
      exam: { id: 10, name: 'Exame biológico', system: true, deleted_at: null },
    },
  ],
  ...overrides,
});

describe('biological-indicator-application.eligibility', () => {
  it('bloqueia indicador DRAFT', () => {
    const result = validateApplicationEligibility(
      baseIndicator({ status: BiologicalIndicatorStatusEnum.DRAFT }) as never,
    );

    expect(result.isEligible).toBe(false);
    expect(result.blockCodes).toContain('INDICATOR_NOT_ACTIVE');
  });

  it('bloqueia ACTIVE sem risco confirmado', () => {
    const result = validateApplicationEligibility(
      baseIndicator({
        riskLinks: [
          {
            id: 'risk-link-1',
            deleted_at: null,
            isConfirmed: false,
            isPrimary: true,
            riskFactorId: 'risk-1',
            riskFactor: { id: 'risk-1', name: 'Benzeno', system: true, deleted_at: null },
          },
        ],
      }) as never,
    );

    expect(result.isEligible).toBe(false);
    expect(result.blockCodes).toContain('RISK_NOT_CONFIRMED');
  });

  it('bloqueia ACTIVE sem exame padrão confirmado', () => {
    const result = validateApplicationEligibility(
      baseIndicator({
        examLinks: [
          {
            id: 'exam-link-1',
            deleted_at: null,
            isConfirmed: false,
            isDefault: false,
            examId: 10,
            exam: { id: 10, name: 'Exame', system: true, deleted_at: null },
          },
        ],
      }) as never,
    );

    expect(result.isEligible).toBe(false);
    expect(result.blockCodes).toContain('EXAM_NOT_CONFIRMED');
  });

  it('bloqueia Quadro 2 sem revisão normativa', () => {
    const result = validateApplicationEligibility(
      baseIndicator({
        tableNumber: BiologicalIndicatorTableEnum.QUADRO_2,
        indicatorType: BiologicalIndicatorTypeEnum.IBE_SC,
        requiresNormativeReview: true,
        reviewedAt: null,
        occupationalApplicability: QUADRO_2_APPLICABILITY_DEFAULT,
      }) as never,
    );

    expect(result.isEligible).toBe(false);
    expect(result.blockCodes).toContain('NORMATIVE_REVIEW_REQUIRED');
  });

  it('gera payload correto para ExamToRisk sem considerBetweenDays', () => {
    const indicator = baseIndicator() as never;
    const eligibility = validateApplicationEligibility(indicator);
    const payload = buildExamToRiskPayload(indicator, eligibility, 'company-1');

    expect(payload).toMatchObject({
      examId: 10,
      riskId: 'risk-1',
      companyId: 'company-1',
      isPeriodic: true,
      validityInMonths: 6,
      minRiskDegree: 1,
      minRiskDegreeQuantity: 1,
    });
    expect(payload).not.toHaveProperty('considerBetweenDays');
  });

  it('não duplica quando regra existente é equivalente', () => {
    const payload = {
      examId: 10,
      riskId: 'risk-1',
      companyId: 'company-1',
      isPeriodic: true,
      isAdmission: false,
      isReturn: false,
      isChange: false,
      isDismissal: false,
      isFemale: false,
      isMale: false,
      validityInMonths: 6,
      lowValidityInMonths: null,
      minRiskDegree: 1,
      minRiskDegreeQuantity: 1,
    };

    const result = compareExistingExamToRisk(
      {
        id: 99,
        examId: 10,
        riskId: 'risk-1',
        companyId: 'company-1',
        deletedAt: null,
        isPeriodic: true,
        isAdmission: false,
        isReturn: false,
        isChange: false,
        isDismissal: false,
        isFemale: false,
        isMale: false,
        validityInMonths: 6,
        lowValidityInMonths: null,
        minRiskDegree: 1,
        minRiskDegreeQuantity: 1,
        considerBetweenDays: null,
        fromAge: null,
        toAge: null,
        startDate: new Date(),
      },
      payload,
    );

    expect(result.action).toBe('SKIP');
  });

  it('marca conflito quando periodicidade diverge', () => {
    const result = compareExistingExamToRisk(
      {
        id: 100,
        examId: 10,
        riskId: 'risk-1',
        companyId: 'company-1',
        deletedAt: null,
        isPeriodic: false,
        isAdmission: true,
        isReturn: false,
        isChange: false,
        isDismissal: false,
        isFemale: false,
        isMale: false,
        validityInMonths: 6,
        lowValidityInMonths: null,
        minRiskDegree: 1,
        minRiskDegreeQuantity: 1,
        considerBetweenDays: null,
        fromAge: null,
        toAge: null,
        startDate: new Date(),
      },
      {
        examId: 10,
        riskId: 'risk-1',
        companyId: 'company-1',
        isPeriodic: true,
        isAdmission: false,
        isReturn: false,
        isChange: false,
        isDismissal: false,
        isFemale: false,
        isMale: false,
        validityInMonths: 6,
        lowValidityInMonths: null,
        minRiskDegree: 1,
        minRiskDegreeQuantity: 1,
      },
    );

    expect(result.action).toBe('CONFLICT');
    expect(result.conflictReasons.length).toBeGreaterThan(0);
  });

  it('marca conflito quando considerBetweenDays está preenchido', () => {
    const result = compareExistingExamToRisk(
      {
        id: 101,
        examId: 10,
        riskId: 'risk-1',
        companyId: 'company-1',
        deletedAt: null,
        isPeriodic: true,
        isAdmission: false,
        isReturn: false,
        isChange: false,
        isDismissal: false,
        isFemale: false,
        isMale: false,
        validityInMonths: 6,
        lowValidityInMonths: null,
        minRiskDegree: 1,
        minRiskDegreeQuantity: 1,
        considerBetweenDays: 30,
        fromAge: null,
        toAge: null,
        startDate: new Date(),
      },
      {
        examId: 10,
        riskId: 'risk-1',
        companyId: 'company-1',
        isPeriodic: true,
        isAdmission: false,
        isReturn: false,
        isChange: false,
        isDismissal: false,
        isFemale: false,
        isMale: false,
        validityInMonths: 6,
        lowValidityInMonths: null,
        minRiskDegree: 1,
        minRiskDegreeQuantity: 1,
      },
    );

    expect(result.action).toBe('CONFLICT');
    expect(result.conflictReasons.join(' ')).toContain('considerBetweenDays');
  });
});
