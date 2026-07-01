import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  PcmsoExamRiskRuleReferenceSourceEnum,
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  RiskFactorsEnum,
} from '@prisma/client';

import { ExamRiskRuleCoverageGapsService } from './exam-risk-rule-coverage-gaps.service';
import {
  CoverageGapsActiveRule,
  CoverageGapsBiologicalLink,
  CoverageGapsRiskRow,
  ExamRiskRuleCoverageStatusEnum,
} from './exam-risk-rule-coverage-gaps.types';
import {
  buildCoverageItem,
  buildCoverageSummary,
  filterCoverageItems,
  paginateCoverageItems,
} from './exam-risk-rule-coverage-gaps.util';

const baseRisk = (
  overrides: Partial<CoverageGapsRiskRow> = {},
): CoverageGapsRiskRow => ({
  id: 'risk-1',
  name: 'Tolueno',
  type: RiskFactorsEnum.QUI,
  cas: '108-88-3',
  esocialCode: null,
  subTypes: [],
  ...overrides,
});

const baseRule = (
  overrides: Partial<CoverageGapsActiveRule> = {},
): CoverageGapsActiveRule => ({
  id: 'rule-1',
  scope: PcmsoExamRiskRuleScopeEnum.RISK,
  source: PcmsoExamRiskRuleSourceEnum.NR_07,
  riskFactorId: 'risk-1',
  riskCategory: null,
  riskSubTypeId: null,
  agentCas: null,
  agentNameNormalized: null,
  exams: [{ examId: 10, examNameSnapshot: 'Hemograma' }],
  references: [],
  ...overrides,
});

describe('ExamRiskRuleCoverageGaps util', () => {
  it('1. risco com regra RISK ativa → COVERED_BY_RULE', () => {
    const item = buildCoverageItem(baseRisk(), [baseRule()], []);
    expect(item.coverageStatus).toBe(
      ExamRiskRuleCoverageStatusEnum.COVERED_BY_RULE,
    );
    expect(item.matchedRuleIds).toEqual(['rule-1']);
    expect(item.matchedRuleScopes).toEqual([PcmsoExamRiskRuleScopeEnum.RISK]);
    expect(item.coverageReasons[0]).toContain('escopo RISK');
  });

  it('2. risco com regra AGENT por CAS → COVERED_BY_RULE', () => {
    const item = buildCoverageItem(
      baseRisk({ id: 'risk-tolueno', cas: '108-88-3' }),
      [
        baseRule({
          id: 'rule-agent-cas',
          scope: PcmsoExamRiskRuleScopeEnum.AGENT,
          riskFactorId: null,
          agentCas: '108-88-3',
          agentNameNormalized: null,
        }),
      ],
      [],
    );
    expect(item.coverageStatus).toBe(
      ExamRiskRuleCoverageStatusEnum.COVERED_BY_RULE,
    );
    expect(item.coverageReasons[0]).toContain('AGENT por CAS');
  });

  it('3. risco com regra AGENT por nome normalizado → COVERED_BY_RULE', () => {
    const item = buildCoverageItem(
      baseRisk({ id: 'risk-tolueno', name: 'Tolueno', cas: null }),
      [
        baseRule({
          id: 'rule-agent-name',
          scope: PcmsoExamRiskRuleScopeEnum.AGENT,
          riskFactorId: null,
          agentCas: null,
          agentNameNormalized: 'tolueno',
        }),
      ],
      [],
    );
    expect(item.coverageStatus).toBe(
      ExamRiskRuleCoverageStatusEnum.COVERED_BY_RULE,
    );
    expect(item.coverageReasons[0]).toContain('AGENT por nome normalizado');
  });

  it('4. risco com regra CATEGORY → COVERED_BY_RULE', () => {
    const item = buildCoverageItem(
      baseRisk({ id: 'risk-qui', type: RiskFactorsEnum.QUI }),
      [
        baseRule({
          id: 'rule-category',
          scope: PcmsoExamRiskRuleScopeEnum.CATEGORY,
          riskFactorId: null,
          riskCategory: RiskFactorsEnum.QUI,
        }),
      ],
      [],
    );
    expect(item.coverageStatus).toBe(
      ExamRiskRuleCoverageStatusEnum.COVERED_BY_RULE,
    );
    expect(item.coverageReasons[0]).toContain('escopo CATEGORY');
  });

  it('5. risco com GROUP via RiskSubType → COVERED_BY_RULE', () => {
    const item = buildCoverageItem(
      baseRisk({
        id: 'risk-erg',
        type: RiskFactorsEnum.ERG,
        subTypes: [{ id: 42, name: 'Biomecânicos' }],
      }),
      [
        baseRule({
          id: 'rule-group',
          scope: PcmsoExamRiskRuleScopeEnum.GROUP,
          riskFactorId: null,
          riskSubTypeId: 42,
        }),
      ],
      [],
    );
    expect(item.coverageStatus).toBe(
      ExamRiskRuleCoverageStatusEnum.COVERED_BY_RULE,
    );
    expect(item.coverageReasons[0]).toContain('escopo GROUP');
  });

  it('6. risco sem regra, mas com indicador biológico confirmado + exame confirmado → INDIRECT_BIOLOGICAL_ONLY', () => {
    const biologicalLinks: CoverageGapsBiologicalLink[] = [
      {
        indicatorId: 'ind-1',
        substanceName: 'Tolueno',
        confirmedExamCount: 1,
        confirmedExamNames: ['Ácido hipúrico'],
      },
    ];
    const item = buildCoverageItem(baseRisk({ id: 'risk-orphan' }), [], biologicalLinks);
    expect(item.coverageStatus).toBe(
      ExamRiskRuleCoverageStatusEnum.INDIRECT_BIOLOGICAL_ONLY,
    );
    expect(item.hasBiologicalIndicatorCoverage).toBe(true);
    expect(item.confirmedBiologicalIndicatorCount).toBe(1);
    expect(item.confirmedExamCount).toBe(1);
    expect(item.matchedRuleIds).toEqual([]);
  });

  it('7. risco sem nada → UNCOVERED', () => {
    const item = buildCoverageItem(baseRisk({ id: 'risk-bare' }), [], []);
    expect(item.coverageStatus).toBe(ExamRiskRuleCoverageStatusEnum.UNCOVERED);
    expect(item.matchedRuleIds).toEqual([]);
    expect(item.hasBiologicalIndicatorCoverage).toBe(false);
  });

  it('8. regras inativas/deletadas não entram no conjunto ACTIVE usado pelo serviço', async () => {
    const repository = {
      loadGlobalRisks: jest.fn<() => Promise<CoverageGapsRiskRow[]>>().mockResolvedValue([
        baseRisk({ id: 'risk-1' }),
      ]),
      loadActiveRules: jest.fn<() => Promise<CoverageGapsActiveRule[]>>().mockResolvedValue([]),
      loadBiologicalLinksByRiskIds: jest
        .fn<() => Promise<Map<string, CoverageGapsBiologicalLink[]>>>()
        .mockResolvedValue(new Map()),
    };
    const service = new ExamRiskRuleCoverageGapsService(repository as never);
    await service.getCoverageGaps({ page: 1, limit: 20 });

    expect(repository.loadActiveRules).toHaveBeenCalled();
    const item = buildCoverageItem(baseRisk(), [], []);
    expect(item.coverageStatus).toBe(ExamRiskRuleCoverageStatusEnum.UNCOVERED);
  });

  it('expõe referência complementar ACGIH/BEI como nota auxiliar', () => {
    const item = buildCoverageItem(
      baseRisk(),
      [
        baseRule({
          references: [
            {
              sourceType: PcmsoExamRiskRuleReferenceSourceEnum.ACGIH_BEI,
              referenceLabel: 'Benzeno BEI 2024',
            },
          ],
        }),
      ],
      [],
    );
    expect(item.notes.some((note) => note.includes('ACGIH/BEI'))).toBe(true);
  });
});

describe('ExamRiskRuleCoverageGapsService', () => {
  let service: ExamRiskRuleCoverageGapsService;
  let repository: {
    loadGlobalRisks: jest.Mock<() => Promise<CoverageGapsRiskRow[]>>;
    loadActiveRules: jest.Mock<() => Promise<CoverageGapsActiveRule[]>>;
    loadBiologicalLinksByRiskIds: jest.Mock<
      () => Promise<Map<string, CoverageGapsBiologicalLink[]>>
    >;
  };

  beforeEach(() => {
    repository = {
      loadGlobalRisks: jest.fn(),
      loadActiveRules: jest.fn(),
      loadBiologicalLinksByRiskIds: jest.fn(),
    };
    service = new ExamRiskRuleCoverageGapsService(repository as never);
  });

  it('9. paginação e filtro por type/search/coverageStatus funcionando', async () => {
    const risks = [
      baseRisk({ id: 'risk-covered', name: 'Benzeno', type: RiskFactorsEnum.QUI }),
      baseRisk({ id: 'risk-gap', name: 'Xileno', type: RiskFactorsEnum.QUI }),
      baseRisk({ id: 'risk-fis', name: 'Ruído', type: RiskFactorsEnum.FIS }),
    ];
    repository.loadGlobalRisks.mockResolvedValueOnce(risks);
    repository.loadActiveRules.mockResolvedValueOnce([
      baseRule({ riskFactorId: 'risk-covered', id: 'rule-covered' }),
    ]);
    repository.loadBiologicalLinksByRiskIds.mockResolvedValueOnce(new Map());

    const filteredByType = await service.getCoverageGaps({
      page: 1,
      limit: 10,
      type: RiskFactorsEnum.QUI,
    });
    expect(repository.loadGlobalRisks).toHaveBeenCalledWith(
      expect.objectContaining({ type: RiskFactorsEnum.QUI }),
    );
    expect(filteredByType.summary.totalRisks).toBe(3);
    expect(filteredByType.summary.coveredByRule).toBe(1);
    expect(filteredByType.summary.uncovered).toBe(2);

    repository.loadGlobalRisks.mockResolvedValueOnce(risks);
    repository.loadActiveRules.mockResolvedValueOnce([
      baseRule({ riskFactorId: 'risk-covered', id: 'rule-covered' }),
    ]);
    repository.loadBiologicalLinksByRiskIds.mockResolvedValueOnce(new Map());

    const uncoveredOnly = await service.getCoverageGaps({
      page: 1,
      limit: 1,
      coverageStatus: ExamRiskRuleCoverageStatusEnum.UNCOVERED,
    });
    expect(uncoveredOnly.count).toBe(2);
    expect(uncoveredOnly.items).toHaveLength(1);
    expect(uncoveredOnly.items[0].coverageStatus).toBe(
      ExamRiskRuleCoverageStatusEnum.UNCOVERED,
    );

    repository.loadGlobalRisks.mockResolvedValueOnce(risks);
    repository.loadActiveRules.mockResolvedValueOnce([
      baseRule({ riskFactorId: 'risk-covered', id: 'rule-covered' }),
    ]);
    repository.loadBiologicalLinksByRiskIds.mockResolvedValueOnce(new Map());

    const withSearch = await service.getCoverageGaps({
      page: 1,
      limit: 20,
      search: 'benzeno',
    });
    expect(repository.loadGlobalRisks).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'benzeno' }),
    );
    expect(withSearch.summary.totalRisks).toBe(3);
  });

  it('includeIndirect=false remove itens INDIRECT_BIOLOGICAL_ONLY da lista', async () => {
    const risks = [baseRisk({ id: 'risk-indirect' })];
    repository.loadGlobalRisks.mockResolvedValueOnce(risks);
    repository.loadActiveRules.mockResolvedValueOnce([]);
    repository.loadBiologicalLinksByRiskIds.mockResolvedValueOnce(
      new Map([
        [
          'risk-indirect',
          [
            {
              indicatorId: 'ind-1',
              substanceName: 'Tolueno',
              confirmedExamCount: 1,
              confirmedExamNames: ['Ácido hipúrico'],
            },
          ],
        ],
      ]),
    );

    const result = await service.getCoverageGaps({
      page: 1,
      limit: 20,
      includeIndirect: false,
    });

    expect(result.summary.indirectBiologicalCoverageOnly).toBe(1);
    expect(result.count).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('onlyPcmso=false repassa filtro ao repositório', async () => {
    repository.loadGlobalRisks.mockResolvedValueOnce([]);
    repository.loadActiveRules.mockResolvedValueOnce([]);
    repository.loadBiologicalLinksByRiskIds.mockResolvedValueOnce(new Map());

    await service.getCoverageGaps({
      page: 1,
      limit: 20,
      onlyPcmso: false,
    });

    expect(repository.loadGlobalRisks).toHaveBeenCalledWith(
      expect.objectContaining({ onlyPcmso: false }),
    );
  });
});

describe('ExamRiskRuleCoverageGaps helpers', () => {
  it('buildCoverageSummary agrega por tipo', () => {
    const summary = buildCoverageSummary([
      {
        ...buildCoverageItem(baseRisk({ type: RiskFactorsEnum.QUI }), [baseRule()], []),
        type: RiskFactorsEnum.QUI,
      },
      {
        ...buildCoverageItem(baseRisk({ id: 'risk-2', type: RiskFactorsEnum.FIS }), [], []),
        type: RiskFactorsEnum.FIS,
      },
    ]);
    expect(summary.totalRisks).toBe(2);
    expect(summary.coveredByRule).toBe(1);
    expect(summary.uncovered).toBe(1);
    expect(summary.byType.QUI).toBe(1);
    expect(summary.byType.FIS).toBe(1);
  });

  it('paginateCoverageItems fatia corretamente', () => {
    const items = [1, 2, 3, 4, 5];
    const page1 = paginateCoverageItems(items, 1, 2);
    expect(page1.items).toEqual([1, 2]);
    expect(page1.count).toBe(5);

    const page2 = paginateCoverageItems(items, 2, 2);
    expect(page2.items).toEqual([3, 4]);
  });

  it('filterCoverageItems respeita coverageStatus', () => {
    const items = [
      buildCoverageItem(baseRisk({ id: 'a' }), [baseRule({ riskFactorId: 'a' })], []),
      buildCoverageItem(baseRisk({ id: 'b' }), [], []),
    ];
    const uncovered = filterCoverageItems(items, {
      coverageStatus: ExamRiskRuleCoverageStatusEnum.UNCOVERED,
    });
    expect(uncovered).toHaveLength(1);
    expect(uncovered[0].riskFactorId).toBe('b');
  });
});
