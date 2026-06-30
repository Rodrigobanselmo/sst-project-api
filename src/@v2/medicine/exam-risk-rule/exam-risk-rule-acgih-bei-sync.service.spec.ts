import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
  Prisma,
} from '@prisma/client';

import {
  EXAM_RISK_RULE_SYNC_ACGIH_CONFIRM_TEXT,
  ExamRiskRuleSyncAcgihBody,
} from './exam-risk-rule-acgih-bei-sync.dto';
import { ExamRiskRuleAcgihBeiSyncService } from './exam-risk-rule-acgih-bei-sync.service';

const acgihFixture = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'acgih-official-1',
    substanceName: 'n-Heptano',
    acgihBeiIndicatorId: 'staging-acgih-1',
    normativeVersion: 'ACGIH-2024',
    referenceValue: '140',
    unit: 'µg/L',
    collectionMoment: 'FINAL_EXPOSURE',
    biologicalIndicatorOriginal: '2,5-heptanodiona',
    biologicalMatrix: 'urina',
    defaultValidityMonths: 6,
    collectionToleranceDays: null,
    deleted_at: null,
    riskLinks: [
      {
        id: 'rl-1',
        riskFactorId: 'risk-heptano',
        deleted_at: null,
        isConfirmed: true,
        isPrimary: true,
        riskFactor: {
          id: 'risk-heptano',
          name: 'Heptano, todos os isômeros',
          cas: '142-82-5',
          system: true,
          deleted_at: null,
        },
      },
    ],
    examLinks: [
      {
        id: 'el-1',
        examId: 99,
        deleted_at: null,
        isConfirmed: true,
        isDefault: true,
        examNameSnapshot: '2,5-heptanodiona',
        exam: {
          id: 99,
          name: '2,5-heptanodiona urinária',
          system: true,
          deleted_at: null,
        },
      },
    ],
    ...overrides,
  }) as never;

const p2002 = () =>
  new Prisma.PrismaClientKnownRequestError('dup', {
    code: 'P2002',
    clientVersion: '5.22.0',
  });

type Ctx = {
  service: ExamRiskRuleAcgihBeiSyncService;
  ruleRepo: {
    findAcgihIndicatorsForSync: jest.Mock;
    findNr07RuleByAgentAndExam: jest.Mock;
    findRuleBySourceAndIndicator: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  refRepo: {
    findRawByRuleAndAcgih: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

const buildCtx = (indicators: unknown[]): Ctx => {
  const ruleRepo = {
    findAcgihIndicatorsForSync: jest
      .fn()
      .mockResolvedValue(indicators as never),
    findNr07RuleByAgentAndExam: jest.fn().mockResolvedValue(null as never),
    findRuleBySourceAndIndicator: jest.fn().mockResolvedValue(null as never),
    create: jest.fn().mockResolvedValue({ id: 'rule-tech-1' } as never),
    update: jest.fn().mockResolvedValue({ id: 'rule-tech-1' } as never),
  };
  const refRepo = {
    findRawByRuleAndAcgih: jest.fn().mockResolvedValue(null as never),
    create: jest.fn().mockResolvedValue({ id: 'ref-1' } as never),
    update: jest.fn().mockResolvedValue({ id: 'ref-1' } as never),
  };
  const service = new ExamRiskRuleAcgihBeiSyncService(
    ruleRepo as never,
    refRepo as never,
  );
  return { service, ruleRepo, refRepo };
};

describe('ExamRiskRuleSyncAcgihBody (confirmText)', () => {
  it('confirmText inválido reprova validação', async () => {
    const dto = plainToInstance(ExamRiskRuleSyncAcgihBody, {
      confirmText: 'errado',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'confirmText')).toBe(true);
  });

  it('confirmText exato é aceito', async () => {
    const dto = plainToInstance(ExamRiskRuleSyncAcgihBody, {
      confirmText: EXAM_RISK_RULE_SYNC_ACGIH_CONFIRM_TEXT,
    });
    expect(await validate(dto)).toHaveLength(0);
  });
});

describe('ExamRiskRuleAcgihBeiSyncService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cria regra própria TECHNICAL quando não há NR-07 equivalente', async () => {
    const { service, ruleRepo } = buildCtx([acgihFixture()]);

    const res = await service.sync({ userId: 1 });

    expect(ruleRepo.create).toHaveBeenCalledTimes(1);
    const arg: any = ruleRepo.create.mock.calls[0][0];
    expect(arg.source).toBe(PcmsoExamRiskRuleSourceEnum.TECHNICAL);
    expect(arg.scope).toBe(PcmsoExamRiskRuleScopeEnum.AGENT);
    expect(arg.agentName).toBe('Heptano, todos os isômeros');
    expect(arg.exams.createMany.data[0].examId).toBe(99);
    expect(res.totals.rulesCreated).toBe(1);
    expect(res.items[0].action).toBe('ruleCreated');
  });

  it('anexa referência ACGIH em regra NR-07 existente (não cria regra nova)', async () => {
    const { service, ruleRepo, refRepo } = buildCtx([acgihFixture()]);
    ruleRepo.findNr07RuleByAgentAndExam.mockResolvedValue({
      id: 'nr7-rule-1',
      isCurated: false,
    } as never);

    const res = await service.sync({ userId: 2 });

    expect(ruleRepo.create).not.toHaveBeenCalled();
    expect(refRepo.create).toHaveBeenCalledTimes(1);
    expect(res.totals.referencesCreated).toBe(1);
    expect(res.items[0]).toMatchObject({
      action: 'referenceCreated',
      ruleId: 'nr7-rule-1',
    });
  });

  it('bloqueia quando não há exame vinculado', async () => {
    const { service, ruleRepo } = buildCtx([
      acgihFixture({ examLinks: [] }),
    ]);

    const res = await service.sync({ userId: 1 });

    expect(ruleRepo.create).not.toHaveBeenCalled();
    expect(res.totals.blocked).toBe(1);
    expect(res.items[0]).toMatchObject({
      action: 'blocked',
      reason: 'Sem exame vinculado ao indicador ACGIH/BEI',
    });
  });

  it('bloqueia com motivo específico quando há exame não confirmado', async () => {
    const { service, ruleRepo } = buildCtx([
      acgihFixture({
        examLinks: [
          {
            id: 'el-1',
            examId: 99,
            deleted_at: null,
            isConfirmed: false,
            isDefault: true,
            examNameSnapshot: '2,5-heptanodiona',
            exam: {
              id: 99,
              name: '2,5-heptanodiona urinária',
              system: true,
              deleted_at: null,
            },
          },
        ],
      }),
    ]);

    const res = await service.sync({ userId: 1 });

    expect(ruleRepo.create).not.toHaveBeenCalled();
    expect(res.totals.blocked).toBe(1);
    expect(res.items[0]).toMatchObject({
      action: 'blocked',
      reason: 'Exame vinculado pendente de confirmação (isConfirmed=false)',
    });
  });

  it('bloqueia quando não há vínculo de risco confirmado', async () => {
    const { service, ruleRepo } = buildCtx([
      acgihFixture({ riskLinks: [] }),
    ]);

    const res = await service.sync({ userId: 1 });

    expect(ruleRepo.create).not.toHaveBeenCalled();
    expect(res.items[0].action).toBe('blocked');
    expect(res.items[0].reason).toContain('Fator de Risco');
  });

  it('TDI: processa dois vínculos de risco (duas ações)', async () => {
    const tdi = acgihFixture({
      id: 'tdi-official',
      substanceName: 'TDI',
      riskLinks: [
        {
          id: 'rl-24',
          riskFactorId: 'risk-24',
          deleted_at: null,
          isConfirmed: true,
          isPrimary: false,
          riskFactor: {
            id: 'risk-24',
            name: '2,4 Diisocianato de tolueno',
            cas: null,
            system: true,
            deleted_at: null,
          },
        },
        {
          id: 'rl-26',
          riskFactorId: 'risk-26',
          deleted_at: null,
          isConfirmed: true,
          isPrimary: false,
          riskFactor: {
            id: 'risk-26',
            name: '2,6 Diisocianato de tolueno',
            cas: null,
            system: true,
            deleted_at: null,
          },
        },
      ],
    });
    const { service, ruleRepo } = buildCtx([tdi]);

    const res = await service.sync({ userId: 1 });

    expect(ruleRepo.create).toHaveBeenCalledTimes(2);
    expect(res.items).toHaveLength(2);
    expect(res.totals.rulesCreated).toBe(2);
  });

  it('idempotência: referência já ativa => alreadySynced', async () => {
    const { service, ruleRepo, refRepo } = buildCtx([acgihFixture()]);
    ruleRepo.findNr07RuleByAgentAndExam.mockResolvedValue({
      id: 'nr7-rule-1',
    } as never);
    refRepo.findRawByRuleAndAcgih.mockResolvedValue({
      id: 'ref-existing',
      deleted_at: null,
      status: 'ACTIVE',
    } as never);

    const res = await service.sync({ userId: 1 });

    expect(refRepo.create).not.toHaveBeenCalled();
    expect(res.items[0].action).toBe('alreadySynced');
  });

  it('P2002 na referência vira alreadySynced', async () => {
    const { service, ruleRepo, refRepo } = buildCtx([acgihFixture()]);
    ruleRepo.findNr07RuleByAgentAndExam.mockResolvedValue({
      id: 'nr7-rule-1',
    } as never);
    refRepo.create.mockRejectedValue(p2002() as never);
    refRepo.findRawByRuleAndAcgih
      .mockResolvedValueOnce(null as never)
      .mockResolvedValueOnce({
        id: 'ref-race',
        deleted_at: null,
        status: 'ACTIVE',
      } as never);

    const res = await service.sync({ userId: 1 });

    expect(res.items[0].action).toBe('alreadySynced');
  });

  it('dryRun não grava', async () => {
    const { service, ruleRepo, refRepo } = buildCtx([acgihFixture()]);

    await service.sync({ userId: 1, dryRun: true });

    expect(ruleRepo.create).not.toHaveBeenCalled();
    expect(refRepo.create).not.toHaveBeenCalled();
  });
});
