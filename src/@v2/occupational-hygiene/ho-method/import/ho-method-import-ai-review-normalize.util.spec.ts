import { describe, expect, it } from '@jest/globals';

import {
  normalizeHoMethodAiReviewResponse,
  parseHoMethodAiReviewJson,
} from './ho-method-import-ai-review-normalize.util';

describe('ho-method-import-ai-review-normalize.util', () => {
  it('normalizes AI response with nullable fields', () => {
    const normalized = normalizeHoMethodAiReviewResponse({
      method: {
        institution: 'NIOSH',
        methodCode: '3800',
        issue: null,
        issueDate: null,
        displayName: 'Organophosphorus',
        analyticalMethod: 'GC',
        evaluation: null,
      },
      agents: [
        {
          name: 'Malathion',
          cas: '121-75-5',
          synonyms: ['Malation'],
          translatedNamePtBr: 'Malation',
          technicalNotes: [],
          occupationalLimits: {
            nr15Lt: null,
            acgihTwa: '0,2',
            acgihStel: null,
            acgihCeiling: null,
            nioshRel: '10',
            nioshStel: null,
            nioshCeiling: null,
            oshaPel: null,
            oshaStel: null,
            oshaCeiling: null,
            aihaWeel: null,
            aihaWeelCeiling: null,
            unit: 'mg/m3',
            notes: null,
          },
          sourceTrace: [
            {
              page: 2,
              table: 'Table 1',
              field: 'cas',
              excerpt: '121-75-5',
            },
          ],
          confidence: 'high',
          warnings: [],
        },
      ],
      sampling: null,
      preparation: null,
      analytical: null,
      observations: null,
      diagnostics: {
        detectedTables: [],
        warnings: ['Tabela complexa'],
      },
    });

    expect(normalized.agents[0].cas).toBe('121-75-5');
    expect(normalized.agents[0].occupationalLimits?.nioshRel).toBe('10');
    expect(normalized.diagnostics.warnings).toContain('Tabela complexa');
  });

  it('throws when no valid agents are returned', () => {
    expect(() =>
      parseHoMethodAiReviewJson(
        JSON.stringify({
          agents: [],
          diagnostics: { detectedTables: [], warnings: [] },
        }),
      ),
    ).toThrow('Resposta incompleta');
  });
});
