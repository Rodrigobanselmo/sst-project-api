import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import {
  BiologicalCollectionMomentEnum,
  BiologicalIndicatorDataOriginEnum,
  BiologicalIndicatorStatusEnum,
  BiologicalNormativeSourceEnum,
  Prisma,
} from '@prisma/client';

import { ProposedOfficialIndicatorPayload } from './acgih-official-indicator-preview.mapper';
import { AcgihOfficialIndicatorApplyService } from './acgih-official-indicator-apply.service';
import {
  AcgihPromotionDuplicateRisk,
  AcgihPromotionEligibilityStatus,
  AcgihPromotionEligibilityTier,
  AcgihPromotionMomentConfidence,
  AcgihPromotionPreviewItem,
} from './acgih-official-indicator-preview.util';

const makePayload = (
  id: string,
  over: Partial<ProposedOfficialIndicatorPayload> = {},
): ProposedOfficialIndicatorPayload => ({
  normativeSource: BiologicalNormativeSourceEnum.ACGIH_BEI,
  dataOrigin: BiologicalIndicatorDataOriginEnum.ACGIH_BEI_COMPARISON,
  acgihBeiIndicatorId: id,
  substanceName: 'Tolueno',
  substanceNameNormalized: 'tolueno',
  casPrimary: '108-88-3',
  casNumbers: ['108-88-3'],
  biologicalIndicatorOriginal: 'o-Cresol',
  biologicalIndicatorNormalized: 'o-cresol',
  biologicalMatrix: 'urina',
  collectionMoment: BiologicalCollectionMomentEnum.FJ,
  referenceValue: '0,3 mg/L',
  referenceValueRaw: '0,3 mg/L',
  unit: 'mg/L',
  normativeVersion: 'ACGIH-2024',
  sourcePage: '120',
  status: BiologicalIndicatorStatusEnum.DRAFT,
  requiresNormativeReview: true,
  occupationalApplicability: {
    isPeriodic: true,
    isAdmission: false,
    isReturn: false,
    isChange: false,
    isDismissal: false,
    allowSeasonalAnnual: false,
    clinicalSignificance: true,
    requiresMedicalReview: true,
  },
  idempotencyKey: `acgih-bei::${id}`,
  ...over,
});

const makeItem = (
  id: string,
  over: Partial<AcgihPromotionPreviewItem> = {},
): AcgihPromotionPreviewItem =>
  ({
    acgihBeiIndicatorId: id,
    substanceName: 'Tolueno',
    cas: '108-88-3',
    determinant: 'o-Cresol',
    biologicalMatrix: 'urina',
    samplingTime: 'Fim da jornada',
    referenceValue: '0,3 mg/L',
    unit: 'mg/L',
    notation: 'B',
    sourceYear: 2024,
    proposedNormativeVersion: 'ACGIH-2024',
    sourcePage: '120',
    eligibilityTier: AcgihPromotionEligibilityTier.PRIMARY,
    eligibilityStatus: AcgihPromotionEligibilityStatus.ELIGIBLE,
    eligibilityReason: 'ok',
    blockers: [],
    warnings: [],
    duplicateRisk: AcgihPromotionDuplicateRisk.NONE,
    mappedFields: {
      collectionMoment: {
        original: 'Fim da jornada',
        mappedValue: BiologicalCollectionMomentEnum.FJ,
        confidence: AcgihPromotionMomentConfidence.SAFE,
      },
    },
    missingFields: [],
    proposedOfficialPayload: makePayload(id),
    comparisonSnapshot: {
      comparisonStatus: 'NEW_CANDIDATE',
      operationalStatus: 'ACGIH_CANDIDATE_CONFIRMED',
      reviewDecision: 'NO_MATCH_CONFIRMED',
      reviewNote: 'Sem correspondência.',
      hasComplementaryReference: false,
    },
    ...over,
  }) as AcgihPromotionPreviewItem;

type Ctx = {
  service: AcgihOfficialIndicatorApplyService;
  preview: { computeEvaluatedItems: jest.Mock };
  create: jest.Mock;
};

const buildCtx = (items: AcgihPromotionPreviewItem[]): Ctx => {
  const create = jest.fn();
  const tx = { occupationalBiologicalIndicator: { create } };
  const prisma = {
    $transaction: jest.fn(async (cb: any) => cb(tx)),
  } as any;
  const preview = {
    computeEvaluatedItems: jest.fn().mockResolvedValue(items as never),
  };
  const service = new AcgihOfficialIndicatorApplyService(
    prisma,
    preview as any,
  );
  return { service, preview, create };
};

describe('AcgihOfficialIndicatorApplyService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cria DRAFT ACGIH_BEI para ELIGIBLE PRIMARY', async () => {
    const { service, create } = buildCtx([makeItem('a1')]);
    create.mockResolvedValue({ id: 'off-1' } as never);

    const res = await service.apply({ userId: 7 });

    expect(res.totals).toMatchObject({
      requested: 1,
      eligible: 1,
      created: 1,
      skipped: 0,
      blocked: 0,
    });
    expect(res.items[0]).toMatchObject({
      acgihBeiIndicatorId: 'a1',
      status: 'created',
      occupationalBiologicalIndicatorId: 'off-1',
    });

    const data = (create.mock.calls[0][0] as { data: any }).data;
    expect(data).toMatchObject({
      normativeSource: BiologicalNormativeSourceEnum.ACGIH_BEI,
      dataOrigin: BiologicalIndicatorDataOriginEnum.ACGIH_BEI_COMPARISON,
      status: BiologicalIndicatorStatusEnum.DRAFT,
      requiresNormativeReview: true,
      acgihBeiIndicatorId: 'a1',
      idempotencyKey: 'acgih-bei::a1',
      annex: null,
      tableNumber: null,
      indicatorType: null,
      reviewedById: null,
      reviewedAt: null,
    });
    expect(data.reviewNotes).toContain('Promovido da comparação ACGIH/BEI por 7');
    expect(data.reviewNotes).toContain('DRAFT');
  });

  it('só aplica os ids solicitados quando há lista explícita', async () => {
    const { service, create } = buildCtx([makeItem('a1'), makeItem('a2')]);
    create.mockResolvedValue({ id: 'off' } as never);

    const res = await service.apply({ acgihBeiIndicatorIds: ['a2'], userId: 1 });

    expect(res.totals.requested).toBe(1);
    expect(res.items[0].acgihBeiIndicatorId).toBe('a2');
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('aplica todos os ELIGIBLE quando a lista é omitida (ignora não-elegíveis)', async () => {
    const { service, create } = buildCtx([
      makeItem('a1'),
      makeItem('b1', {
        eligibilityStatus: AcgihPromotionEligibilityStatus.BLOCKED,
        blockers: ['LOW_CONFIDENCE'],
      }),
    ]);
    create.mockResolvedValue({ id: 'off' } as never);

    const res = await service.apply({ userId: 1 });

    expect(res.totals.requested).toBe(1);
    expect(res.totals.created).toBe(1);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('WARNING não cria (bloqueado no MVP)', async () => {
    const { service, create } = buildCtx([
      makeItem('w1', {
        eligibilityStatus: AcgihPromotionEligibilityStatus.WARNING,
        warnings: ['Possível equivalente NR-7.'],
      }),
    ]);

    const res = await service.apply({ acgihBeiIndicatorIds: ['w1'], userId: 1 });

    expect(res.totals).toMatchObject({ created: 0, blocked: 1 });
    expect(res.items[0].status).toBe('blocked');
    expect(create).not.toHaveBeenCalled();
  });

  it('BLOCKED não cria', async () => {
    const { service, create } = buildCtx([
      makeItem('b1', {
        eligibilityStatus: AcgihPromotionEligibilityStatus.BLOCKED,
        blockers: ['UNMAPPED_COLLECTION_MOMENT'],
      }),
    ]);

    const res = await service.apply({ acgihBeiIndicatorIds: ['b1'], userId: 1 });

    expect(res.items[0].status).toBe('blocked');
    expect(create).not.toHaveBeenCalled();
  });

  it('item já promovido (ALREADY_PROMOTED) vira skipped', async () => {
    const { service, create } = buildCtx([
      makeItem('p1', {
        eligibilityStatus: AcgihPromotionEligibilityStatus.BLOCKED,
        blockers: ['ALREADY_PROMOTED'],
        duplicateRisk: AcgihPromotionDuplicateRisk.ALREADY_PROMOTED,
      }),
    ]);

    const res = await service.apply({ acgihBeiIndicatorIds: ['p1'], userId: 1 });

    expect(res.totals).toMatchObject({ skipped: 1, created: 0, blocked: 0 });
    expect(res.items[0].status).toBe('skipped');
    expect(create).not.toHaveBeenCalled();
  });

  it('P2002 na gravação vira skipped (corrida)', async () => {
    const { service, create } = buildCtx([makeItem('a1')]);
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: '5.22.0',
      }) as never,
    );

    const res = await service.apply({ acgihBeiIndicatorIds: ['a1'], userId: 1 });

    expect(res.totals).toMatchObject({ created: 0, skipped: 1 });
    expect(res.items[0].status).toBe('skipped');
  });

  it('id solicitado que não é candidato do preview vira blocked', async () => {
    const { service, create } = buildCtx([makeItem('a1')]);

    const res = await service.apply({
      acgihBeiIndicatorIds: ['ghost'],
      userId: 1,
    });

    expect(res.items[0]).toMatchObject({ acgihBeiIndicatorId: 'ghost', status: 'blocked' });
    expect(create).not.toHaveBeenCalled();
  });

  it('DIVERGENCE_DERIVED repassa o opt-in para o preview', async () => {
    const { service, preview, create } = buildCtx([
      makeItem('d1', {
        eligibilityTier: AcgihPromotionEligibilityTier.DIVERGENCE_DERIVED,
      }),
    ]);
    create.mockResolvedValue({ id: 'off' } as never);

    await service.apply({ includeDivergenceDerived: true, userId: 1 });

    expect(preview.computeEvaluatedItems).toHaveBeenCalledWith({
      includeDivergenceDerived: true,
    });
  });

  it('bloqueia defensivamente quando falta campo obrigatório no payload', async () => {
    const item = makeItem('a1', {
      proposedOfficialPayload: makePayload('a1', {
        collectionMoment: null,
      }),
    });
    const { service, create } = buildCtx([item]);

    const res = await service.apply({ acgihBeiIndicatorIds: ['a1'], userId: 1 });

    expect(res.items[0].status).toBe('blocked');
    expect(res.items[0].blockers).toContain('MISSING_collectionMoment');
    expect(create).not.toHaveBeenCalled();
  });

  it('excede o limite de 200 itens => 400', async () => {
    const ids = Array.from({ length: 201 }, (_, i) => `id-${i}`);
    const { service } = buildCtx([]);

    await expect(
      service.apply({ acgihBeiIndicatorIds: ids, userId: 1 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
