import { describe, expect, it } from '@jest/globals';

import {
  isInvalidAgentCandidate,
  parseCompoundPropertiesTable,
  parseCompoundSynonymsTable,
  parseExposureLimitsTable,
  parseNmamCompoundTable,
  parseNmamExposureLimitsTable,
  parsePpmExposureLimitsTable,
} from './ho-method-niosh-table-parser.util';
import { parseNioshNmamPdfText } from './ho-method-niosh-parser';
import {
  parseFlowRateValue,
  parseSamplingBlock,
  parseStabilityValue,
  parseVolumeValues,
} from './ho-method-niosh-sampling-parser.util';

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

const METHOD_5528_SAMPLING = `SAMPLER:
FLOW RATE:
VOL-MIN:
MAX:
SHIPMENT:
SAMPLE
STABILITY:
BLANKS:
Filter + Sorbent tube (glass fiber filter, OVS-7 tube: 13-mm; XAD-7, 200 mg/100 mg)
1 L/min
1 L
480 L
routine
at least 30 days at < 4°C
2 field blanks per batch
DESORPTION: toluene
ACCURACY
`;

const METHOD_2027_HEADER = `KETONES: METHOD 2027, Issue 1, dated 17 July 2016 - Page 6 of 7
NIOSH Manual of Analytical Methods (NMAM), Fifth Edition
MW: Table 1 	CAS: Table 1 	RTECS: Table 1
METHOD: 2027, Issue 1 	EVALUATION: FULL
OSHA: Table 2
NIOSH: Table 2
SYNONYMS: See individual compounds in Table 1
ANALYTE: see Table 1
`;

const METHOD_2027_TABLE_1 = `Table 1. Synonyms, Formulae, Molecular weights, Properties, CAS#, RTECS
Compound/
synonyms
CAS#
RTECS
Acetone /
2-Propanone
67-64-1
AL3150000
2-Butanone
Methylethyl ketone
78-93-3
EL6475000
Cyclohexanone /
Cyclohexyl ketone
108-94-1
GW1050000
Cyclopentanone /
Ketocyclopentane
120-92-3
GY4725000
2-Hexanone /
Butyl methyl ketone
591-78-6
MP1400000
4-Methyl-2-
pentanone /
MIBK/Methyl
isobutyl ketone
108-10-1
SA9275000
2,6-Dimethyl-4-
heptanone/
Diisobutyl ketone
108-83-8
MJ5775000
`;

const METHOD_2027_TABLE_2 = `Table 2. Occupational exposure limits, ppm [9]
Substance 	OSHA PELs 	NIOSH RELs
TWA 	TWA 	STEL 	mg/m3 per ppm
Acetone 	1000 	250 	2.41
2-Butanone 	200 	200 	300 	2.95
Cyclohexanone 	50 	25 	4.08
Cyclopentanone 	3.50
4-Methyl-2-pentanone 	100 	50 	75 	4.16
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

  it('extrai parâmetros de amostragem do NIOSH 5528', () => {
    const parsed = parseNioshNmamPdfText(
      `${METHOD_5528_HEADER}\n${METHOD_5528_SAMPLING}\n${TABLE_1_SNIPPET}\n${TABLE_3_SNIPPET}`,
    );

    expect(parsed.fields.minimumFlowRate.value).toBe(1);
    expect(parsed.fields.maximumFlowRate.value).toBe(1);
    expect(parsed.fields.flowRateUnit.value).toBe('L/min');
    expect(parsed.fields.minimumVolume.value).toBe(1);
    expect(parsed.fields.maximumVolume.value).toBe(480);
    expect(parsed.fields.volumeUnit.value).toBe('L');
    expect(parsed.fields.stabilityDays.value).toBe(30);
    expect(parsed.fields.stabilityText.value).toContain('at least 30 days');
    expect(parsed.fields.storageTemperature.value).toBe(4);
    expect(parsed.fields.storageTemperatureUnit.value).toBe('°C');
    expect(parsed.fields.extractionSolvent.value).toBe('toluene');
    expect(parsed.fields.sampler.value).toContain('OVS-7');
    expect(parsed.fields.sampler.value).toContain('XAD-7');
    expect(parsed.fields.sampler.value).toContain('200 mg/100 mg');
    expect(parsed.agents).toHaveLength(6);
    expect(parsed.agents.some((agent) => agent.substanceName === 'Table 1')).toBe(
      false,
    );
  });
});

describe('ho-method-niosh-sampling-parser.util', () => {
  it('preenche vazão mínima e máxima com valor fixo', () => {
    const flow = parseFlowRateValue('1 L/min');

    expect(flow).toEqual(
      expect.objectContaining({
        minimum: 1,
        maximum: 1,
        unit: 'L/min',
      }),
    );
  });

  it('extrai faixa de vazão', () => {
    const flow = parseFlowRateValue('0.5 to 1 L/min');

    expect(flow?.minimum).toBe(0.5);
    expect(flow?.maximum).toBe(1);
  });

  it('extrai volume mínimo e máximo', () => {
    const volume = parseVolumeValues('1 L', '480 L');

    expect(volume?.minimum).toBe(1);
    expect(volume?.maximum).toBe(480);
    expect(volume?.unit).toBe('L');
  });

  it('extrai estabilidade e temperatura com limite inferior', () => {
    const stability = parseStabilityValue('at least 30 days at < 4°C');

    expect(stability?.days).toBe(30);
    expect(stability?.temperature).toBe(4);
    expect(stability?.temperatureUnit).toBe('°C');
  });

  it('extrai bloco completo de amostragem', () => {
    const block = parseSamplingBlock(METHOD_5528_SAMPLING);

    expect(block?.sampler).toContain('tubo adsorvente');
    expect(block?.sampler).toContain('OVS-7');
    expect(block?.flow?.minimum).toBe(1);
    expect(block?.volume?.maximum).toBe(480);
    expect(block?.extractionSolvent).toBe('toluene');
  });

  it('extrai múltiplos agentes e limites do NIOSH 2027', () => {
    const text = `${METHOD_2027_HEADER}\n${METHOD_2027_TABLE_1}\n${METHOD_2027_TABLE_2}`;
    const parsed = parseNioshNmamPdfText(text);

    expect(parsed.agents).toHaveLength(7);
    expect(parsed.agents.map((agent) => agent.cas)).toEqual(
      expect.arrayContaining([
        '67-64-1',
        '78-93-3',
        '108-94-1',
        '120-92-3',
        '591-78-6',
        '108-10-1',
        '108-83-8',
      ]),
    );

    const acetone = parsed.agents.find((agent) => agent.cas === '67-64-1');
    const butanone = parsed.agents.find((agent) => agent.cas === '78-93-3');
    const cyclohexanone = parsed.agents.find((agent) => agent.cas === '108-94-1');

    expect(acetone?.substanceName).toBe('Acetone');
    expect(acetone?.occupationalLimits?.oshaPel.value).toBe('1000 ppm');
    expect(acetone?.occupationalLimits?.nioshRel.value).toBe('250 ppm');
    expect(acetone?.technicalNotes).toEqual(
      expect.arrayContaining([expect.stringContaining('2,41')]),
    );
    expect(butanone?.occupationalLimits?.nioshStel.value).toBe('300 ppm');
    expect(cyclohexanone?.occupationalLimits?.oshaPel.value).toBe('50 ppm');
    expect(cyclohexanone?.occupationalLimits?.nioshRel.value).toBe('25 ppm');
    expect(parsed.occupationalLimits.oshaPel.value).toBeNull();
  });
});

describe('ho-method-niosh-table-parser 2027 layouts', () => {
  it('extrai compostos da tabela de propriedades', () => {
    const rows = parseCompoundPropertiesTable(METHOD_2027_TABLE_1);

    expect(rows).toHaveLength(7);
    expect(rows[0]).toEqual(
      expect.objectContaining({
        compound: 'Acetone',
        cas: '67-64-1',
        synonyms: ['2-Propanone'],
      }),
    );
  });

  it('extrai limites ppm da tabela 2', () => {
    const rows = parsePpmExposureLimitsTable(METHOD_2027_TABLE_2);
    const acetone = rows.find((row) => row.compound === 'Acetone');

    expect(acetone?.oshaPel).toBe('1000 ppm');
    expect(acetone?.nioshRel).toBe('250 ppm');
    expect(acetone?.mgPerPpmFactor).toBe('2.41');
  });

  it('prefere o parser com mais compostos válidos', () => {
    const rows = parseNmamCompoundTable(
      `${METHOD_5528_HEADER}\n${TABLE_1_SNIPPET}\n${METHOD_2027_TABLE_1}`,
    );

    expect(rows.length).toBeGreaterThanOrEqual(7);
  });
});
