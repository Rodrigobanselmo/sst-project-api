import { describe, expect, it } from '@jest/globals';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
} from '@prisma/client';

import {
  resolveExamRiskRuleNormativeOriginLabel,
  resolveExamRiskRuleRiskFactorDisplayName,
  resolveIndicatorRiskFactorForDisplay,
} from './exam-risk-rule-riskfactor-display.util';

const nr07AgentRule = (overrides: Record<string, unknown> = {}) => ({
  scope: PcmsoExamRiskRuleScopeEnum.AGENT,
  source: PcmsoExamRiskRuleSourceEnum.NR_07,
  riskFactorId: null,
  riskCategory: null,
  riskSubTypeId: null,
  agentName: 'Benzeno',
  agentCas: '71-43-2',
  riskNameSnapshot: null,
  subTypeNameSnapshot: null,
  sourceIndicatorId: 'ind-benzeno',
  indicatorRiskFactor: null,
  ...overrides,
});

describe('resolveIndicatorRiskFactorForDisplay', () => {
  it('retorna o único risco confirmado', () => {
    const resolved = resolveIndicatorRiskFactorForDisplay([
      {
        deleted_at: null,
        isConfirmed: true,
        isPrimary: true,
        riskFactorId: 'risk-benzeno',
        riskFactor: {
          id: 'risk-benzeno',
          name: 'Benzeno e seus compostos tóxicos',
          deleted_at: null,
        },
      },
    ]);

    expect(resolved).toEqual({
      riskFactorId: 'risk-benzeno',
      riskFactorName: 'Benzeno e seus compostos tóxicos',
    });
  });

  it('prefere isPrimary entre múltiplos confirmados', () => {
    const resolved = resolveIndicatorRiskFactorForDisplay([
      {
        deleted_at: null,
        isConfirmed: true,
        isPrimary: false,
        riskFactorId: 'risk-a',
        riskFactor: { id: 'risk-a', name: 'Outro', deleted_at: null },
      },
      {
        deleted_at: null,
        isConfirmed: true,
        isPrimary: true,
        riskFactorId: 'risk-b',
        riskFactor: {
          id: 'risk-b',
          name: 'Benzeno e seus compostos tóxicos',
          deleted_at: null,
        },
      },
    ]);

    expect(resolved?.riskFactorName).toBe('Benzeno e seus compostos tóxicos');
  });
});

describe('resolveExamRiskRuleRiskFactorDisplayName', () => {
  it('NR-7 Benzeno usa fator SimpleSST enriquecido quando snapshot ausente', () => {
    const display = resolveExamRiskRuleRiskFactorDisplayName(
      nr07AgentRule({
        indicatorRiskFactor: {
          riskFactorId: 'risk-benzeno',
          riskFactorName: 'Benzeno e seus compostos tóxicos',
        },
      }),
    );

    expect(display).toBe('Benzeno e seus compostos tóxicos');
  });

  it('preserva agentName como origem normativa quando diferente', () => {
    const label = resolveExamRiskRuleNormativeOriginLabel(
      nr07AgentRule({
        indicatorRiskFactor: {
          riskFactorId: 'risk-benzeno',
          riskFactorName: 'Benzeno e seus compostos tóxicos',
        },
      }),
    );

    expect(label).toBe('Origem normativa: Benzeno');
  });

  it('ACGIH/BEI continua exibindo agentName quando já é o fator de risco', () => {
    const display = resolveExamRiskRuleRiskFactorDisplayName({
      scope: PcmsoExamRiskRuleScopeEnum.AGENT,
      source: PcmsoExamRiskRuleSourceEnum.TECHNICAL,
      riskFactorId: null,
      riskCategory: null,
      riskSubTypeId: null,
      agentName: 'Heptano, todos os isômeros',
      agentCas: null,
      riskNameSnapshot: 'Heptano, todos os isômeros',
      subTypeNameSnapshot: null,
      sourceIndicatorId: 'ind-heptano',
      indicatorRiskFactor: null,
    });

    expect(display).toBe('Heptano, todos os isômeros');
    expect(
      resolveExamRiskRuleNormativeOriginLabel({
        scope: PcmsoExamRiskRuleScopeEnum.AGENT,
        source: PcmsoExamRiskRuleSourceEnum.TECHNICAL,
        riskFactorId: null,
        riskCategory: null,
        riskSubTypeId: null,
        agentName: 'Heptano, todos os isômeros',
        agentCas: null,
        riskNameSnapshot: 'Heptano, todos os isômeros',
        subTypeNameSnapshot: null,
        sourceIndicatorId: 'ind-heptano',
        indicatorRiskFactor: null,
      }),
    ).toBeNull();
  });

  it('fallback para agentName quando não há correlação', () => {
    const display = resolveExamRiskRuleRiskFactorDisplayName(nr07AgentRule());
    expect(display).toBe('Benzeno');
    expect(resolveExamRiskRuleNormativeOriginLabel(nr07AgentRule())).toBeNull();
  });
});
