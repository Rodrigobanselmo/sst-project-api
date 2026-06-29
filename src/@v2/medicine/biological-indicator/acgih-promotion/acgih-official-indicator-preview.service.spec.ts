import { describe, expect, it, jest } from '@jest/globals';

import {
  BiologicalIndicatorDataOriginEnum,
  BiologicalIndicatorStatusEnum,
  BiologicalNormativeSourceEnum,
  PcmsoAcgihBeiComparisonDecisionEnum,
  PcmsoAcgihBeiIndicatorConfidenceEnum,
} from '@prisma/client';

import {
  AcgihBeiComparisonStatus,
  AcgihBeiOperationalStatus,
  ComparisonResult,
  MatchStatus,
} from '../../acgih-bei-comparison/acgih-bei-comparison.util';
import { AcgihOfficialIndicatorPreviewService } from './acgih-official-indicator-preview.service';
import {
  AcgihPromotionBlocker,
  AcgihPromotionDuplicateRisk,
  AcgihPromotionEligibilityStatus,
  AcgihPromotionEligibilityTier,
} from './acgih-official-indicator-preview.util';

const makeRow = (over: Partial<ComparisonResult>): ComparisonResult =>
  ({
    acgihBeiId: 'a1',
    substanceName: 'Tolueno',
    cas: '108-88-3',
    determinant: 'o-Cresol',
    biologicalMatrix: 'urina',
    samplingTime: 'Fim da jornada',
    beiValue: '0,3 mg/L',
    unit: 'mg/L',
    confidence: PcmsoAcgihBeiIndicatorConfidenceEnum.HIGH,
    nr7MatchStatus: MatchStatus.NONE,
    nr7IndicatorId: null,
    examRiskRuleMatchStatus: MatchStatus.NONE,
    comparisonStatus: AcgihBeiComparisonStatus.NEW_CANDIDATE,
    operationalStatus: AcgihBeiOperationalStatus.ACGIH_CANDIDATE_CONFIRMED,
    hasComplementaryReference: false,
    review: {
      id: 'r1',
      decision: PcmsoAcgihBeiComparisonDecisionEnum.NO_MATCH_CONFIRMED,
      technicalNote: 'Sem correspondência NR-7.',
      isStale: false,
    },
    ...over,
  }) as unknown as ComparisonResult;

type RepoMock = {
  findAcgihIndicatorsByIds: jest.Mock;
  findOfficialIndicatorsForDedupe: jest.Mock;
};

const buildService = (
  rows: ComparisonResult[],
  officials: any[] = [],
  acgihRecords: any[] = [],
) => {
  const comparisonService = {
    computeAll: jest.fn().mockResolvedValue(rows as never),
  } as any;
  const repository: RepoMock = {
    findAcgihIndicatorsByIds: jest.fn().mockResolvedValue(acgihRecords as never),
    findOfficialIndicatorsForDedupe: jest
      .fn()
      .mockResolvedValue(officials as never),
  };
  const service = new AcgihOfficialIndicatorPreviewService(
    comparisonService,
    repository as any,
  );
  return { service, comparisonService, repository };
};

describe('AcgihOfficialIndicatorPreviewService', () => {
  it('inclui NO_MATCH_CONFIRMED fresco como PRIMARY e elegível', async () => {
    const { service } = buildService([makeRow({})]);
    const res = await service.preview({});

    expect(res.count).toBe(1);
    expect(res.data[0].eligibilityTier).toBe(
      AcgihPromotionEligibilityTier.PRIMARY,
    );
    expect(res.data[0].eligibilityStatus).toBe(
      AcgihPromotionEligibilityStatus.ELIGIBLE,
    );
    expect(res.totals).toMatchObject({ total: 1, eligible: 1, primary: 1 });
  });

  it('monta proposedOfficialPayload como DRAFT / ACGIH_BEI / ACGIH_BEI_COMPARISON', async () => {
    const { service } = buildService([makeRow({})], [], [
      { id: 'a1', notation: 'B', referenceYear: 2024, sourceYear: 2024, sourcePage: '120', substanceNameNormalized: 'tolueno' },
    ]);
    const res = await service.preview({});
    const payload = res.data[0].proposedOfficialPayload;

    expect(payload.status).toBe(BiologicalIndicatorStatusEnum.DRAFT);
    expect(payload.normativeSource).toBe(
      BiologicalNormativeSourceEnum.ACGIH_BEI,
    );
    expect(payload.dataOrigin).toBe(
      BiologicalIndicatorDataOriginEnum.ACGIH_BEI_COMPARISON,
    );
    expect(payload.requiresNormativeReview).toBe(true);
    expect(payload.idempotencyKey).toBe('acgih-bei::a1');
    expect(payload.normativeVersion).toBe('ACGIH-2024');
    expect(payload.collectionMoment).toBe('FJ');
  });

  it('REAL_DIVERGENCE só entra com includeDivergenceDerived=true', async () => {
    const row = makeRow({
      acgihBeiId: 'd1',
      comparisonStatus: AcgihBeiComparisonStatus.DIVERGENT,
      operationalStatus: AcgihBeiOperationalStatus.REAL_DIVERGENCE,
      review: {
        id: 'r2',
        decision: PcmsoAcgihBeiComparisonDecisionEnum.REAL_DIVERGENCE,
        technicalNote: 'Divergência técnica real.',
        isStale: false,
      } as any,
    });

    const off = await buildService([row]).service.preview({});
    expect(off.count).toBe(0);

    const on = await buildService([row]).service.preview({
      includeDivergenceDerived: true,
    });
    expect(on.count).toBe(1);
    expect(on.data[0].eligibilityTier).toBe(
      AcgihPromotionEligibilityTier.DIVERGENCE_DERIVED,
    );
  });

  it('exclui MATCH_CONFIRMED e RESOLVED_EQUIVALENCE', async () => {
    const matchConfirmed = makeRow({
      acgihBeiId: 'm1',
      operationalStatus: AcgihBeiOperationalStatus.COVERAGE_CONFIRMED,
      review: {
        id: 'r3',
        decision: PcmsoAcgihBeiComparisonDecisionEnum.MATCH_CONFIRMED,
        technicalNote: 'Cobertura confirmada.',
        isStale: false,
      } as any,
    });
    const resolvedEquiv = makeRow({
      acgihBeiId: 'e1',
      comparisonStatus: AcgihBeiComparisonStatus.DIVERGENT,
      operationalStatus: AcgihBeiOperationalStatus.RESOLVED_EQUIVALENCE,
      review: {
        id: 'r4',
        decision:
          PcmsoAcgihBeiComparisonDecisionEnum.FALSE_DIVERGENCE_EQUIVALENT,
        technicalNote: 'Equivalência.',
        isStale: false,
      } as any,
    });

    const res = await buildService([matchConfirmed, resolvedEquiv]).service.preview(
      { includeDivergenceDerived: true },
    );
    expect(res.count).toBe(0);
  });

  it('exclui review stale', async () => {
    const stale = makeRow({
      review: {
        id: 'r5',
        decision: PcmsoAcgihBeiComparisonDecisionEnum.NO_MATCH_CONFIRMED,
        technicalNote: 'x',
        isStale: true,
      } as any,
    });
    const res = await buildService([stale]).service.preview({});
    expect(res.count).toBe(0);
  });

  it('bloqueia quando há fonte complementar ativa', async () => {
    const withRef = makeRow({
      hasComplementaryReference: true,
      complementaryReferenceStatus: 'ACTIVE',
    });
    const res = await buildService([withRef]).service.preview({});
    expect(res.count).toBe(1);
    expect(res.data[0].eligibilityStatus).toBe(
      AcgihPromotionEligibilityStatus.BLOCKED,
    );
    expect(res.data[0].blockers).toContain(
      AcgihPromotionBlocker.COMPLEMENTARY_REFERENCE_ACTIVE,
    );
  });

  it('bloqueia já promovido por acgihBeiIndicatorId (ALREADY_PROMOTED)', async () => {
    const { service } = buildService(
      [makeRow({})],
      [
        {
          normativeSource: 'ACGIH_BEI',
          acgihBeiIndicatorId: 'a1',
          substanceNameNormalized: 'tolueno',
          casPrimary: '108-88-3',
          biologicalIndicatorNormalized: 'o-cresol',
          biologicalMatrix: 'urina',
          collectionMoment: 'FJ',
        },
      ],
    );
    const res = await service.preview({});
    expect(res.data[0].duplicateRisk).toBe(
      AcgihPromotionDuplicateRisk.ALREADY_PROMOTED,
    );
    expect(res.data[0].eligibilityStatus).toBe(
      AcgihPromotionEligibilityStatus.BLOCKED,
    );
    expect(res.data[0].blockers).toContain(
      AcgihPromotionBlocker.ALREADY_PROMOTED,
    );
  });

  it('bloqueia momento de coleta não mapeável (UNMAPPED_COLLECTION_MOMENT)', async () => {
    const unmapped = makeRow({ samplingTime: 'qualquer texto sem momento' });
    const res = await buildService([unmapped]).service.preview({});
    expect(res.data[0].mappedFields.collectionMoment.confidence).toBe(
      'UNMAPPED',
    );
    expect(res.data[0].blockers).toContain(
      AcgihPromotionBlocker.UNMAPPED_COLLECTION_MOMENT,
    );
    expect(res.data[0].eligibilityStatus).toBe(
      AcgihPromotionEligibilityStatus.BLOCKED,
    );
  });

  it('marca WARNING para near-duplicate NR-7 sem bloquear', async () => {
    const { service } = buildService(
      [makeRow({})],
      [
        {
          normativeSource: 'NR_07',
          acgihBeiIndicatorId: null,
          substanceNameNormalized: 'tolueno',
          casPrimary: '108-88-3',
          biologicalIndicatorNormalized: 'o-cresol',
          biologicalMatrix: 'urina',
          collectionMoment: 'FJ',
        },
      ],
    );
    const res = await service.preview({});
    expect(res.data[0].duplicateRisk).toBe(
      AcgihPromotionDuplicateRisk.NEAR_DUPLICATE_NR7,
    );
    expect(res.data[0].eligibilityStatus).toBe(
      AcgihPromotionEligibilityStatus.WARNING,
    );
    expect(res.data[0].blockers).toHaveLength(0);
  });

  it('paginação respeita page/limit mantendo o total completo', async () => {
    const rows = [
      makeRow({ acgihBeiId: 'a1' }),
      makeRow({ acgihBeiId: 'a2' }),
      makeRow({ acgihBeiId: 'a3' }),
    ];
    const res = await buildService(rows).service.preview({ page: 2, limit: 2 });
    expect(res.count).toBe(3);
    expect(res.data).toHaveLength(1);
    expect(res.data[0].acgihBeiIndicatorId).toBe('a3');
  });
});
