import { describe, expect, it } from '@jest/globals';

import { assembleRiskSubtypeCurationPrompt } from './risk-subtype-curation-ai-prompt.assembler';
import { RISK_SUBTYPE_CURATION_AI_READONLY_NOTE } from './constants/risk-subtype-curation-ai-readonly-note.constant';

describe('assembleRiskSubtypeCurationPrompt', () => {
  const subType = {
    id: 1,
    name: 'Fenóis e cresóis [FEN/HA]',
    description: 'Subtipo de fenóis',
  };

  it('monta seções base, família, subtipo e nota fixa', () => {
    const result = assembleRiskSubtypeCurationPrompt({
      subType,
      globalPrompt: {
        content: 'Prompt global customizado',
        source: 'database',
      },
    });

    expect(result.sections.some((section) => section.name === 'Base seguro do sistema')).toBe(
      true,
    );
    expect(result.sections.some((section) => section.name === 'Bloco por família química')).toBe(
      true,
    );
    expect(result.sections.some((section) => section.name === 'Subtipo alvo')).toBe(true);
    expect(result.assembledPrompt).toContain(RISK_SUBTYPE_CURATION_AI_READONLY_NOTE);
    expect(result.useSystemDefault).toBe(true);
  });

  it('inclui instruções do subtipo quando useSystemDefault=false', () => {
    const result = assembleRiskSubtypeCurationPrompt({
      subType,
      instruction: {
        subTypeId: 1,
        useSystemDefault: false,
        instructions: 'Incluir apenas fenóis reais.',
        positiveExamples: 'Fenol',
        negativeExamples: 'Benzeno',
        cautionRules: 'Evitar aromaticidade isolada.',
        preferredModel: null,
        revision: 2,
        updatedById: 1,
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    });

    expect(result.sections.some((section) => section.name === 'Instruções do subtipo')).toBe(
      true,
    );
    expect(result.sections.some((section) => section.name === 'Exemplos positivos')).toBe(true);
    expect(result.sections.some((section) => section.name === 'Exemplos negativos')).toBe(true);
    expect(result.sections.some((section) => section.name === 'Regras de cautela/ambiguidade')).toBe(
      true,
    );
    expect(result.revision).toBe(2);
  });

  it('inclui customPrompt de sessão', () => {
    const result = assembleRiskSubtypeCurationPrompt({
      subType,
      sessionCustomPrompt: 'Priorizar CAS confiável.',
    });

    expect(result.sections.some((section) => section.source === 'session')).toBe(true);
    expect(result.assembledPrompt).toContain('Priorizar CAS confiável.');
  });
});
