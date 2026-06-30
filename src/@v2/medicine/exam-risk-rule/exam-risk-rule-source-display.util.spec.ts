import { describe, expect, it } from '@jest/globals';
import { PcmsoExamRiskRuleSourceEnum } from '@prisma/client';

import {
  parseAcgihOfficialIndicatorId,
  resolveExamRiskRuleSourceDisplay,
} from './exam-risk-rule-source-display.util';

describe('parseAcgihOfficialIndicatorId', () => {
  it('extrai o primeiro segmento da chave composta', () => {
    expect(parseAcgihOfficialIndicatorId('ind-1')).toBe('ind-1');
    expect(parseAcgihOfficialIndicatorId('ind-1::risk-24')).toBe('ind-1');
    expect(parseAcgihOfficialIndicatorId('ind-1::risk-24::exam50')).toBe('ind-1');
  });
});

describe('resolveExamRiskRuleSourceDisplay', () => {
  it('NR-07 mantém fonte principal e link do indicador', () => {
    const display = resolveExamRiskRuleSourceDisplay({
      source: PcmsoExamRiskRuleSourceEnum.NR_07,
      sourceIndicatorId: 'ind-nr7-1',
      acgihOrigin: null,
    });

    expect(display).toEqual({
      sourceDisplayLabel: 'NR-07',
      sourceOriginType: 'NR_07',
      sourceOriginId: 'ind-nr7-1',
    });
  });

  it('TECHNICAL com origem ACGIH exibe ACGIH/BEI e ID do staging', () => {
    const display = resolveExamRiskRuleSourceDisplay({
      source: PcmsoExamRiskRuleSourceEnum.TECHNICAL,
      sourceIndicatorId: 'official-1::risk-heptano::exam99',
      acgihOrigin: {
        acgihBeiIndicatorId: 'staging-acgih-1',
        substanceName: 'n-Heptano',
      },
    });

    expect(display).toEqual({
      sourceDisplayLabel: 'ACGIH/BEI',
      sourceOriginType: 'ACGIH_BEI',
      sourceOriginId: 'staging-acgih-1',
    });
  });

  it('TECHNICAL genérico continua Critério técnico', () => {
    const display = resolveExamRiskRuleSourceDisplay({
      source: PcmsoExamRiskRuleSourceEnum.TECHNICAL,
      sourceIndicatorId: null,
      acgihOrigin: null,
    });

    expect(display.sourceDisplayLabel).toBe('Critério técnico');
    expect(display.sourceOriginType).toBe('TECHNICAL');
    expect(display.sourceOriginId).toBeNull();
  });
});
