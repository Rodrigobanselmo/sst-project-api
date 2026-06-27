import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ExamRiskRuleImportApplyService } from './exam-risk-rule-import-apply.service';
import {
  ExamRiskRuleImportModel,
  ExamRiskRuleImportTotals,
} from './exam-risk-rule-import-preview.service';

const totals = (overrides: Partial<ExamRiskRuleImportTotals> = {}): ExamRiskRuleImportTotals => ({
  read: 0,
  valid: 0,
  create: 0,
  update: 0,
  unchanged: 0,
  rejected: 0,
  conflict: 0,
  invalid: 0,
  ...overrides,
});

const examData = {
  examId: 10,
  examNameSnapshot: 'Hemograma',
  validityInMonths: 6,
  considerBetweenDays: null,
  collectionToleranceDays: null,
  collectionMoment: null,
  fromAge: null,
  toAge: null,
  minRiskDegree: null,
  minRiskDegreeQuantity: null,
  isMale: true,
  isFemale: true,
  isAdmission: true,
  isPeriodic: false,
  isChange: false,
  isReturn: false,
  isDismissal: false,
};

describe('ExamRiskRuleImportApplyService', () => {
  let service: ExamRiskRuleImportApplyService;
  let repository: { applyImportBatch: jest.Mock };
  let previewService: { buildModel: jest.Mock };

  beforeEach(() => {
    repository = { applyImportBatch: jest.fn(() => Promise.resolve()) };
    previewService = { buildModel: jest.fn() };
    service = new ExamRiskRuleImportApplyService(
      repository as never,
      previewService as never,
    );
  });

  it('aplica plano (rule update + exam update) em transação única', async () => {
    const model: ExamRiskRuleImportModel = {
      fileName: 'f.xlsx',
      totals: totals({ read: 1, valid: 1, update: 1 }),
      lines: [],
      plan: [
        {
          ruleId: 'r1',
          ruleUpdateData: { status: 'ACTIVE', isCurated: true },
          examCreates: [],
          examUpdates: [{ id: 're1', rowNumber: 2, data: examData }],
        },
      ],
    };
    previewService.buildModel.mockResolvedValue(model as never);

    const result = await service.apply({
      buffer: Buffer.from('x'),
      fileName: 'f.xlsx',
    });

    expect(repository.applyImportBatch).toHaveBeenCalledTimes(1);
    const arg = repository.applyImportBatch.mock.calls[0][0] as {
      ruleUpdates: unknown[];
      examCreates: unknown[];
      examUpdates: unknown[];
    };
    expect(arg.ruleUpdates).toHaveLength(1);
    expect(arg.examUpdates).toHaveLength(1);
    expect(arg.examCreates).toHaveLength(0);
    expect(result.applied.rulesUpdated).toBe(1);
    expect(result.applied.examsUpdated).toBe(1);
    expect(result.affectedRuleIds).toEqual(['r1']);
  });

  it('idempotente: plano vazio não chama o banco (0 writes)', async () => {
    previewService.buildModel.mockResolvedValue({
      fileName: 'f.xlsx',
      totals: totals({ read: 3, valid: 3, unchanged: 3 }),
      lines: [],
      plan: [],
    } as never);

    const result = await service.apply({
      buffer: Buffer.from('x'),
      fileName: 'f.xlsx',
    });

    expect(repository.applyImportBatch).not.toHaveBeenCalled();
    expect(result.applied.rulesUpdated).toBe(0);
    expect(result.applied.examsCreated).toBe(0);
    expect(result.applied.examsUpdated).toBe(0);
    expect(result.applied.unchanged).toBe(3);
  });

  it('agrega creates e updates de múltiplas regras', async () => {
    previewService.buildModel.mockResolvedValue({
      fileName: 'f.xlsx',
      totals: totals({ read: 2, valid: 2, create: 1, update: 1 }),
      lines: [],
      plan: [
        {
          ruleId: 'r1',
          ruleUpdateData: null,
          examCreates: [{ rowNumber: 2, data: examData }],
          examUpdates: [],
        },
        {
          ruleId: 'r2',
          ruleUpdateData: { isCurated: true },
          examCreates: [],
          examUpdates: [{ id: 're9', rowNumber: 3, data: examData }],
        },
      ],
    } as never);

    const result = await service.apply({
      buffer: Buffer.from('x'),
      fileName: 'f.xlsx',
    });

    expect(result.applied.examsCreated).toBe(1);
    expect(result.applied.examsUpdated).toBe(1);
    expect(result.applied.rulesUpdated).toBe(1);
    expect(result.affectedRuleIds).toEqual(['r1', 'r2']);
  });
});
