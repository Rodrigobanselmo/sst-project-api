import { normalizeText } from '../biological-indicator-normalize.util';

/**
 * Frente A.1 — overrides manuais versionados em código para a correlação
 * ACGIH/BEI × Fatores de Risco. SOMENTE METADADO DE CURADORIA: nada é gravado
 * no banco. O preview sobrepõe estas decisões ao match automático.
 *
 * Decisões aprovadas pelo MASTER (rastreáveis). Cada override resolve o(s)
 * RiskFactor(s) alvo por identificador estável (`riskFactorId`) — preferível a
 * nome/CAS — e o preview valida em runtime que cada alvo existe, é system=true e
 * não está deletado (caso contrário emite blocker OVERRIDE_TARGET_MISSING).
 */

export type AcgihCorrelationOverrideFinalStatus =
  | 'ACEITAR_CANONICO'
  | 'ACEITAR_GRUPO'
  | 'ACEITAR_MULTIPLO_CANONICO';

export type AcgihCorrelationOverrideTarget = {
  /** Identificador estável do RiskFactor alvo (resolução preferencial). */
  riskFactorId: string;
  /** Nome esperado do fator — usado apenas para validação/aviso, não para resolver. */
  expectedRiskName: string;
  /** CAS esperado do fator no cadastro (pode divergir do CAS da ACGIH). */
  expectedRiskCas: string | null;
};

export type AcgihCorrelationOverride = {
  /** Rótulo legível do override (para auditoria/log). */
  label: string;
  /** Nomes ACGIH normalizados que casam com este override (qualquer um). */
  acgihNameNormalized: string[];
  /** CAS da ACGIH que também casam (normalizados em runtime). Opcional. */
  acgihCas: string[];
  finalStatus: AcgihCorrelationOverrideFinalStatus;
  /** Marca o vínculo como pertencente a fator amplo/família. */
  isGroup: boolean;
  targets: AcgihCorrelationOverrideTarget[];
  note: string;
};

const n = (value: string): string => normalizeText(value);

export const ACGIH_RISK_CORRELATION_OVERRIDES: AcgihCorrelationOverride[] = [
  {
    label: 'n-Heptano',
    acgihNameNormalized: [n('n-Heptano')],
    acgihCas: ['142-82-5'],
    finalStatus: 'ACEITAR_GRUPO',
    isGroup: true,
    targets: [
      {
        riskFactorId: '04b98963-0708-4de6-a757-9fe28bc01074',
        expectedRiskName: 'Heptano, todos os isômeros',
        expectedRiskCas: '142-82-5; 590-35-2; 565-59-3; 108-08-7; 591-76-4; 589-34-4',
      },
    ],
    note: 'CAS da ACGIH encontrado dentro de fator amplo/grupo de isômeros.',
  },
  {
    label: 'Ciclohexano',
    acgihNameNormalized: [n('Ciclohexano')],
    acgihCas: ['110-82-7'],
    finalStatus: 'ACEITAR_CANONICO',
    isGroup: false,
    targets: [
      {
        riskFactorId: '2d06958e-cef7-4f76-869f-ebbcd9863195',
        expectedRiskName: 'Ciclohexano (Agente Insalubre)',
        expectedRiskCas: '110-82-7',
      },
    ],
    note: 'Duplicidade/erro cadastral; canônico é Ciclohexano (Agente Insalubre). Ignorar candidato "Ciclohexeno".',
  },
  {
    label: 'Níquel e compostos inorgânicos',
    acgihNameNormalized: [n('Níquel e compostos inorgânicos')],
    acgihCas: ['7440-02-0'],
    finalStatus: 'ACEITAR_CANONICO',
    isGroup: false,
    targets: [
      {
        riskFactorId: 'd3370878-7ea2-4689-9882-1a38efc67fc0',
        expectedRiskName:
          'Níquel, como Ni Metal elementar e seus compostos tóxicos. (Agente Insalubre & Nocivo)',
        expectedRiskCas: '7440-02-0',
      },
    ],
    note: 'Canônico Níquel metal elementar; não usar "Níquel carbonila, como Ni".',
  },
  {
    label: 'MBOCA/MOCA',
    acgihNameNormalized: [
      n("4,4'-Metileno bis(2-cloroanilina) (MBOCA)"),
      n("4,4'-Metileno bis(2-cloroanilina)"),
    ],
    acgihCas: ['101-14-4'],
    finalStatus: 'ACEITAR_CANONICO',
    isGroup: false,
    targets: [
      {
        riskFactorId: '208be4ca-6729-4f35-8657-380984f6b43f',
        expectedRiskName: '4,4-metileno-bis-(2-cloroanilina) (Agente Nocivo)',
        expectedRiskCas: '101-14-4',
      },
    ],
    note: 'Canônico; sinônimos MOCA®, MBOCA®, Metileno-ortocloroanilina (MOCA). Cadastro duplicado/sinônimo.',
  },
  {
    label: 'Fluoretos',
    acgihNameNormalized: [n('Fluoretos')],
    acgihCas: [],
    finalStatus: 'ACEITAR_CANONICO',
    isGroup: false,
    targets: [
      {
        riskFactorId: '19cec380-a48c-4243-8966-a623dc42c122',
        expectedRiskName: 'Fluoretos, como F',
        expectedRiskCas: '7782-41-4',
      },
    ],
    note: 'ACGIH pode vir sem CAS; decisão manual define o fator. CAS real do fator no banco = 7782-41-4.',
  },
  {
    label: 'PAHs / HAP',
    acgihNameNormalized: [
      n('Hidrocarbonetos aromáticos policíclicos (PAHs)'),
      n('Hidrocarbonetos aromáticos policíclicos'),
      n('HAP'),
      n('PAHs'),
    ],
    acgihCas: [],
    finalStatus: 'ACEITAR_GRUPO',
    isGroup: true,
    targets: [
      {
        riskFactorId: 'd5c14f7d-91b7-44df-8bd5-f9ad5b6d0393',
        expectedRiskName:
          'Hidrocarbonetos e outros compostos de carbono. (Agente Insalubre)',
        expectedRiskCas: 'Variável',
      },
    ],
    note: 'Fator amplo/família; não tratar como CAS exato.',
  },
  {
    label: 'TDI (Toluenodiisocianato, isômeros 2,4/2,6)',
    acgihNameNormalized: [
      n('Toluenodiisocianato (TDI) - isômeros 2,4 ou 2,6'),
      n('Toluenodiisocianato (TDI)'),
      n('Toluenodiisocianato'),
    ],
    acgihCas: ['91-08-7', '584-84-9'],
    finalStatus: 'ACEITAR_MULTIPLO_CANONICO',
    isGroup: false,
    targets: [
      {
        riskFactorId: 'a69c23e9-3d4c-417a-a888-63e63dd61933',
        expectedRiskName: '2,4 Diisocianato de tolueno (Agente Insalubre & Nocivo)',
        expectedRiskCas: '584-84-9',
      },
      {
        riskFactorId: 'b1954f84-7b04-461a-9495-ec659c0fae32',
        expectedRiskName: '2,6 Diisocianato de tolueno',
        expectedRiskCas: '91-08-7',
      },
    ],
    note: 'Exame/regra ACGIH vale para qualquer um dos dois isômeros; o apply futuro deve criar vínculo para ambos.',
  },
];
