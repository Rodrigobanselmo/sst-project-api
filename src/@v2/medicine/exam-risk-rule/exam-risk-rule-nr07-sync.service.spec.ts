import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';

import { ExamRiskRuleNr07SyncService } from './exam-risk-rule-nr07-sync.service';

const indicatorFixture = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'ind-1',
    normativeSource: 'NR_07',
    tableNumber: 'QUADRO_1',
    indicatorType: 'IBE_EE',
    substanceName: 'Tolueno',
    casPrimary: '108-88-3',
    defaultValidityMonths: 12,
    collectionToleranceDays: 45,
    collectionMoment: 'FJFS',
    status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
    requiresNormativeReview: false,
    reviewedAt: null,
    deleted_at: null,
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
    ...overrides,
  }) as never;

describe('ExamRiskRuleNr07SyncService', () => {
  let service: ExamRiskRuleNr07SyncService;
  let repository: {
    findNr07IndicatorsForSync: jest.Mock;
    findRuleBySourceIndicator: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      findNr07IndicatorsForSync: jest.fn(() => Promise.resolve([])),
      findRuleBySourceIndicator: jest.fn(() => Promise.resolve(null)),
      create: jest.fn(() => Promise.resolve({ id: 'rule-1' })),
      update: jest.fn(() => Promise.resolve({ id: 'rule-1' })),
    };
    service = new ExamRiskRuleNr07SyncService(repository as never);
  });

  it('cria regra NR-07 quando não existe', async () => {
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture(),
    ] as never);

    const summary = await service.sync();

    expect(repository.create).toHaveBeenCalledTimes(1);
    const createArg: any = repository.create.mock.calls[0][0];
    expect(createArg.scope).toBe(PcmsoExamRiskRuleScopeEnum.AGENT);
    expect(createArg.source).toBe(PcmsoExamRiskRuleSourceEnum.NR_07);
    expect(createArg.sourceIndicatorId).toBe('ind-1');
    expect(createArg.isCurated).toBe(false);
    expect(createArg.exams.createMany.data[0].examId).toBe(50);
    expect(createArg.exams.createMany.data[0].considerBetweenDays).toBeNull();
    expect(createArg.exams.createMany.data[0].collectionToleranceDays).toBe(45);
    expect(createArg.exams.createMany.data[0].collectionMoment).toBe('FJFS');
    expect(createArg.exams.createMany.data[0].minRiskDegree).toBe(3);
    expect(summary.created).toBe(1);
    expect(summary.active).toBe(1);
  });

  it('é idempotente: segunda execução não duplica (unchanged)', async () => {
    const created: Record<string, unknown> = {};
    repository.create.mockImplementation((data: any) => {
      Object.assign(created, data, {
        id: 'rule-1',
        isCurated: false,
        exams: [data.exams.createMany.data[0]],
      });
      return Promise.resolve(created);
    });

    // 1ª execução: cria.
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture(),
    ] as never);
    await service.sync();

    // 2ª execução: regra já existe e está igual.
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture(),
    ] as never);
    repository.findRuleBySourceIndicator.mockResolvedValueOnce(created as never);

    const summary = await service.sync();

    expect(summary.created).toBe(0);
    expect(summary.unchanged).toBe(1);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('não sobrescreve regra isCurated = true', async () => {
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture(),
    ] as never);
    repository.findRuleBySourceIndicator.mockResolvedValueOnce({
      id: 'rule-1',
      isCurated: true,
      exams: [],
    } as never);

    const summary = await service.sync();

    expect(summary.curatedSkipped).toBe(1);
    expect(repository.update).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('atualiza regra existente não curada quando há mudança', async () => {
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture(),
    ] as never);
    repository.findRuleBySourceIndicator.mockResolvedValueOnce({
      id: 'rule-1',
      isCurated: false,
      scope: PcmsoExamRiskRuleScopeEnum.AGENT,
      status: PcmsoExamRiskRuleStatusEnum.DRAFT,
      agentCas: '108-88-3',
      agentName: 'Tolueno',
      agentNameNormalized: 'tolueno',
      riskNameSnapshot: 'Tolueno',
      rationale: 'desatualizado',
      exams: [],
    } as never);

    const summary = await service.sync();

    expect(summary.updated).toBe(1);
    expect(repository.update).toHaveBeenCalledTimes(1);
    const [, , examsReplacement]: any = repository.update.mock.calls[0];
    expect(examsReplacement[0].examId).toBe(50);
  });

  it('conta DRAFT e motivo quando falta exame default', async () => {
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture({ examLinks: [] }),
    ] as never);

    const summary = await service.sync();

    expect(summary.draft).toBe(1);
    expect(summary.active).toBe(0);
    expect(summary.draftReasons.EXAM_NOT_CONFIRMED).toBe(1);
    const createArg: any = repository.create.mock.calls[0][0];
    expect(createArg.status).toBe(PcmsoExamRiskRuleStatusEnum.DRAFT);
    expect(createArg.exams).toBeUndefined();
  });

  it('indicador não-ACTIVE é DRAFT por INDICATOR_NOT_ACTIVE (não some no resumo)', async () => {
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture({ status: 'DRAFT' }),
    ] as never);

    const summary = await service.sync();

    expect(summary.created).toBe(1);
    expect(summary.active).toBe(0);
    expect(summary.draft).toBe(1);
    expect(summary.draftReasons.INDICATOR_NOT_ACTIVE).toBe(1);
    // reconciliação: active + draft === created + updated + unchanged
    expect(summary.active + summary.draft).toBe(
      summary.created + summary.updated + summary.unchanged,
    );
  });

  it('gera regra por AGENT mesmo sem CAS (com substanceName)', async () => {
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture({ casPrimary: null }),
    ] as never);

    await service.sync();

    const createArg: any = repository.create.mock.calls[0][0];
    expect(createArg.scope).toBe(PcmsoExamRiskRuleScopeEnum.AGENT);
    expect(createArg.agentCas).toBeNull();
    expect(createArg.agentName).toBe('Tolueno');
  });

  it('não chama nenhuma escrita em ExamToRisk (repo só tem métodos da biblioteca)', async () => {
    repository.findNr07IndicatorsForSync.mockResolvedValueOnce([
      indicatorFixture(),
    ] as never);

    await service.sync();

    expect(repository).not.toHaveProperty('examToRiskCreate');
    expect(Object.keys(repository)).toEqual([
      'findNr07IndicatorsForSync',
      'findRuleBySourceIndicator',
      'create',
      'update',
    ]);
  });
});
