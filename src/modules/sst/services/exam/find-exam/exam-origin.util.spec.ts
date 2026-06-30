import { describe, expect, it } from '@jest/globals';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';

import { simpleCompanyId } from '../../../../../shared/constants/ids';
import {
  agentIndicatorMatches,
  agentRuleMatches,
  buildAgentIndicatorWhere,
  buildAgentLibraryWhere,
  buildExamOrderBy,
  buildExamOriginConstraint,
  buildRiskIndicatorExamWhere,
  buildRiskIndicatorLinkWhere,
  ExamOriginEnum,
  ExamOriginSourceEnum,
  mergeRecommendedExamIds,
  resolveExamOrigin,
  resolveExamOriginSources,
  shouldApplyAgentFilter,
} from './exam-origin.util';

const CLIENT_COMPANY = 'company-tenant-1';

describe('resolveExamOrigin', () => {
  it('classifica como NR07 quando o exame está vinculado a indicador NR-07', () => {
    const nr07 = new Set<number>([10]);
    const origin = resolveExamOrigin(
      { id: 10, companyId: simpleCompanyId, system: true },
      nr07,
    );
    expect(origin).toBe(ExamOriginEnum.NR07);
  });

  it('NR07 tem precedência mesmo sendo system + simpleCompanyId', () => {
    const nr07 = new Set<number>([5]);
    const origin = resolveExamOrigin(
      { id: 5, companyId: simpleCompanyId, system: true },
      nr07,
    );
    expect(origin).toBe(ExamOriginEnum.NR07);
  });

  it('classifica como SYSTEM quando system + simpleCompanyId e sem link NR-07', () => {
    const origin = resolveExamOrigin(
      { id: 7, companyId: simpleCompanyId, system: true },
      new Set<number>(),
    );
    expect(origin).toBe(ExamOriginEnum.SYSTEM);
  });

  it('classifica como CLIENT quando não é system', () => {
    const origin = resolveExamOrigin(
      { id: 8, companyId: CLIENT_COMPANY, system: false },
      new Set<number>(),
    );
    expect(origin).toBe(ExamOriginEnum.CLIENT);
  });

  it('classifica como OTHER quando system de empresa diferente da simpleCompanyId', () => {
    const origin = resolveExamOrigin(
      { id: 9, companyId: CLIENT_COMPANY, system: true },
      new Set<number>(),
    );
    expect(origin).toBe(ExamOriginEnum.OTHER);
  });
});

describe('resolveExamOriginSources', () => {
  const SYSTEM_EXAM = { id: 1, companyId: simpleCompanyId, system: true };
  const CLIENT_EXAM = { id: 2, companyId: CLIENT_COMPANY, system: false };
  const ESOCIAL_EXAM = {
    id: 1,
    companyId: simpleCompanyId,
    system: true,
    esocial27Code: '0295',
  };

  it('exame só com indicador NR-7 → ["NR_07"]', () => {
    expect(
      resolveExamOriginSources(SYSTEM_EXAM, new Set([1]), new Set()),
    ).toEqual([ExamOriginSourceEnum.NR_07]);
  });

  it('exame só com indicador ACGIH/BEI → ["ACGIH_BEI"] (não vira "SYSTEM")', () => {
    expect(
      resolveExamOriginSources(SYSTEM_EXAM, new Set(), new Set([1])),
    ).toEqual([ExamOriginSourceEnum.ACGIH_BEI]);
  });

  it('exame com NR-7 + ACGIH/BEI → ["NR_07", "ACGIH_BEI"] (ordem fixa, NR-7 nunca substituído)', () => {
    expect(
      resolveExamOriginSources(SYSTEM_EXAM, new Set([1]), new Set([1])),
    ).toEqual([ExamOriginSourceEnum.NR_07, ExamOriginSourceEnum.ACGIH_BEI]);
  });

  it('exame sistêmico sem fonte normativa → ["SYSTEM"]', () => {
    expect(
      resolveExamOriginSources(SYSTEM_EXAM, new Set(), new Set()),
    ).toEqual([ExamOriginSourceEnum.SYSTEM]);
  });

  it('exame da empresa/manual sem fonte normativa → ["CLIENT"]', () => {
    expect(
      resolveExamOriginSources(CLIENT_EXAM, new Set(), new Set()),
    ).toEqual([ExamOriginSourceEnum.CLIENT]);
  });

  it('exame system de outra empresa sem fonte normativa → ["OTHER"]', () => {
    expect(
      resolveExamOriginSources(
        { id: 3, companyId: CLIENT_COMPANY, system: true },
        new Set(),
        new Set(),
      ),
    ).toEqual([ExamOriginSourceEnum.OTHER]);
  });

  it('fonte normativa tem precedência sobre o bucket sistêmico (CLIENT + ACGIH → só ACGIH)', () => {
    expect(
      resolveExamOriginSources(CLIENT_EXAM, new Set(), new Set([2])),
    ).toEqual([ExamOriginSourceEnum.ACGIH_BEI]);
  });

  // ── eSocial Tabela 27 (fonte estrutural, acumulativa) ────────────────────
  it('(1) exame com esocial27Code e sem NR-7/ACGIH → ["ESOCIAL_T27"]', () => {
    expect(resolveExamOriginSources(ESOCIAL_EXAM, new Set(), new Set())).toEqual(
      [ExamOriginSourceEnum.ESOCIAL_T27],
    );
  });

  it('(2) esocial27Code + NR-7 → ["ESOCIAL_T27", "NR_07"]', () => {
    expect(
      resolveExamOriginSources(ESOCIAL_EXAM, new Set([1]), new Set()),
    ).toEqual([ExamOriginSourceEnum.ESOCIAL_T27, ExamOriginSourceEnum.NR_07]);
  });

  it('(3) esocial27Code + ACGIH/BEI → ["ESOCIAL_T27", "ACGIH_BEI"]', () => {
    expect(
      resolveExamOriginSources(ESOCIAL_EXAM, new Set(), new Set([1])),
    ).toEqual([
      ExamOriginSourceEnum.ESOCIAL_T27,
      ExamOriginSourceEnum.ACGIH_BEI,
    ]);
  });

  it('(4) esocial27Code + NR-7 + ACGIH/BEI → as três na ordem T27, NR-7, ACGIH', () => {
    expect(
      resolveExamOriginSources(ESOCIAL_EXAM, new Set([1]), new Set([1])),
    ).toEqual([
      ExamOriginSourceEnum.ESOCIAL_T27,
      ExamOriginSourceEnum.NR_07,
      ExamOriginSourceEnum.ACGIH_BEI,
    ]);
  });

  it('(6) esocial27Code vazio não vira ESOCIAL_T27 (cai no bucket sistêmico)', () => {
    expect(
      resolveExamOriginSources(
        { id: 9, companyId: simpleCompanyId, system: true, esocial27Code: '' },
        new Set(),
        new Set(),
      ),
    ).toEqual([ExamOriginSourceEnum.SYSTEM]);
  });

  it('(6b) esocial27Code só com espaços não vira ESOCIAL_T27', () => {
    expect(
      resolveExamOriginSources(
        { id: 9, companyId: simpleCompanyId, system: true, esocial27Code: '   ' },
        new Set(),
        new Set(),
      ),
    ).toEqual([ExamOriginSourceEnum.SYSTEM]);
  });

  it('(6c) esocial27Code null não vira ESOCIAL_T27', () => {
    expect(
      resolveExamOriginSources(
        { id: 9, companyId: simpleCompanyId, system: true, esocial27Code: null },
        new Set(),
        new Set(),
      ),
    ).toEqual([ExamOriginSourceEnum.SYSTEM]);
  });

  it('eSocial acumula mesmo em exame de empresa (CLIENT + esocial27Code → só ESOCIAL_T27)', () => {
    expect(
      resolveExamOriginSources(
        { ...CLIENT_EXAM, esocial27Code: '0658' },
        new Set(),
        new Set(),
      ),
    ).toEqual([ExamOriginSourceEnum.ESOCIAL_T27]);
  });
});

describe('buildExamOriginConstraint', () => {
  it('retorna null quando não há filtro de origem', () => {
    expect(buildExamOriginConstraint(undefined, new Set([1]))).toBeNull();
  });

  it('NR07 filtra por ids vinculados', () => {
    const constraint = buildExamOriginConstraint(
      ExamOriginEnum.NR07,
      new Set([1, 2]),
    );
    expect(constraint).toEqual({ id: { in: [1, 2] } });
  });

  it('SYSTEM exige system + simpleCompanyId e exclui ids NR-07', () => {
    const constraint = buildExamOriginConstraint(
      ExamOriginEnum.SYSTEM,
      new Set([3]),
    );
    expect(constraint).toEqual({
      AND: [
        { system: true },
        { companyId: simpleCompanyId },
        { id: { notIn: [3] } },
      ],
    });
  });

  it('CLIENT exige não-system e exclui ids NR-07', () => {
    const constraint = buildExamOriginConstraint(
      ExamOriginEnum.CLIENT,
      new Set([4]),
    );
    expect(constraint).toEqual({
      AND: [{ system: false }, { id: { notIn: [4] } }],
    });
  });

  it('OTHER exige system de empresa diferente da simpleCompanyId', () => {
    const constraint = buildExamOriginConstraint(
      ExamOriginEnum.OTHER,
      new Set([5]),
    );
    expect(constraint).toEqual({
      AND: [
        { system: true },
        { NOT: { companyId: simpleCompanyId } },
        { id: { notIn: [5] } },
      ],
    });
  });
});

describe('shouldApplyAgentFilter', () => {
  it('aplica quando withOrigin, sem includeIncompatible e com CAS', () => {
    expect(shouldApplyAgentFilter(true, false, '108883', null)).toBe(true);
  });

  it('aplica quando withOrigin, sem includeIncompatible e com nome', () => {
    expect(shouldApplyAgentFilter(true, undefined, null, 'tolueno')).toBe(true);
  });

  it('não aplica sem withOrigin (não calcula recomendação)', () => {
    expect(shouldApplyAgentFilter(false, false, '108883', 'tolueno')).toBe(
      false,
    );
    expect(shouldApplyAgentFilter(undefined, false, '108883', null)).toBe(false);
  });

  it('não aplica quando includeIncompatible=true (catálogo amplo)', () => {
    expect(shouldApplyAgentFilter(true, true, '108883', 'tolueno')).toBe(false);
  });

  it('não aplica sem agente (CAS e nome ausentes)', () => {
    expect(shouldApplyAgentFilter(true, false, null, null)).toBe(false);
  });

  it('aplica quando só há riskFactorId (sem CAS/nome) — caminho consolidado', () => {
    expect(shouldApplyAgentFilter(true, false, null, null, 'rf-1')).toBe(true);
  });

  it('não aplica riskFactorId quando includeIncompatible=true (catálogo amplo)', () => {
    expect(shouldApplyAgentFilter(true, true, null, null, 'rf-1')).toBe(false);
  });

  it('não aplica riskFactorId sem withOrigin', () => {
    expect(shouldApplyAgentFilter(false, false, null, null, 'rf-1')).toBe(false);
  });
});

describe('buildRiskIndicatorLinkWhere', () => {
  it('exige riskFactorId, link ativo, confirmado e indicador não deletado', () => {
    expect(buildRiskIndicatorLinkWhere('rf-1')).toEqual({
      riskFactorId: 'rf-1',
      deleted_at: null,
      isConfirmed: true,
      indicator: { deleted_at: null },
    });
  });
});

describe('buildRiskIndicatorExamWhere', () => {
  it('exige indicadores informados, link ativo, confirmado e indicador não deletado', () => {
    expect(buildRiskIndicatorExamWhere(['ind-1', 'ind-2'])).toEqual({
      indicatorId: { in: ['ind-1', 'ind-2'] },
      deleted_at: null,
      isConfirmed: true,
      indicator: { deleted_at: null },
    });
  });
});

describe('buildAgentLibraryWhere', () => {
  it('filtra apenas regras ACTIVE, scope AGENT e não deletadas', () => {
    expect(buildAgentLibraryWhere()).toEqual({
      deleted_at: null,
      status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
      scope: PcmsoExamRiskRuleScopeEnum.AGENT,
    });
  });
});

describe('buildAgentIndicatorWhere', () => {
  it('exige link e indicador não deletados, sem filtrar normativeSource', () => {
    const where = buildAgentIndicatorWhere();
    expect(where).toEqual({
      deleted_at: null,
      indicator: { deleted_at: null },
    });
    expect(where.indicator).not.toHaveProperty('normativeSource');
  });
});

describe('agentRuleMatches', () => {
  const rule = { agentCas: '108-88-3', agentNameNormalized: 'tolueno' };

  it('casa por CAS normalizado (ignora hífens)', () => {
    expect(agentRuleMatches(rule, '108883', null)).toBe(true);
  });

  it('faz fallback por nome normalizado quando CAS não casa', () => {
    expect(agentRuleMatches(rule, '999999', 'tolueno')).toBe(true);
  });

  it('não casa quando nem CAS nem nome batem', () => {
    expect(agentRuleMatches(rule, '999999', 'benzeno')).toBe(false);
  });

  it('não casa por CAS quando regra não tem agentCas', () => {
    expect(
      agentRuleMatches(
        { agentCas: null, agentNameNormalized: 'tolueno' },
        '108883',
        null,
      ),
    ).toBe(false);
  });
});

describe('agentIndicatorMatches', () => {
  const indicator = {
    casPrimary: '108-88-3',
    casNumbers: ['108-88-3', '50-00-0'],
    substanceNameNormalized: 'tolueno',
  };

  it('casa por casPrimary normalizado', () => {
    expect(agentIndicatorMatches(indicator, '108883', null)).toBe(true);
  });

  it('casa por algum CAS em casNumbers', () => {
    expect(agentIndicatorMatches(indicator, '50000', null)).toBe(true);
  });

  it('faz fallback por substanceNameNormalized', () => {
    expect(agentIndicatorMatches(indicator, '999999', 'tolueno')).toBe(true);
  });

  it('não casa quando nada bate', () => {
    expect(agentIndicatorMatches(indicator, '999999', 'benzeno')).toBe(false);
  });
});

describe('mergeRecommendedExamIds', () => {
  it('une as duas fontes deduplicando', () => {
    const merged = mergeRecommendedExamIds([1, 2, 3], [3, 4]);
    expect(Array.from(merged).sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
    expect(merged.size).toBe(4);
  });

  it('retorna conjunto vazio quando ambas as fontes são vazias', () => {
    expect(mergeRecommendedExamIds([], []).size).toBe(0);
  });

  it('une as três fontes (Biblioteca + CAS/nome + riskFactorId) deduplicando', () => {
    const merged = mergeRecommendedExamIds([1, 2], [2, 3], [3, 4]);
    expect(Array.from(merged).sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
    expect(merged.size).toBe(4);
  });

  it('inclui exame vindo apenas do riskFactorId (grupo/isômero, sem CAS/nome)', () => {
    const merged = mergeRecommendedExamIds([], [], [99]);
    expect(Array.from(merged)).toEqual([99]);
  });
});

describe('buildExamOrderBy', () => {
  it('default é name asc', () => {
    expect(buildExamOrderBy(undefined, undefined)).toEqual({ name: 'asc' });
  });

  it('aplica campo e direção válidos', () => {
    expect(buildExamOrderBy('material', 'desc')).toEqual({ material: 'desc' });
  });

  it('ignora campo não permitido e cai no default', () => {
    expect(buildExamOrderBy('companyId', 'desc')).toEqual({ name: 'asc' });
  });

  it('direção inválida vira asc', () => {
    expect(buildExamOrderBy('status', 'sideways')).toEqual({ status: 'asc' });
  });
});
