import {
  IRiskFactorAiSuggestionsUseCase,
  RiskFactorAiSuggestionSourceTraceItem,
} from '../risk-factor-ai-suggestions.types';
import { normalizeRiskFactorType } from '../shared/risk-factor-ai-suggestions-type.util';

export type RiskFactorSeverityValidationInput = {
  payload: IRiskFactorAiSuggestionsUseCase.Params;
  aiResponse: Pick<
    IRiskFactorAiSuggestionsUseCase.Result,
    'risk' | 'symptoms' | 'severity'
  >;
};

export type RiskFactorSeverityValidationResult = {
  severity: number;
  severityAi: number;
  severityAdjusted: boolean;
  severityAdjustmentReason?: string;
  warning?: string;
  sourceTraceEntry?: RiskFactorAiSuggestionSourceTraceItem;
};

const CHEMICAL_PHYSICAL_MINIMAL_PATTERNS = [
  /\birrita/i,
  /\bmucosa/i,
  /\bolhos?\b/i,
  /\bpele\b/i,
  /\brespirat/i,
  /\bnarc[oó]t/i,
  /\bsonol[eê]ncia\b/i,
  /\btontura\b/i,
  /\bcefaleia\b/i,
  /\bn[aá]usea\b/i,
  /\btoxicidade\b/i,
  /\b[oó]rg[aã]o[- ]alvo\b/i,
  /\bsistema nervoso\b/i,
  /\bsnc\b/i,
  /\bcarcinog/i,
  /\bmutagen/i,
  /\bteratog/i,
  /\breprodut/i,
  /\bdano\b/i,
  /\bagravo\b/i,
  /\bles[aã]o\b/i,
  /\bedema\b/i,
  /\bdermatite\b/i,
  /\bqueimadura\b/i,
  /\bcorrosiv/i,
  /\basfixia\b/i,
  /\bincapacidade\b/i,
  /\bobito\b/i,
  /\b[oó]bito\b/i,
  /\bmorte\b/i,
  /\binsalubr/i,
  /\bidlh\b/i,
  /\bipvs\b/i,
];

const CHEMICAL_PHYSICAL_MODERATE_PATTERNS = [
  /\bdepress[aã]o do sistema nervoso central\b/i,
  /\bdepress[aã]o do snc\b/i,
  /\bedema pulmonar\b/i,
  /\btoxicidade sist[eê]mica\b/i,
  /\bcarcinog[eê]nic/i,
  /\bteratog[eê]nic/i,
  /\bmutag[eê]nic/i,
  /\btoxicidade reprodutiva\b/i,
  /\birrita[cç][aã]o respirat[oó]ria\b/i,
  /\bdano (?:ocular|cut[aâ]neo|hep[aá]tico|renal|pulmonar|neurol[oó]gico)\b/i,
];

const PHYSICAL_SPECIFIC_PATTERNS = [
  /\bru[ií]do\b/i,
  /\bpair\b/i,
  /\bperda auditiva\b/i,
  /\bvibra[cç][aã]o\b/i,
  /\bradia[cç][aã]o\b/i,
  /\bionizante\b/i,
  /\bcalor\b/i,
  /\bfrio\b/i,
  /\bhipotermia\b/i,
  /\bhipertermia\b/i,
  /\bpress[aã]o\b/i,
  /\bumidade\b/i,
];

const BIOLOGICAL_PATTERNS = [
  /\bagente biol[oó]gic/i,
  /\bpat[oó]gen/i,
  /\bclasse\s*[234]\b/i,
  /\bnr\s*[- ]?32\b/i,
  /\baerossol/i,
  /\bgot[ií]cula/i,
  /\bperfurocortante\b/i,
  /\bperfurante\b/i,
  /\binfec/i,
  /\bcont[aá]gio\b/i,
  /\bvir(?:us|al)\b/i,
  /\bbact[eé]ri/i,
  /\bfungo\b/i,
  /\bhepatite\b/i,
  /\bhiv\b/i,
  /\btuberculose\b/i,
];

const BIOLOGICAL_HIGH_PATTERNS = [
  /\bclasse\s*4\b/i,
  /\bex[oó]tic/i,
  /\bdesconhecid/i,
  /\bsem profilaxia\b/i,
];

const BIOLOGICAL_SIGNIFICANT_PATTERNS = [
  /\bclasse\s*3\b/i,
  /\baerossol/i,
  /\bgot[ií]cula/i,
];

const BIOLOGICAL_MODERATE_PATTERNS = [
  /\bclasse\s*2\b/i,
  /\bperfurocortante\b/i,
  /\bperfurante\b/i,
];

const ERGONOMIC_PATTERNS = [
  /\bsobrecarga\b/i,
  /\bler\b/i,
  /\bdort\b/i,
  /\bpostura\b/i,
  /\brepetitiv/i,
  /\blevantamento\b/i,
  /\bincapacidade\b/i,
  /\bafastamento\b/i,
  /\bsequelas?\b/i,
  /\breabilita[cç][aã]o\b/i,
  /\binss\b/i,
  /\bincapacidade permanente\b/i,
  /\b15 dias\b/i,
  /\bsuperior a 15\b/i,
  /\bmais de 15\b/i,
];

const ERGONOMIC_HIGH_PATTERNS = [
  /\bincapacidade permanente total\b/i,
  /\b[oó]bito\b/i,
  /\bmorte\b/i,
  /\bsequelas permanentes\b/i,
  /\breabilita[cç][aã]o profissional\b/i,
];

const ERGONOMIC_MODERATE_PATTERNS = [
  /\bsuperior a 15 dias\b/i,
  /\bmais de 15 dias\b/i,
  /\bincapacidade tempor[aá]ria superior\b/i,
];

const ACCIDENT_PATTERNS = [
  /\bacidente\b/i,
  /\bqueda\b/i,
  /\bchoque el[eé]tric/i,
  /\bm[aá]quina\b/i,
  /\bcorte\b/i,
  /\besmagamento\b/i,
  /\bamputa[cç][aã]o\b/i,
  /\bperda de vis[aã]o\b/i,
  /\bfratura\b/i,
  /\bqueimadura\b/i,
  /\binc[eê]ndio\b/i,
  /\bexplos[aã]o\b/i,
  /\b[oó]bito\b/i,
  /\bmorte\b/i,
];

const ACCIDENT_HIGH_PATTERNS = [
  /\bamputa[cç][aã]o\b/i,
  /\besmagamento\b/i,
  /\bperda de vis[aã]o\b/i,
  /\bqueimadura\b/i,
  /\b30%\b/i,
  /\b[oó]bito\b/i,
  /\bmorte\b/i,
];

const hasFilledLimits = (
  limits: IRiskFactorAiSuggestionsUseCase.Params['limits'],
): boolean => {
  if (!limits) return false;

  return Object.values(limits).some(
    (value) => typeof value === 'string' && value.trim().length > 0,
  );
};

const collectValidationContext = (
  payload: IRiskFactorAiSuggestionsUseCase.Params,
  aiResponse: RiskFactorSeverityValidationInput['aiResponse'],
): string => {
  const known = payload.knownData;
  const chunks = [
    payload.name,
    payload.cas,
    payload.synonyms,
    payload.method,
    payload.unit,
    known?.risk,
    known?.symptoms,
    known?.carcinogenicityAcgih,
    known?.carcinogenicityLinach,
    known?.observations,
    known?.methodContext,
    known?.pdfObservations,
    known?.parseWarnings?.join(' '),
    aiResponse.risk,
    aiResponse.symptoms,
    ...Object.values(payload.limits ?? {}),
  ];

  return chunks
    .filter((chunk): chunk is string => typeof chunk === 'string' && chunk.trim().length > 0)
    .join('\n')
    .toLowerCase();
};

const matchesAny = (text: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(text));

const buildAdjustment = (
  severityAi: number,
  severity: number,
  reason: string,
): RiskFactorSeverityValidationResult => ({
  severity,
  severityAi,
  severityAdjusted: true,
  severityAdjustmentReason: reason,
  warning: reason,
  sourceTraceEntry: {
    source: 'Validação técnica de severidade',
    usedFor: ['severity'],
    note: reason,
  },
});

const noAdjustment = (severityAi: number): RiskFactorSeverityValidationResult => ({
  severity: severityAi,
  severityAi,
  severityAdjusted: false,
});

const applyMinimumSeverity = (
  severityAi: number,
  minimumSeverity: number,
  typeLabel: string,
): RiskFactorSeverityValidationResult => {
  if (severityAi >= minimumSeverity) {
    return noAdjustment(severityAi);
  }

  const reason = `Severidade ajustada de ${severityAi} para ${minimumSeverity} por regra de consistência técnica: fator de risco ${typeLabel} com efeitos ou dados ocupacionais reconhecidos.`;

  return buildAdjustment(severityAi, minimumSeverity, reason);
};

const validateChemicalOrPhysicalSeverity = (
  input: RiskFactorSeverityValidationInput,
  typeLabel: string,
): RiskFactorSeverityValidationResult => {
  const severityAi = input.aiResponse.severity;
  const contextText = collectValidationContext(input.payload, input.aiResponse);
  const hasLimits = hasFilledLimits(input.payload.limits);
  const knownData = input.payload.knownData;

  const hasCarcinogenicityData = Boolean(
    knownData?.carcinogenicityAcgih?.trim() ||
      knownData?.carcinogenicityLinach?.trim(),
  );

  const hasAnyOccupationalRisk =
    hasLimits ||
    hasCarcinogenicityData ||
    Boolean(knownData?.risk?.trim()) ||
    Boolean(knownData?.symptoms?.trim()) ||
    matchesAny(contextText, CHEMICAL_PHYSICAL_MINIMAL_PATTERNS) ||
    (typeLabel === 'físico' && matchesAny(contextText, PHYSICAL_SPECIFIC_PATTERNS));

  const hasModerateRisk =
    hasCarcinogenicityData ||
    matchesAny(contextText, CHEMICAL_PHYSICAL_MODERATE_PATTERNS) ||
    (typeLabel === 'físico' && matchesAny(contextText, PHYSICAL_SPECIFIC_PATTERNS));

  let minimumSeverity = 1;
  if (hasModerateRisk) minimumSeverity = 3;
  else if (hasAnyOccupationalRisk) minimumSeverity = 2;

  return applyMinimumSeverity(severityAi, minimumSeverity, typeLabel);
};

const validateBiologicalSeverity = (
  input: RiskFactorSeverityValidationInput,
): RiskFactorSeverityValidationResult => {
  const severityAi = input.aiResponse.severity;
  const contextText = collectValidationContext(input.payload, input.aiResponse);

  if (!matchesAny(contextText, BIOLOGICAL_PATTERNS)) {
    return noAdjustment(severityAi);
  }

  let minimumSeverity = 2;
  if (matchesAny(contextText, BIOLOGICAL_HIGH_PATTERNS)) minimumSeverity = 5;
  else if (matchesAny(contextText, BIOLOGICAL_SIGNIFICANT_PATTERNS)) minimumSeverity = 4;
  else if (matchesAny(contextText, BIOLOGICAL_MODERATE_PATTERNS)) minimumSeverity = 3;

  return applyMinimumSeverity(severityAi, minimumSeverity, 'biológico');
};

const validateErgonomicSeverity = (
  input: RiskFactorSeverityValidationInput,
): RiskFactorSeverityValidationResult => {
  const severityAi = input.aiResponse.severity;
  const contextText = collectValidationContext(input.payload, input.aiResponse);

  if (!matchesAny(contextText, ERGONOMIC_PATTERNS)) {
    return noAdjustment(severityAi);
  }

  let minimumSeverity = 2;
  if (matchesAny(contextText, ERGONOMIC_HIGH_PATTERNS)) minimumSeverity = 5;
  else if (matchesAny(contextText, ERGONOMIC_MODERATE_PATTERNS)) minimumSeverity = 3;

  return applyMinimumSeverity(severityAi, minimumSeverity, 'ergonômico');
};

const validateAccidentSeverity = (
  input: RiskFactorSeverityValidationInput,
): RiskFactorSeverityValidationResult => {
  const severityAi = input.aiResponse.severity;
  const contextText = collectValidationContext(input.payload, input.aiResponse);

  if (!matchesAny(contextText, ACCIDENT_PATTERNS)) {
    return noAdjustment(severityAi);
  }

  let minimumSeverity = 2;
  if (matchesAny(contextText, ACCIDENT_HIGH_PATTERNS)) minimumSeverity = 4;
  else if (matchesAny(contextText, [/\bincapacidade\b/i])) minimumSeverity = 3;

  return applyMinimumSeverity(severityAi, minimumSeverity, 'de acidente');
};

export const validateRiskFactorSuggestedSeverity = (
  input: RiskFactorSeverityValidationInput,
): RiskFactorSeverityValidationResult => {
  const severityAi = input.aiResponse.severity;
  const type = normalizeRiskFactorType(input.payload.type);

  switch (type) {
    case 'QUI':
      return validateChemicalOrPhysicalSeverity(input, 'químico');
    case 'FIS':
      return validateChemicalOrPhysicalSeverity(input, 'físico');
    case 'BIO':
      return validateBiologicalSeverity(input);
    case 'ERG':
      return validateErgonomicSeverity(input);
    case 'ACI':
      return validateAccidentSeverity(input);
    case 'OUTROS':
      return validateChemicalOrPhysicalSeverity(input, 'diverso');
    default:
      return noAdjustment(severityAi);
  }
};

/** @deprecated Use validateRiskFactorSuggestedSeverity */
export const validateChemicalRiskSuggestedSeverity = validateRiskFactorSuggestedSeverity;

export type ChemicalRiskSeverityValidationInput = RiskFactorSeverityValidationInput;
export type ChemicalRiskSeverityValidationResult = RiskFactorSeverityValidationResult;
