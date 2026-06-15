import { describe, expect, it } from '@jest/globals';

import {
  isInvalidAgentCandidate,
  parseCompoundSynonymsTable,
  parseExposureLimitsTable,
} from './ho-method-niosh-table-parser.util';
import { parseNioshNmamPdfText } from './ho-method-niosh-parser';

const TABLE_1_SNIPPET = `Table 1. CAS Numbers, RTECS Numbers, and Synonyms
Compound
(alphabetically)
CAS
Number
RTECS
Number(1)
Other Names(2)
Acenaphthene 	83-32-9 	AB1000000 	1,2-dihydroacenaphthylene; 1,8-ethylenenapthylene
Acenaphthylene 	208-96-8 	AB1254000 	Acenaphthalene; cyclopenta[de]naphthalene
Anthracene 	120-12-7 	CA9350000
Benzo[a]pyrene 	50-32-8 	DJ3675000 	3,4-benzopyrene; 6,7-benzopyrene
Naphthalene 	91-20-3 	QJ0525000 	Naphthene, naphthalin
Pyrene 	129-00-0 	UR2450000 	benzo[def]phenanthrene
(1) Registry of Toxic Effects of Chemical Substances [6].`;

const TABLE_3_SNIPPET = `Table 3. Exposure Limits (1, 2, 3)
Compound
(alphabetically)
OSHA PEL 	NIOSH REL
Acenaphthene 0.2 mg/m3 (benzene soluble fraction) 	0.1 mg/m3 (cyclohexane soluble fraction)
Anthracene 0.2 mg/m3 (benzene soluble fraction) 	0.1 mg/m3 (cyclohexane soluble fraction)
Naphthalene 10 ppm (50 mg/m 3
) 	10 ppm (50 mg/m 3
); STEL 15 ppm (75 mg/m3
)
Pyrene 0.2 mg/m3 (benzene soluble fraction) 	0.1 mg/m3 (cyclohexane soluble fraction)
(1) OSHA Recommendations for Occupational Safety and Health [10].`;

const METHOD_5528_HEADER = `PAH in Air by GC-MS SIM: METHOD 5528, Issue 1, dated 10 November 2021 - Page 6 of 15
NIOSH Manual of Analytical Methods (NMAM), Fifth Edition
MW: Table 1 	CAS: Table 1 	RTECS: Table 1
METHOD: 5528, Issue 1 	EVALUATION: FULL
OSHA: 	Table 3
NIOSH REL: 	Table 3
SYNONYMS: Table 1
ANALYTE: 	Table 1
`;

const METHOD_2514_HEADER = `NIOSH Manual of Analytical Methods (NMAM), Fifth Edition
ANISIDINE 	2514
METHOD: 2514, Issue 3 	EVALUATION: FULL
OSHA: 	0.5 mg/m 3 (skin)
NIOSH: 0.5 mg/m 3 (skin);
ANALYTE: 	o-anisidine and p-anisidine
CAS: (o-) 90-04-0
(p-) 104-94-9
`;

describe('ho-method-niosh-table-parser.util', () => {
  it('ignora nomes inválidos de agente', () => {
    expect(isInvalidAgentCandidate('Table 1')).toBe(true);
    expect(isInvalidAgentCandidate('SAMPLING')).toBe(true);
    expect(isInvalidAgentCandidate('Acenaphthene')).toBe(false);
  });

  it('extrai linhas da tabela de compostos', () => {
    const rows = parseCompoundSynonymsTable(TABLE_1_SNIPPET);

    expect(rows).toHaveLength(6);
    expect(rows[0]).toEqual(
      expect.objectContaining({
        compound: 'Acenaphthene',
        cas: '83-32-9',
        synonyms: [
          '1,2-dihydroacenaphthylene',
          '1,8-ethylenenapthylene',
        ],
      }),
    );
    expect(rows.find((row) => row.compound === 'Naphthalene')?.cas).toBe(
      '91-20-3',
    );
  });

  it('extrai limites por composto da tabela 3', () => {
    const rows = parseExposureLimitsTable(TABLE_3_SNIPPET);
    const acenaphthene = rows.find((row) => row.compound === 'Acenaphthene');
    const naphthalene = rows.find((row) => row.compound === 'Naphthalene');

    expect(acenaphthene?.oshaPel).toBe(
      '0,2 mg/m3 (benzene soluble fraction)',
    );
    expect(acenaphthene?.nioshRel).toBe(
      '0,1 mg/m3 (cyclohexane soluble fraction)',
    );
    expect(naphthalene?.oshaPel).toBe('10 ppm (50 mg/m3)');
    expect(naphthalene?.nioshRel).toBe('10 ppm (50 mg/m3)');
    expect(naphthalene?.nioshStel).toBe('15 ppm (75 mg/m3)');
  });
});

describe('parseNioshNmamPdfText multi-agent integration', () => {
  it('monta agentes e limites por composto quando cabeçalho referencia tabelas', () => {
    const text = `${METHOD_5528_HEADER}\n${TABLE_1_SNIPPET}\n${TABLE_3_SNIPPET}`;
    const parsed = parseNioshNmamPdfText(text);

    expect(parsed.agents).toHaveLength(6);
    expect(parsed.agents.some((agent) => agent.substanceName === 'Table 1')).toBe(
      false,
    );

    const acenaphthene = parsed.agents.find(
      (agent) => agent.substanceName === 'Acenaphthene',
    );
    const naphthalene = parsed.agents.find(
      (agent) => agent.substanceName === 'Naphthalene',
    );

    expect(acenaphthene?.cas).toBe('83-32-9');
    expect(acenaphthene?.occupationalLimits?.oshaPel.value).toBe(
      '0,2 mg/m3 (benzene soluble fraction)',
    );
    expect(acenaphthene?.occupationalLimits?.nioshRel.value).toBe(
      '0,1 mg/m3 (cyclohexane soluble fraction)',
    );
    expect(naphthalene?.occupationalLimits?.oshaPel.value).toBe(
      '10 ppm (50 mg/m3)',
    );
    expect(naphthalene?.occupationalLimits?.nioshStel.value).toBe(
      '15 ppm (75 mg/m3)',
    );
    expect(parsed.occupationalLimits.oshaPel.value).toBeNull();
  });

  it('preserva parsing simples de método com limites inline', () => {
    const parsed = parseNioshNmamPdfText(
      `${METHOD_2514_HEADER}
SYNONYMS: o-isomer: 2-aminoanisole; p-isomer: 4-aminoanisole`,
    );

    expect(parsed.agents).toHaveLength(2);
    expect(parsed.agents.map((agent) => agent.substanceName)).toEqual(
      expect.arrayContaining(['O-anisidine', 'P-anisidine']),
    );
    expect(parsed.occupationalLimits.oshaPel.value).toContain('0.5 mg/m');
  });
});
