import {
  IRiskFactorAiSuggestionsUseCase,
  RiskFactorAiSuggestionSourceTraceItem,
} from '../risk-factor-ai-suggestions.types';

export type ChemicalRiskSeverityValidationInput = {
  payload: IRiskFactorAiSuggestionsUseCase.Params;
  aiResponse: Pick<
    IRiskFactorAiSuggestionsUseCase.Result,
    'risk' | 'symptoms' | 'severity'
  >;
};

export type ChemicalRiskSeverityValidationResult = {
  severity: number;
  severityAi: number;
  severityAdjusted: boolean;
  severityAdjustmentReason?: string;
  warning?: string;
  sourceTraceEntry?: RiskFactorAiSuggestionSourceTraceItem;
};

const MINIMAL_RISK_PATTERNS = [
  /\birrita/i,
  /\bmucosa/i,
  /\bolhos?\b/i,
  /\bpele\b/i,
  /\brespirat/i,
  /\bnariz\b/i,
  /\bgarganta\b/i,
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

const MODERATE_RISK_PATTERNS = [
  /\bdepress[aã]o do sistema nervoso central\b/i,
  /\bdepress[aã]o do snc\b/i,
  /\bedema pulmonar\b/i,
  /\btoxicidade sist[eê]mica\b/i,
  /\b[oó]rg[aã]os?[- ]alvo\b/i,
  /\bcarcinog[eê]nic/i,
  /\bteratog[eê]nic/i,
  /\bmutag[eê]nic/i,
  /\btoxicidade reprodutiva\b/i,
  /\birrita[cç][aã]o respirat[oó]ria\b/i,
  /\bevitar exposi[cç][aã]o prolongada\b/i,
  /\bdano (?:ocular|cut[aâ]neo|hep[aá]tico|renal|pulmonar|neurol[oó]gico)\b/i,
  /\befeitos (?:adversos|nocivos) (?:moderados|relevantes)\b/i,
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
  aiResponse: ChemicalRiskSeverityValidationInput['aiResponse'],
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

const detectRiskSignals = (
  contextText: string,
  hasLimits: boolean,
  knownData: IRiskFactorAiSuggestionsUseCase.Params['knownData'],
) => {
  const hasCarcinogenicityData = Boolean(
    knownData?.carcinogenicityAcgih?.trim() ||
      knownData?.carcinogenicityLinach?.trim(),
  );

  const hasAnyOccupationalRisk =
    hasLimits ||
    hasCarcinogenicityData ||
    Boolean(knownData?.risk?.trim()) ||
    Boolean(knownData?.symptoms?.trim()) ||
    matchesAny(contextText, MINIMAL_RISK_PATTERNS);

  const hasModerateRisk =
    hasCarcinogenicityData || matchesAny(contextText, MODERATE_RISK_PATTERNS);

  return { hasAnyOccupationalRisk, hasModerateRisk };
};

const resolveMinimumSeverity = (signals: {
  hasAnyOccupationalRisk: boolean;
  hasModerateRisk: boolean;
}): number => {
  if (signals.hasModerateRisk) return 3;
  if (signals.hasAnyOccupationalRisk) return 2;
  return 1;
};

export const validateChemicalRiskSuggestedSeverity = ({
  payload,
  aiResponse,
}: ChemicalRiskSeverityValidationInput): ChemicalRiskSeverityValidationResult => {
  const severityAi = aiResponse.severity;
  const type = (payload.type ?? 'QUI').toUpperCase();

  if (type !== 'QUI') {
    return {
      severity: severityAi,
      severityAi,
      severityAdjusted: false,
    };
  }

  const contextText = collectValidationContext(payload, aiResponse);
  const hasLimits = hasFilledLimits(payload.limits);
  const signals = detectRiskSignals(contextText, hasLimits, payload.knownData);
  const minimumSeverity = resolveMinimumSeverity(signals);

  if (severityAi >= minimumSeverity) {
    return {
      severity: severityAi,
      severityAi,
      severityAdjusted: false,
    };
  }

  const severity = minimumSeverity;
  const reason = `Severidade ajustada de ${severityAi} para ${severity} por regra de consistência técnica: agente químico com efeitos adversos ou dados ocupacionais reconhecidos.`;

  return {
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
  };
};
