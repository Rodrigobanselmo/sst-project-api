import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import {
  BiologicalCollectionMomentEnum,
  BiologicalNormativeSourceEnum,
} from '@prisma/client';

import { ExamTechnicalSuggestionService } from './exam-technical-suggestion.service';

describe('ExamTechnicalSuggestionService', () => {
  let service: ExamTechnicalSuggestionService;
  let prisma: {
    exam: { findFirst: jest.Mock<any> };
    biologicalIndicatorToExam: { findMany: jest.Mock<any> };
    riskFactors: { findFirst: jest.Mock<any> };
    pcmsoExamRiskRuleExam: { findFirst: jest.Mock<any> };
    pcmsoExamRiskRule: { findFirst: jest.Mock<any> };
    occupationalBiologicalIndicator: { findFirst: jest.Mock<any> };
  };

  beforeEach(() => {
    prisma = {
      exam: { findFirst: jest.fn() },
      biologicalIndicatorToExam: { findMany: jest.fn() },
      riskFactors: { findFirst: jest.fn() },
      pcmsoExamRiskRuleExam: { findFirst: jest.fn() },
      pcmsoExamRiskRule: { findFirst: jest.fn() },
      occupationalBiologicalIndicator: { findFirst: jest.fn() },
    };
    service = new ExamTechnicalSuggestionService(prisma as never);
  });

  it('retorna sugestão NR-7 para risco × exame existente', async () => {
    prisma.exam.findFirst.mockResolvedValue({
      id: 10,
      material: '',
      analyses: 'Quantitativo',
      instruction: null,
    });
    prisma.biologicalIndicatorToExam.findMany.mockResolvedValue([
      {
        isDefault: true,
        indicator: {
          normativeSource: BiologicalNormativeSourceEnum.NR_07,
          biologicalIndicatorOriginal: 'Acetona na urina',
          biologicalMatrix: 'urina',
          collectionMoment: BiologicalCollectionMomentEnum.FJ,
          referenceValue: '50',
          unit: 'mg/L',
          technicalObservationsRaw: 'NE',
          acgihBeiIndicator: null,
        },
      },
    ]);
    prisma.riskFactors.findFirst.mockResolvedValue({
      cas: '67-64-1',
      name: 'Acetona',
    });
    prisma.pcmsoExamRiskRuleExam.findFirst.mockResolvedValue(null);

    const result = await service.getSuggestion({
      companyId: 'company-1',
      riskFactorId: 'risk-acetona',
      examId: 10,
    });

    expect(result.source).toBe('NR_07');
    expect(result.material).toBe('urina');
    expect(result.shouldApply.material).toBe(true);
    expect(result.shouldApply.analyses).toBe(false);
    expect(result.shouldApply.instruction).toBe(true);
    expect(prisma.biologicalIndicatorToExam.findMany).toHaveBeenCalledTimes(1);
  });

  it('retorna NONE quando não há vínculo indicador', async () => {
    prisma.exam.findFirst.mockResolvedValue({
      id: 11,
      material: 'urina',
      analyses: 'Quantitativo',
      instruction: 'Manual',
    });
    prisma.biologicalIndicatorToExam.findMany.mockResolvedValue([]);
    prisma.riskFactors.findFirst.mockResolvedValue({ cas: null, name: 'Benzeno' });
    prisma.pcmsoExamRiskRuleExam.findFirst.mockResolvedValue(null);
    prisma.pcmsoExamRiskRule.findFirst.mockResolvedValue(null);

    const result = await service.getSuggestion({
      companyId: 'company-1',
      riskFactorId: 'risk-benzeno',
      examId: 11,
    });

    expect(result.source).toBe('NONE');
    expect(result.shouldApply).toEqual({
      material: false,
      analyses: false,
      instruction: false,
    });
  });

  it('lança NotFoundException quando exame não existe', async () => {
    prisma.exam.findFirst.mockResolvedValue(null);

    await expect(
      service.getSuggestion({
        companyId: 'company-1',
        riskFactorId: 'risk-1',
        examId: 999,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
