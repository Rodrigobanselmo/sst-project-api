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
  ExamOriginEnum,
  mergeRecommendedExamIds,
  resolveExamOrigin,
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
