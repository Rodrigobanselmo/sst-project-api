import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { PcmsoAcgihBeiComparisonDecisionEnum } from '@prisma/client';

import { AcgihBeiComparisonService } from '../acgih-bei-comparison/acgih-bei-comparison.service';
import {
  AcgihBeiComparisonStatus,
  AcgihBeiOperationalStatus,
  AcgihBeiSuggestedAction,
  ComparisonResult,
  ComparisonReviewInfo,
  MatchStatus,
} from '../acgih-bei-comparison/acgih-bei-comparison.util';
import { ExamRiskRuleReferenceRepository } from './exam-risk-rule-reference.repository';
import { ExamRiskRuleReferenceService } from './exam-risk-rule-reference.service';

const ACGIH_ID = 'acgih-1';
const RULE_ID = 'rule-1';

const buildRow = (over: Partial<ComparisonResult> = {}): ComparisonResult => ({
  acgihBeiId: ACGIH_ID,
  substanceName: 'Tolueno',
  cas: '108-88-3',
  determinant: 'o-Cresol',
  biologicalMatrix: 'Urina',
  samplingTime: 'Final da jornada',
  beiValue: '0.3',
  unit: 'mg/L',
  confidence: null,
  nr7MatchStatus: MatchStatus.FULL,
  nr7IndicatorId: 'nr7-1',
  nr7SubstanceName: 'Tolueno',
  nr7IndicatorName: 'o-Cresol',
  examRiskRuleMatchStatus: MatchStatus.FULL,
  examRiskRuleId: RULE_ID,
  examRiskRuleSource: 'NR_07',
  examNameSnapshot: 'Hemograma',
  ruleMatchMethod: 'VIA_NR7',
  comparisonStatus: AcgihBeiComparisonStatus.ALREADY_COVERED,
  suggestedAction: AcgihBeiSuggestedAction.ADD_REFERENCE_ONLY,
  technicalDiff: '',
  reviewNotes: '',
  ...over,
});

const buildService = () => {
  const repository = {
    findRuleById: jest.fn(),
    findAcgihIndicatorById: jest.fn(),
    findRawByRuleAndAcgih: jest.fn(),
    findById: jest.fn(),
    listByRule: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<ExamRiskRuleReferenceRepository>;

  const comparisonService = {
    computeAll: jest.fn(),
  } as unknown as jest.Mocked<AcgihBeiComparisonService>;

  const service = new ExamRiskRuleReferenceService(
    repository,
    comparisonService,
  );
  return { service, repository, comparisonService };
};

const okIndicator = {
  id: ACGIH_ID,
  substanceName: 'Tolueno',
  determinant: 'o-Cresol',
  biologicalMatrix: 'Urina',
  samplingTime: 'Final da jornada',
  referenceYear: 2024,
  sourceYear: null,
};

describe('ExamRiskRuleReferenceService.applyAcgihReference', () => {
  let ctx: ReturnType<typeof buildService>;

  beforeEach(() => {
    ctx = buildService();
    (ctx.repository.findRuleById as jest.Mock).mockResolvedValue({
      id: RULE_ID,
      source: 'NR_07',
      status: 'ACTIVE',
      deleted_at: null,
    } as never);
    (ctx.repository.findAcgihIndicatorById as jest.Mock).mockResolvedValue(
      okIndicator as never,
    );
    (ctx.repository.create as jest.Mock).mockImplementation((data: unknown) =>
      Promise.resolve({ id: 'ref-1', ...(data as object) } as never),
    );
    (ctx.repository.update as jest.Mock).mockImplementation(
      (id: string, data: unknown) =>
        Promise.resolve({ id, ...(data as object) } as never),
    );
  });

  it('cria a referência quando elegível e inexistente (CREATED)', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([buildRow()] as never);
    (ctx.repository.findRawByRuleAndAcgih as jest.Mock).mockResolvedValue(
      null as never,
    );

    const res = await ctx.service.applyAcgihReference({
      acgihBeiIndicatorId: ACGIH_ID,
      userId: 7,
    });

    expect(res.outcome).toBe('CREATED');
    expect(ctx.repository.create).toHaveBeenCalledTimes(1);
  });

  it('é idempotente: não duplica quando já existe ativa (UNCHANGED)', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([buildRow()] as never);
    (ctx.repository.findRawByRuleAndAcgih as jest.Mock).mockResolvedValue({
      id: 'ref-1',
      ruleId: RULE_ID,
      status: 'ACTIVE',
      deleted_at: null,
    } as never);

    const res = await ctx.service.applyAcgihReference({
      acgihBeiIndicatorId: ACGIH_ID,
    });

    expect(res.outcome).toBe('UNCHANGED');
    expect(ctx.repository.create).not.toHaveBeenCalled();
    expect(ctx.repository.update).not.toHaveBeenCalled();
  });

  it('restaura quando existe soft-deleted/inativa (RESTORED)', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([buildRow()] as never);
    (ctx.repository.findRawByRuleAndAcgih as jest.Mock).mockResolvedValue({
      id: 'ref-1',
      ruleId: RULE_ID,
      status: 'INACTIVE',
      deleted_at: new Date(),
    } as never);

    const res = await ctx.service.applyAcgihReference({
      acgihBeiIndicatorId: ACGIH_ID,
    });

    expect(res.outcome).toBe('RESTORED');
    expect(ctx.repository.update).toHaveBeenCalledTimes(1);
    expect(ctx.repository.create).not.toHaveBeenCalled();
  });

  it('bloqueia quando o item não está na comparação', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([] as never);
    await expect(
      ctx.service.applyAcgihReference({ acgihBeiIndicatorId: ACGIH_ID }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it.each([
    AcgihBeiComparisonStatus.NEW_CANDIDATE,
    AcgihBeiComparisonStatus.DIVERGENT,
    AcgihBeiComparisonStatus.NEEDS_REVIEW,
    AcgihBeiComparisonStatus.LOW_CONFIDENCE_REVIEW,
  ])('bloqueia status não elegível: %s', async (status) => {
    ctx.comparisonService.computeAll.mockResolvedValue([
      buildRow({ comparisonStatus: status }),
    ] as never);
    await expect(
      ctx.service.applyAcgihReference({ acgihBeiIndicatorId: ACGIH_ID }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(ctx.repository.create).not.toHaveBeenCalled();
  });

  it('bloqueia ALREADY_COVERED sem regra resolvida', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([
      buildRow({ examRiskRuleId: null }),
    ] as never);
    await expect(
      ctx.service.applyAcgihReference({ acgihBeiIndicatorId: ACGIH_ID }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(ctx.repository.create).not.toHaveBeenCalled();
  });

  it('bloqueia quando a ação sugerida não é ADD_REFERENCE_ONLY', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([
      buildRow({
        suggestedAction: AcgihBeiSuggestedAction.IGNORE_OR_MONITOR,
      }),
    ] as never);
    await expect(
      ctx.service.applyAcgihReference({ acgihBeiIndicatorId: ACGIH_ID }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  // 4O.3 — caminho de equivalência técnica.
  const equivalenceReview: ComparisonReviewInfo = {
    id: 'rev-1',
    decision: PcmsoAcgihBeiComparisonDecisionEnum.FALSE_DIVERGENCE_EQUIVALENT,
    technicalNote: 'Equivalência nomenclatural FJFS.',
    comparisonStatusSnapshot: AcgihBeiComparisonStatus.DIVERGENT,
    suggestedActionSnapshot: AcgihBeiSuggestedAction.REVIEW_DIVERGENCE,
    isStale: false,
    reviewedById: 1,
    reviewedByName: 'Curador',
    reviewedAt: new Date().toISOString(),
  };

  const equivalenceRow = (over: Partial<ComparisonResult> = {}) =>
    buildRow({
      comparisonStatus: AcgihBeiComparisonStatus.DIVERGENT,
      suggestedAction: AcgihBeiSuggestedAction.REVIEW_DIVERGENCE,
      operationalStatus: AcgihBeiOperationalStatus.RESOLVED_EQUIVALENCE,
      review: equivalenceReview,
      acgihBeiStatus: 'ACTIVE',
      acgihBeiIsCurated: true,
      nr7Status: 'ACTIVE',
      examRiskRuleStatus: 'ACTIVE',
      examRiskRuleIsCurated: true,
      ...over,
    });

  it('permite equivalência técnica com readiness seguro (CREATED)', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([
      equivalenceRow(),
    ] as never);
    (ctx.repository.findRawByRuleAndAcgih as jest.Mock).mockResolvedValue(
      null as never,
    );

    const res = await ctx.service.applyAcgihReference({
      acgihBeiIndicatorId: ACGIH_ID,
    });

    expect(res.outcome).toBe('CREATED');
    expect(ctx.repository.create).toHaveBeenCalledTimes(1);
  });

  it('permite equivalência via operationalStatus RESOLVED_EQUIVALENCE sem review.decision no helper', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([
      equivalenceRow({
        review: {
          ...equivalenceReview,
          decision:
            PcmsoAcgihBeiComparisonDecisionEnum.FALSE_DIVERGENCE_EQUIVALENT,
        },
        operationalStatus: AcgihBeiOperationalStatus.RESOLVED_EQUIVALENCE,
      }),
    ] as never);
    (ctx.repository.findRawByRuleAndAcgih as jest.Mock).mockResolvedValue(
      null as never,
    );

    const res = await ctx.service.applyAcgihReference({
      acgihBeiIndicatorId: ACGIH_ID,
    });

    expect(res.outcome).toBe('CREATED');
  });

  it('bloqueia equivalência com decisão desatualizada (isStale)', async () => {
    ctx.comparisonService.computeAll.mockResolvedValue([
      equivalenceRow({
        review: { ...equivalenceReview, isStale: true },
      }),
    ] as never);
    await expect(
      ctx.service.applyAcgihReference({ acgihBeiIndicatorId: ACGIH_ID }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(ctx.repository.create).not.toHaveBeenCalled();
  });

  it.each([
    ['ACGIH inativo', { acgihBeiStatus: 'DRAFT' }],
    ['ACGIH não curado', { acgihBeiIsCurated: false }],
    ['NR-7 inativo', { nr7Status: 'DRAFT' }],
    ['regra inativa', { examRiskRuleStatus: 'DRAFT' }],
    ['regra não curada', { examRiskRuleIsCurated: false }],
  ])(
    'bloqueia equivalência com readiness incompleto: %s',
    async (_label, patch) => {
      ctx.comparisonService.computeAll.mockResolvedValue([
        equivalenceRow(patch as Partial<ComparisonResult>),
      ] as never);
      await expect(
        ctx.service.applyAcgihReference({ acgihBeiIndicatorId: ACGIH_ID }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(ctx.repository.create).not.toHaveBeenCalled();
    },
  );

  it.each([
    PcmsoAcgihBeiComparisonDecisionEnum.REAL_DIVERGENCE,
    PcmsoAcgihBeiComparisonDecisionEnum.SOURCE_ACGIH_ERROR,
    PcmsoAcgihBeiComparisonDecisionEnum.SOURCE_NR7_ERROR,
    PcmsoAcgihBeiComparisonDecisionEnum.NEEDS_FURTHER_REVIEW,
    PcmsoAcgihBeiComparisonDecisionEnum.IGNORE_MONITOR,
    // 4O.5 — "candidato ACGIH confirmado" (sem match) não recebe fonte complementar.
    PcmsoAcgihBeiComparisonDecisionEnum.NO_MATCH_CONFIRMED,
  ])('bloqueia equivalência para decisão %s', async (decision) => {
    ctx.comparisonService.computeAll.mockResolvedValue([
      equivalenceRow({
        review: { ...equivalenceReview, decision },
      }),
    ] as never);
    await expect(
      ctx.service.applyAcgihReference({ acgihBeiIndicatorId: ACGIH_ID }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(ctx.repository.create).not.toHaveBeenCalled();
  });
});

describe('ExamRiskRuleReferenceService.remove', () => {
  it('soft-deleta a fonte complementar existente', async () => {
    const { service, repository } = buildService();
    (repository.findRuleById as jest.Mock).mockResolvedValue({
      id: RULE_ID,
    } as never);
    (repository.findById as jest.Mock).mockResolvedValue({
      id: 'ref-1',
      ruleId: RULE_ID,
      deleted_at: null,
    } as never);
    (repository.update as jest.Mock).mockResolvedValue({} as never);

    const res = await service.remove({
      ruleId: RULE_ID,
      referenceId: 'ref-1',
      userId: 9,
    });

    expect(res).toEqual({ id: 'ref-1', removed: true });
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it('falha quando a referência não pertence à regra', async () => {
    const { service, repository } = buildService();
    (repository.findRuleById as jest.Mock).mockResolvedValue({
      id: RULE_ID,
    } as never);
    (repository.findById as jest.Mock).mockResolvedValue({
      id: 'ref-1',
      ruleId: 'outra-regra',
      deleted_at: null,
    } as never);

    await expect(
      service.remove({ ruleId: RULE_ID, referenceId: 'ref-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
