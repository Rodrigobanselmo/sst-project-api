import { describe, expect, it } from '@jest/globals';
import { BiologicalIndicatorStatusEnum } from '@prisma/client';

import { BiologicalIndicatorApplicationService } from './biological-indicator-application.service';

describe('biological-indicator-application.service', () => {
  const indicator = {
    id: 'ind-active',
    deleted_at: null,
    status: BiologicalIndicatorStatusEnum.ACTIVE,
    substanceName: 'Benzeno',
    tableNumber: 'QUADRO_1',
    indicatorType: 'IBE_EE',
    requiresNormativeReview: false,
    reviewedAt: new Date(),
    normativeSource: 'NR_07',
    normativeVersion: '2024',
    collectionMoment: 'POST_SHIFT',
    collectionToleranceDays: 45,
    defaultValidityMonths: 6,
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
    riskLinks: [
      {
        id: 'rl-1',
        deleted_at: null,
        isConfirmed: true,
        isPrimary: true,
        riskFactorId: 'risk-1',
        examId: 1,
        indicatorId: 'ind-active',
        riskFactor: { id: 'risk-1', name: 'Benzeno', system: true, deleted_at: null },
      },
    ],
    examLinks: [
      {
        id: 'el-1',
        deleted_at: null,
        isConfirmed: true,
        isDefault: true,
        examId: 10,
        indicatorId: 'ind-active',
        exam: { id: 10, name: 'Exame', system: true, deleted_at: null },
      },
    ],
  };

  it('dry-run não altera banco', async () => {
    const prisma = {
      occupationalBiologicalIndicator: {
        findMany: async () => [indicator],
      },
      examToRisk: {
        findMany: async () => [],
        create: async () => {
          throw new Error('create should not be called');
        },
        update: async () => {
          throw new Error('update should not be called');
        },
      },
    } as never;

    const service = new BiologicalIndicatorApplicationService(prisma);
    const report = await service.previewApplication();

    expect(report.dryRun).toBe(true);
    expect(report.applied).toBe(false);
    expect(report.summary.wouldCreate).toBe(1);
    expect(report.summary.created).toBe(0);
    expect(report.summary.updated).toBe(0);
  });

  it('apply só grava quando confirmApply=true', async () => {
    let created = 0;
    const prisma = {
      occupationalBiologicalIndicator: {
        findMany: async () => [indicator],
      },
      examToRisk: {
        findMany: async () => [],
        create: async () => {
          created += 1;
          return { id: 1, examId: 10, riskId: 'risk-1', companyId: 'company-1' };
        },
        update: async () => {
          throw new Error('update should not be called');
        },
      },
    } as never;

    const service = new BiologicalIndicatorApplicationService(prisma);

    const dryApply = await service.applyApplication({
      confirmApply: false,
      userId: 1,
    });
    expect(dryApply.applied).toBe(false);
    expect(created).toBe(0);

    const realApply = await service.applyApplication({
      confirmApply: true,
      userId: 1,
    });
    expect(realApply.applied).toBe(true);
    expect(created).toBe(1);
    expect(realApply.summary.created).toBe(1);
  });

  it('bloqueia indicadores não elegíveis no preview', async () => {
    const prisma = {
      occupationalBiologicalIndicator: {
        findMany: async () => [
          {
            ...indicator,
            id: 'ind-draft',
            status: BiologicalIndicatorStatusEnum.DRAFT,
          },
        ],
      },
      examToRisk: {
        findMany: async () => [],
      },
    } as never;

    const service = new BiologicalIndicatorApplicationService(prisma);
    const report = await service.previewApplication();

    expect(report.summary.applicable).toBe(0);
    expect(report.summary.blocked).toBe(1);
    expect(report.blockedItems[0].action).toBe('BLOCKED');
  });
});
